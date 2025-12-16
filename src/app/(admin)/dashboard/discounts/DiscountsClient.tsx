"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Discount {
    $id: string;
    productId: string;
    businessId: string;
    originalPrice: number;
    percentage: number;
    finalPrice: number;
}

interface Product {
    $id: string;
    name: string;
    price: number;
}

export default function DiscountsClient() {
    const router = useRouter();
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const businessId = "694062d100189a008a18"; // Idealmente de contexto/store

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [discountsRes, productsRes] = await Promise.all([
                api.discounts.list(businessId),
                api.products.list(businessId),
            ]);

            setDiscounts(discountsRes.documents as any[]);
            setProducts(productsRes.documents as any[]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getProductName = (productId: string) => {
        const product = products.find((p) => p.$id === productId);
        return product?.name || "Producto desconocido";
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este descuento?")) return;

        try {
            await api.discounts.delete(id);
            setDiscounts(discounts.filter((d) => d.$id !== id));
        } catch (error) {
            console.error("Error deleting discount:", error);
            alert("Error al eliminar el descuento");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Descuentos</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Gestiona los descuentos de tus productos
                    </p>
                </div>
                <Button onClick={() => router.push("/dashboard/discounts/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Descuento
                </Button>
            </div>

            {discounts.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-slate-500 mb-4">No hay descuentos creados</p>
                    <Button onClick={() => router.push("/dashboard/discounts/create")}>
                        Crear primer descuento
                    </Button>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-right">Precio Original</TableHead>
                                <TableHead className="text-right">Descuento</TableHead>
                                <TableHead className="text-right">Precio Final</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {discounts.map((discount) => (
                                <TableRow key={discount.$id}>
                                    <TableCell className="font-medium">
                                        {getProductName(discount.productId)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${discount.originalPrice.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                            -{discount.percentage}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                        ${discount.finalPrice.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    router.push(`/dashboard/discounts/${discount.$id}`)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(discount.$id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
