"use client";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./theme";
import { useEffect } from "react";
import getSession from "@/lib/supabase/getSession";
import { useAuthStore } from "@/store/authStore";

export default function Chakra({ children }) {
    const { setSession, setUser, user } = useAuthStore();
    useEffect(() => {
        (async () => {
            const session = await getSession();
            if (session.isAuhenticated) {
                setUser(session.data.user);
            }
        })();
    }, []);
    return (
        <ChakraProvider theme={customTheme}>
            {children}
        </ChakraProvider>
    );
}
