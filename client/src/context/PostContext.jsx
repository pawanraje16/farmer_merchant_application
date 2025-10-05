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

  return (
    <PostContext.Provider value={{ posts, setPosts, fetchPosts, isLoadingPosts, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};
