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

  return (
    <PostContext.Provider value={{ posts, setPosts, fetchPosts, isLoadingPosts }}>
      {children}
    </PostContext.Provider>
  );
};
