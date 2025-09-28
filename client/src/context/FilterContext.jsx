import { createContext, useContext, useState, useEffect } from "react";
import { usePost } from "./PostContext";

const FilterContext = createContext();
export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: "all",
    location: "all",
    organic: false,
    availability: "all",
    searchQuery: "",
    priceRange: "all",
    sortBy: "latest",
  });
  const { posts = [] } = usePost();
  const [filteredPosts, setFilteredPosts] = useState(posts);

  /* --- recompute whenever filters or posts change --- */
  useEffect(() => {
    if (!Array.isArray(posts)) return;

    let next = posts.filter((p) => {
      // Category filter (required - cannot be empty)
      const matchCat = filters.category === "all" || p.category === filters.category;

      // Location filter
      const matchLocation = filters.location === "all" || p.location?.state === filters.location;

      // Organic filter
      const matchOrg = !filters.organic || p.isOrganic;

      // Availability filter
      const matchAvail = filters.availability === "all" || p.isAvailable === (filters.availability === "available");

      // Search query filter
      const matchSearch = !filters.searchQuery ||
        p.title?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.cropType?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.author?.username?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.author?.fullname?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      // Price range filter
      const matchPrice = filters.priceRange === "all" || (() => {
        const price = p.price;
        switch (filters.priceRange) {
          case "0-50": return price >= 0 && price <= 50;
          case "50-100": return price > 50 && price <= 100;
          case "100-200": return price > 100 && price <= 200;
          case "200+": return price > 200;
          default: return true;
        }
      })();

      return matchCat && matchLocation && matchOrg && matchAvail && matchSearch && matchPrice;
    });

    // Apply sorting
    if (filters.sortBy) {
      next = next.sort((a, b) => {
        switch (filters.sortBy) {
          case "latest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "popular":
            return (b.likesCount || 0) - (a.likesCount || 0);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    setFilteredPosts(next);
  }, [filters, posts]);

  const updateFilters = (obj) => setFilters((prev) => ({ ...prev, ...obj }));

  return (
    <FilterContext.Provider value={{ filters, updateFilters, filteredPosts }}>
      {children}
    </FilterContext.Provider>
  );
};
