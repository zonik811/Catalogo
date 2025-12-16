"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Percent, DollarSign } from "lucide-react";
import { Product, Discount } from "@/types";
import { api } from "@/services/api";

interface DiscountFormProps {
    initialData?: Discount & { product?: Product };
    businessId: string;
    onSuccess: () => void;
}

export function DiscountForm({ initialData, businessId, onSuccess }: DiscountFormProps) {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState(initialData?.productId || "");
    const [percentage, setPercentage] = useState(initialData?.percentage || 0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.products.list(businessId);
                const productList = response.documents as unknown as Product[];
                setProducts(productList);

                if (initialData?.productId) {
                    const product = productList.find(p => p.$id === initialData.productId);
                    setSelectedProduct(product || null);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [businessId, initialData]);

    useEffect(() => {
        if (selectedProductId) {
            const product = products.find(p => p.$id === selectedProductId);
            setSelectedProduct(product || null);
        }
    }, [selectedProductId, products]);

    const calculateFinalPrice = () => {
        if (!selectedProduct || !percentage) return 0;
        return selectedProduct.price * (1 - percentage / 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProduct || !percentage || percentage <= 0 || percentage >= 100) {
            alert("Por favor selecciona un producto y un porcentaje válido (1-99)");
            return;
        }

        setLoading(true);
        try {
            const discountData = {
                businessId,
                productId: selectedProduct.$id,
                originalPrice: selectedProduct.price,
                percentage,
                finalPrice: calculateFinalPrice(),
            };

            if (initialData?.$id) {
                await api.discounts.update(initialData.$id, discountData);
            } else {
                // Check if discount already exists for this product
                const existingDiscount = await api.discounts.getByProduct(selectedProduct.$id);
                if (existingDiscount) {
                    alert("Ya existe un descuento para este producto. Por favor edítalo en lugar de crear uno nuevo.");
                    setLoading(false);
                    return;
                }
                await api.discounts.create(discountData);
            }

            alert(initialData ? "Descuento actualizado" : "Descuento creado exitosamente");
            onSuccess();
        } catch (error) {
            console.error("Error saving discount:", error);
            alert("Error al guardar el descuento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{initialData ? "Editar Descuento" : "Crear Nuevo Descuento"}</CardTitle>
                    <CardDescription>
                        Define un descuento porcentual para un producto específico
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Product Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="product">Producto</Label>
                        <select
                            id="product"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            disabled={!!initialData || loading}
                            required
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >
                            <option value="">Selecciona un producto</option>
                            {products.map((product) => (
                                <option key={product.$id} value={product.$id}>
                                    {product.name} - ${product.price.toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Percentage Input */}
                    <div className="space-y-2">
                        <Label htmlFor="percentage">Porcentaje de Descuento</Label>
                        <div className="relative">
                            <Input
                                id="percentage"
                                type="number"
                                min="1"
                                max="99"
                                value={percentage || ""}
                                onChange={(e) => setPercentage(Number(e.target.value))}
                                placeholder="Ej: 20"
                                required
                                className="pr-10"
                            />
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ingresa un valor entre 1 y 99
                        </p>
                    </div>

                    {/* Price Preview */}
                    {selectedProduct && percentage > 0 && (
                        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Precio Original:</span>
                                        <span className="font-semibold">${selectedProduct.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                                        <span className="text-sm font-medium">Descuento ({percentage}%):</span>
                                        <span className="font-semibold">
                                            -${((selectedProduct.price * percentage) / 100).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-px bg-slate-200 dark:bg-slate-700" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Precio Final:</span>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                ${calculateFinalPrice().toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={loading || !selectedProductId || !percentage}
                            className="flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>{initialData ? "Actualizar" : "Crear"} Descuento</>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
