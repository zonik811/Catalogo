"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, RefreshCcw, Package } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import Link from "next/link";
import { api } from "@/services/api";
import { StockModal } from "@/components/admin/stock-modal";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // 'demo' was hardcoded. Now using real business ID.
            const response = await api.products.list('694062d100189a008a18');
            if (response.documents.length > 0) {
                setProducts(response.documents as unknown as Product[]);
            } else {
                setProducts([]);
            }
            setError(false);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await api.products.delete(id);
            // Refresh list
            setProducts(products.filter(p => p.$id !== id));
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el producto');
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
                    <p className="text-muted-foreground">Gestiona tu catálogo de productos.</p>
                </div>
                <Link href="/dashboard/products/create">
                    <Button className="gap-2">
                        <Plus size={18} /> Nuevo Producto
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            <p>Error al cargar productos.</p>
                            <Button variant="ghost" className="mt-2" onClick={fetchProducts}>
                                <RefreshCcw className="mr-2 h-4 w-4" /> Reintentar
                            </Button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <p>No tienes productos aún.</p>
                            <p className="text-sm">¡Crea el primero arriba!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => (
                                <div key={product.$id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-slate-400">Sin foto</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground">${product.price.toLocaleString()}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {product.isAvailable ? 'Disponible' : 'Agotado'}
                                                </span>
                                                {product.stock !== undefined && (
                                                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' :
                                                        product.stock <= 5 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        Stock: {product.stock}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setStockModalOpen(true);
                                            }}
                                            title="Gestionar Stock"
                                        >
                                            <Package size={18} className="text-purple-500" />
                                        </Button>
                                        <Link href={`/dashboard/products/${product.$id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil size={18} className="text-blue-500" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.$id)}>
                                            <Trash2 size={18} className="text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stock Modal */}
            {selectedProduct && (
                <StockModal
                    isOpen={stockModalOpen}
                    onClose={() => {
                        setStockModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    productId={selectedProduct.$id}
                    productName={selectedProduct.name}
                    currentStock={selectedProduct.stock}
                    onSuccess={fetchProducts}
                />
            )}
        </div>
    );
}
