import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "light",  
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem(storageKey) === "dark" ? "dark" : "light"
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme) => {
      if (newTheme === "dark" || newTheme === "light") {
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      } else {
        console.warn(`Invalid theme: ${newTheme}. Only "dark" and "light" are allowed.`)
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
