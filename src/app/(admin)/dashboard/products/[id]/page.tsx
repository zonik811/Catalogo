"use client";

import { ProductForm } from "@/components/admin/product-form";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { Product } from "@/types";
import { api } from "@/services/api";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.products.get(id);
                setProduct(data as unknown as Product);
            } catch (error) {
                console.error("Error fetching product:", error);
                alert("Error al cargar el producto");
                router.push('/dashboard/products');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Editar Producto</h2>
                    <p className="text-muted-foreground">Modifica los detalles de tu producto.</p>
                </div>
            </div>

            <ProductForm
                initialData={product}
                businessId="694335e800262290919c"
                onSuccess={() => router.push('/dashboard/products')}
            />
        </div>
    );
}
