/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { axiosInstance } from "@/utils/axiosInstance";
import { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";


type User = {
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
  email: string,
  dob: string
   

}

type AuthContext = {
    user: User | null,
    loading: boolean,
    error: string | null,
}

const AuthContext = createContext<AuthContext>({
    user: null,
    loading: false,
    error: null,
});


export default function AuthProvider ({children}:{children: React.ReactNode}){
    const [user , setUser] =  useState <User | null>(null);
    const [loading, setLoading] =  useState<boolean>(false);
    const [error , setError] = useState<string | null>(null);
    

    useEffect(() => {
        async function getLoginUser() {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/auth/login/user');
                if (response.status === 200 || response.status === 201) {
                    setUser(response.data.user);
                    setLoading(false);
                    setError(null);
                    
                }
            } catch (e: any) {
                console.log(e);
                setLoading(false);
                setUser(null)
                setError(e.message);
            } finally {
                setLoading(false);
               
            }
        }

        getLoginUser();
    }, []);
    return (
        

            <AuthContext.Provider value={{user , loading, error}}>
                {children}
            </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext);

