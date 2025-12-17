"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, RefreshCcw, Tag, Percent } from "lucide-react";
import { useState, useEffect } from "react";
import { Discount, Product } from "@/types";
import Link from "next/link";
import { api } from "@/services/api";

// Loading fallback component
function LoadingState() {
    return (
        <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
    );
}

// Main content component - wrapped in Suspense
function DiscountsContent() {
    const [discounts, setDiscounts] = useState<(Discount & { product?: Product })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDiscounts = async () => {
        setLoading(true);
        try {
            const response = await api.discounts.list('694335e800262290919c');
            if (response.documents.length > 0) {
                const discountsData = response.documents as unknown as Discount[];

                // Fetch product details for each discount
                const discountsWithProducts = await Promise.all(
                    discountsData.map(async (discount) => {
                        try {
                            const product = await api.products.get(discount.productId);
                            return {
                                ...discount,
                                product: product as unknown as Product
                            };
                        } catch {
                            return discount;
                        }
                    })
                );

                setDiscounts(discountsWithProducts);
            } else {
                setDiscounts([]);
            }
            setError(false);
        } catch (err) {
            console.error("Failed to fetch discounts:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este descuento?')) return;
        try {
            await api.discounts.delete(id);
            setDiscounts(discounts.filter(d => d.$id !== id));
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el descuento');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Descuentos Activos</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <LoadingState />
                ) : error ? (
                    <div className="text-center py-10 text-red-500">
                        <p>Error al cargar descuentos.</p>
                        <Button variant="ghost" className="mt-2" onClick={fetchDiscounts}>
                            <RefreshCcw className="mr-2 h-4 w-4" /> Reintentar
                        </Button>
                    </div>
                ) : discounts.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <Tag className="mx-auto h-12 w-12 mb-3 text-slate-300" />
                        <p className="font-medium">No tienes descuentos aún.</p>
                        <p className="text-sm mt-1">¡Crea el primero para atraer más clientes!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {discounts.map((discount) => (
                            <div
                                key={discount.$id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-lg">
                                            {discount.product?.name || 'Producto no encontrado'}
                                        </h4>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm font-bold">
                                            <Percent size={14} />
                                            {discount.percentage}% OFF
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-3 text-sm">
                                        <span className="text-muted-foreground line-through">
                                            ${discount.originalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 font-bold text-base">
                                            ${discount.finalPrice.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Ahorro: ${(discount.originalPrice - discount.finalPrice).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/dashboard/discounts/${discount.$id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Pencil size={18} className="text-blue-500" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(discount.$id)}
                                    >
                                        <Trash2 size={18} className="text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Main page component - CRITICAL: Wraps content in Suspense
export default function DiscountsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Descuentos</h2>
                    <p className="text-muted-foreground">Gestiona los descuentos de tus productos.</p>
                </div>
                <Link href="/dashboard/discounts/create">
                    <Button className="gap-2">
                        <Plus size={18} /> Nuevo Descuento
                    </Button>
                </Link>
            </div>

            {/* CRITICAL: Suspense boundary to prevent Vercel build errors */}
            <Suspense fallback={<LoadingState />}>
                <DiscountsContent />
            </Suspense>
        </div>
    );
}
