"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useThemeStore } from "@/lib/store/theme-store";
import { api } from "@/services/api";

export function ThemeController() {
    const { theme, loadTheme } = useThemeStore();
    const searchParams = useSearchParams();
    const isPreviewMode = searchParams.get("preview") === "true";

    // Fetch theme from DB on mount (only if NOT in preview mode)
    useEffect(() => {
        if (isPreviewMode) {
            console.log("[Preview Mode] Waiting for theme updates from parent...");
            // In preview mode, listen for theme updates from parent window
            const handleMessage = (event: MessageEvent) => {
                if (event.data.type === "THEME_UPDATE") {
                    console.log("[Preview Mode] Received theme update:", event.data.theme);
                    loadTheme(event.data.theme);
                }
            };

            window.addEventListener("message", handleMessage);

            // Request initial theme from parent
            if (window.parent !== window) {
                window.parent.postMessage({ type: "REQUEST_THEME" }, "*");
            }

            return () => window.removeEventListener("message", handleMessage);
        } else {
            // Normal mode: fetch from DB
            const fetchTheme = async () => {
                try {
                    const businessId = process.env.NEXT_PUBLIC_BUSINESS_ID || "694062d100189a008a18";
                    const remoteTheme = await api.business.getTheme(businessId);
                    if (remoteTheme) {
                        console.log("[Normal Mode] Loaded theme from DB:", remoteTheme);
                        loadTheme(remoteTheme as any);
                    }
                } catch (e) {
                    console.error("Failed to load theme", e);
                }
            };

            fetchTheme();
        }
    }, [isPreviewMode, loadTheme]);

    // Apply theme to CSS variables
    useEffect(() => {
        console.log("[Theme Application] Applying theme:", theme);
        const root = document.documentElement;

        // Colors
        root.style.setProperty('--primary', theme.primaryColor);
        root.style.setProperty('--secondary', theme.secondaryColor);
        root.style.setProperty('--accent', theme.accentColor || theme.secondaryColor);
        root.style.setProperty('--background', theme.backgroundColor);
        root.style.setProperty('--surface', theme.surfaceColor);
        root.style.setProperty('--text', theme.textColor);
        root.style.setProperty('--muted', theme.mutedColor || theme.textColor);

        // Radios
        root.style.setProperty('--radius', theme.borderRadius);
        root.style.setProperty('--radius-button', theme.buttonRadius || theme.borderRadius);
        root.style.setProperty('--radius-card', theme.cardRadius || theme.borderRadius);

        // Shadows based on intensity
        const shadowMap = {
            none: '0 0 0 rgba(0,0,0,0)',
            subtle: '0 1px 3px rgba(0,0,0,0.1)',
            medium: '0 4px 6px rgba(0,0,0,0.1)',
            strong: '0 10px 15px rgba(0,0,0,0.2)',
        };
        const shadow = shadowMap[theme.shadowIntensity || 'medium'];
        root.style.setProperty('--shadow', shadow);

    }, [theme]);

    return null;
}
