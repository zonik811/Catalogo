"use client";

import { DiscountForm } from "@/components/admin/discount-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateDiscountPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/discounts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Crear Descuento</h2>
                    <p className="text-muted-foreground">Agrega un nuevo descuento a un producto.</p>
                </div>
            </div>

            <DiscountForm
                businessId="694062d100189a008a18"
                onSuccess={() => router.push('/dashboard/discounts')}
            />
        </div>
    );
}
