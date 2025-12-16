"use client";

import { useSearchParams } from "next/navigation";
import { ThemeController } from "./theme-controller";

/**
 * PreviewModeHandler - Detects preview mode from search params
 * This component must be wrapped in Suspense to handle useSearchParams
 */
export function PreviewModeHandler() {
    const searchParams = useSearchParams();
    const isPreviewMode = searchParams.get("preview") === "true";

    return <ThemeController isPreviewMode={isPreviewMode} />;
}
