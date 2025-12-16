"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingCart, Share2 } from "lucide-react";
import { api } from "@/services/api";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCartStore();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return;
            try {
                const productData = await api.products.get(params.id as string);
                const product = productData as unknown as Product;
                setProduct(product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        alert('Producto agregado al carrito');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
                <h2 className="text-xl font-semibold">Producto no encontrado</h2>
                <Button onClick={() => router.back()}>Volver</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 md:pb-10 font-[family-name:var(--font-geist-sans)]">
            {/* Immersive Image Section - Mobile Full width, Desktop Side by Side */}
            <main className="md:max-w-6xl md:mx-auto md:p-8 md:grid md:grid-cols-2 md:gap-12 md:items-start md:pt-12">

                {/* Mobile Header (Floating) */}
                <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-4 md:hidden pointer-events-none">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white pointer-events-auto"
                        onClick={() => router.push('/')}
                    >
                        <ArrowLeft size={20} className="text-slate-900" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white pointer-events-auto"
                    >
                        <Share2 size={20} className="text-slate-900" />
                    </Button>
                </div>

                {/* Desktop Header (Breadcrumb style) */}
                <div className="hidden md:flex flex-col gap-4 absolute top-8 left-8">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.push('/')}>
                        <ArrowLeft size={20} />
                        Volver al menú
                    </Button>
                </div>

                {/* Image Container */}
                <div className="relative w-full h-[50vh] md:h-[600px] md:rounded-3xl overflow-hidden shadow-2xl bg-slate-200">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            Sin Imagen
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="relative -mt-6 rounded-t-3xl bg-white dark:bg-slate-950 p-6 md:mt-0 md:p-0 md:bg-transparent md:rounded-none z-10 shadow-lg md:shadow-none min-h-[50vh]">
                    {/* Handle bar for mobile feel */}
                    <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6 md:hidden" />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
                                    {product.name}
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-primary">
                                        ${product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xl text-slate-400 line-through decoration-slate-400/50">
                                            ${product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {product.discountPercentage && (
                                    <span className="text-sm font-bold text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-0.5 rounded-md w-fit mt-1">
                                        Ahorras {product.discountPercentage}%
                                    </span>
                                )}
                            </div>

                            {product.isAvailable ? (
                                <span className="ml-auto px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wide rounded-full h-fit">
                                    Disponible
                                </span>
                            ) : (
                                <span className="ml-auto px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wide rounded-full h-fit">
                                    Agotado
                                </span>
                            )}
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed border-t border-b border-slate-100 dark:border-slate-800 py-6">
                            {product.description || "Nuestros chefs han preparado este plato con los mejores ingredientes seleccionados para ti."}
                        </p>

                        {/* Desktop Controls (Inline) */}
                        <div className="hidden md:block space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold text-lg text-slate-700 dark:text-slate-300">Cantidad</span>
                                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-1">
                                    <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                        <Minus size={18} />
                                    </Button>
                                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                                    <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                                        <Plus size={18} />
                                    </Button>
                                </div>
                            </div>
                            <Button
                                className="w-full text-lg h-14 gap-3 text-white bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-xl"
                                onClick={handleAddToCart}
                                disabled={!product.isAvailable}
                            >
                                <ShoppingCart size={24} />
                                Agregar al Pedido • ${(product.price * quantity).toLocaleString()}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Mobile Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 md:hidden z-20 safe-bottom">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                            <Minus size={18} />
                        </Button>
                        <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                            <Plus size={18} />
                        </Button>
                    </div>
                    <Button
                        className="flex-1 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 text-white"
                        onClick={handleAddToCart}
                        disabled={!product.isAvailable}
                    >
                        <ShoppingCart className="mr-2" size={20} />
                        Agregar • ${(product.price * quantity).toLocaleString()}
                    </Button>
                </div>
            </div>
        </div >
    );
}
