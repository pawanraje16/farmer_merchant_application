import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const PostContext = createContext();
export const usePost = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const  response  = await api.get("/api/v1/post/feed");
      const postArray = response.data.data;
      setPosts(postArray);
    } catch (err) {
      toast.error(err.meassage +"Couldn't fetch posts");
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await api.delete(`/api/v1/post/${postId}`);
      if (response.data.success) {
        // Remove the deleted post from the posts array
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        toast.success("Post deleted successfully");
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
      return false;
    }
  };

  const togglePostAvailability = async (postId, isAvailable) => {
    try {
      const response = await api.patch(`/api/v1/post/${postId}/availability`, { isAvailable });
      if (response.data.success) {
        // Update the post in the posts array
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, isAvailable } : post
          )
        );
        toast.success(isAvailable ? "Marked as available" : "Marked as sold out");
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update availability");
      return false;
    }
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, fetchPosts, isLoadingPosts, deletePost, togglePostAvailability }}>
      {children}
    </PostContext.Provider>
  );
};
