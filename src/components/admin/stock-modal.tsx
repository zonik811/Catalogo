"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { Package, Loader2, X } from "lucide-react";

interface StockModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    currentStock?: number;
    onSuccess: () => void;
}

export function StockModal({
    isOpen,
    onClose,
    productId,
    productName,
    currentStock = 0,
    onSuccess,
}: StockModalProps) {
    const [stock, setStock] = useState(currentStock);
    const [minStock, setMinStock] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const businessId = "694062d100189a008a18";

            // Check if inventory record exists
            const existing = await api.inventory.getByProduct(productId);

            if (existing) {
                // Update existing
                await api.inventory.update(existing.$id, {
                    stock,
                    minStock,
                });
            } else {
                // Create new
                await api.inventory.create({
                    productId,
                    businessId,
                    stock,
                    minStock,
                });
            }

            alert("Stock actualizado exitosamente");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Error al actualizar el stock");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Gestionar Stock
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Actualiza el inventario de: <strong>{productName}</strong>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock Actual</Label>
                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(Number(e.target.value))}
                            required
                            className="text-lg font-bold"
                        />
                        <p className="text-xs text-muted-foreground">
                            Cantidad disponible para venta
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="minStock">Stock Mínimo (Alerta)</Label>
                        <Input
                            id="minStock"
                            type="number"
                            min="0"
                            value={minStock}
                            onChange={(e) => setMinStock(Number(e.target.value))}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Te alertamos cuando el stock esté por debajo de este número
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
