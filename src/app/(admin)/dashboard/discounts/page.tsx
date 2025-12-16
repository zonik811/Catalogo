"use client";

import { Suspense } from "react";
import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const DiscountsClient = nextDynamic(() => import("./DiscountsClient"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    ),
});

export default function DiscountsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <DiscountsClient />
        </Suspense>
    );
}
