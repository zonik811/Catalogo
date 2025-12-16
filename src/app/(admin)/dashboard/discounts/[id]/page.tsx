"use client";

import { DiscountForm } from "@/components/admin/discount-form";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { Discount, Product } from "@/types";
import { api } from "@/services/api";

export default function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [discount, setDiscount] = useState<(Discount & { product?: Product }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscount = async () => {
            try {
                const data = await api.discounts.get(id);
                const discountData = data as unknown as Discount;

                // Fetch product details
                try {
                    const productData = await api.products.get(discountData.productId);
                    setDiscount({
                        ...discountData,
                        product: productData as unknown as Product
                    });
                } catch {
                    setDiscount(discountData);
                }
            } catch (error) {
                console.error("Error fetching discount:", error);
                alert("Error al cargar el descuento");
                router.push('/dashboard/discounts');
            } finally {
                setLoading(false);
            }
        };

        fetchDiscount();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!discount) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/discounts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Editar Descuento</h2>
                    <p className="text-muted-foreground">Modifica el descuento del producto.</p>
                </div>
            </div>

            <DiscountForm
                initialData={discount}
                businessId="694062d100189a008a18"
                onSuccess={() => router.push('/dashboard/discounts')}
            />
        </div>
    );
}
