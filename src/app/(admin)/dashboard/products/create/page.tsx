"use client";

import { ProductForm } from "@/components/admin/product-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateProductPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Nuevo Producto</h2>
                    <p className="text-muted-foreground">Agrega un nuevo ítem a tu catálogo.</p>
                </div>
            </div>

            <ProductForm
                businessId="694335e800262290919c" // ID real del negocio
                onSuccess={() => router.push('/dashboard/products')}
            />
        </div>
    );
}
