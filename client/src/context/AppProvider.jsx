import { AuthProvider }    from "./AuthContext.jsx";
import { PostProvider }    from "./PostContext.jsx";
import { FilterProvider }  from "./FilterContext.jsx";
import { MarketProvider }  from "./MarkteContext.jsx";
import { FeedProvider } from "./FeedContext.jsx";

import { MockDataProvider } from "./MockDataContext.jsx";

export const AppProvider = ({ children }) => (
  <AuthProvider>
    <PostProvider>
      <FilterProvider>
        <MarketProvider>
          
            <MockDataProvider>
                <FeedProvider>
                    {children}
                </FeedProvider>
            </MockDataProvider>
          
        </MarketProvider>
      </FilterProvider>
    </PostProvider>
  </AuthProvider>
);
