import React, { createContext, useState, useContext, useMemo } from 'react';

export const ThemeContext = createContext({
    theme: 'light',
    selectedCategory: null,
    setTheme: () => {},
    setSelectedCategory: () => {},
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const contextValue = useMemo(() => ({
        theme,
        selectedCategory,
        setTheme,
        setSelectedCategory,
    }), [theme, selectedCategory]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}