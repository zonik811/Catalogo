"use client";

import { Suspense } from "react";
import { ThemeController } from "./theme-controller";
import { PreviewModeHandler } from "./preview-mode-handler";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Use PreviewModeHandler in Suspense for client-side preview detection */}
            <Suspense fallback={<ThemeController isPreviewMode={false} />}>
                <PreviewModeHandler />
            </Suspense>
            {children}
        </>
    );
}
