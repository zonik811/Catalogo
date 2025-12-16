"use client";

import { Suspense } from "react";
import { ThemeController } from "./theme-controller";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={null}>
                <ThemeController />
            </Suspense>
            {children}
        </>
    );
}
