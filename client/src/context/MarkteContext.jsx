import { createContext, useContext, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const MarketContext = createContext();
export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const [rates, setRates] = useState([]);
  const [climate, setClimate] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

  const fetchMarketData = async () => {
    try {
      setLoadingMarket(true);
      const [{ data: r }, { data: c }, { data: s }] = await Promise.all([
        api.get("/api/market/rates"),       // your proxy or public API
        api.get("/api/market/climate"),     // e.g. OpenWeather wrapper
        api.get("/api/market/schemes"),     // govt schemes feed
      ]);
      setRates(r);
      setClimate(c);
      setSchemes(s);
    } catch (err) {
      toast.error("Market data unavailable");
    } finally {
      setLoadingMarket(false);
    }
  };

  return (
    <MarketContext.Provider value={{ rates, climate, schemes, loadingMarket, fetchMarketData }}>
      {children}
    </MarketContext.Provider>
  );
};
