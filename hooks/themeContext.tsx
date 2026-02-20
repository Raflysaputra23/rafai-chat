"use client"

import { createContext, useEffect, useState } from 'react'

interface ThemeContextProps {
    theme: string;
    toggleTheme: () => void;
    isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextProps>({ theme: "dark", toggleTheme: () => { }, isDark: true });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState(() => {
        if(typeof window !== "undefined") {
            return localStorage.getItem("theme") || "dark";
        }
        return "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = (prev === "dark") ? "light" : "dark";
            document.documentElement.classList.remove(prev);
            document.documentElement.classList.add(newTheme);
            return newTheme;
        });
    };


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === "dark" }}>
            {children}
        </ThemeContext.Provider>
    )
}


