import { createContext, useContext, useState, useEffect } from "react";
import { usePost } from "./PostContext";

const FilterContext = createContext();
export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: "all",
    location: { state: "all", district: "all" },
    organic: false,
    availability: "all",
  });
  const { posts = [] } = usePost();
  const [filteredPosts, setFilteredPosts] = useState(posts);

  /* --- recompute whenever filters or posts change --- */
  useEffect(() => {
    // if (!Array.isArray(posts)) return;
    const next = posts.filter((p) => {
      const matchCat = filters.category === "all" || p.category === filters.category;
      const matchState = filters.location.state === "all" || p.location.state === filters.location.state;
      const matchDist = filters.location.district === "all" || p.location.district === filters.location.district;
      const matchOrg = !filters.organic || p.isOrganic;
      const matchAvail = filters.availability === "all" || p.isAvailable === (filters.availability === "true");
      return matchCat && matchState && matchDist && matchOrg && matchAvail;
    });
    setFilteredPosts(next);
  }, [filters, posts]);

  const updateFilters = (obj) => setFilters((prev) => ({ ...prev, ...obj }));

  return (
    <FilterContext.Provider value={{ filters, updateFilters, filteredPosts }}>
      {children}
    </FilterContext.Provider>
  );
};
