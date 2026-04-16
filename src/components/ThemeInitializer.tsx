'use client'

import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore"

export function ThemeInitializer() {
    const initializeTheme = useThemeStore((state) => state.initializeTheme);

    useEffect(() => {
        const cleanup = initializeTheme();
        return cleanup
    }, [initializeTheme])

    return null;
}