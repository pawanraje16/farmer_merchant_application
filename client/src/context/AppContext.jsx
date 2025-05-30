import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    
    const [user, setUser] = useState(null);
    const [isFarmer, setIsFarmer] = useState(false);

    const value ={user, setUser, setIsFarmer, isFarmer}
    
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () =>{
    return useAppContext(AppContext)
}