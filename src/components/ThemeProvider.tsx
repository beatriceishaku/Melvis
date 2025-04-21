
import React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <div className="min-h-screen bg-blue-50">{children}</div>;
}
