"use client";

import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Star, ChefHat, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useFavoritesStore } from "@/lib/store/favorites-store";

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const isFav = isFavorite(product.$id);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product, quantity);
            setQuantity(1);
        }
    };

    const adjustQuantity = (e: React.MouseEvent, adjustment: number) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(prev => Math.max(1, prev + adjustment));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="h-full"
        >
            <Card
                className="h-full border-slate-200 dark:border-slate-800 overflow-hidden group relative flex flex-col"
                style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: 'var(--radius-card)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Imagen del producto */}
                <div className="block relative aspect-[4/3] overflow-hidden z-10" style={{ borderTopLeftRadius: 'var(--radius-card)', borderTopRightRadius: 'var(--radius-card)' }}>
                    <Link href={`/product/${product.$id}`}>
                        <motion.div
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            {product.imageUrl ? (
                                <>
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className={cn(
                                            "object-cover transition-all duration-700",
                                            imageLoaded ? "blur-0" : "blur-sm"
                                        )}
                                        onLoad={() => setImageLoaded(true)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: isHovered ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                                    />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
                                    <ChefHat size={40} className="mb-2 opacity-30" />
                                    <span className="text-sm font-medium">Sin Imagen</span>
                                </div>
                            )}
                        </motion.div>
                    </Link>

                    {/* Botón de favoritos - Absolute sobre la imagen */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product);
                        }}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md transition-colors hover:bg-white dark:hover:bg-slate-800"
                    >
                        <Heart
                            size={20}
                            className={cn(
                                "transition-colors duration-300",
                                isFav ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300 hover:text-red-500"
                            )}
                        />
                    </motion.button>

                    {/* Badge de estado agotado */}
                    <AnimatePresence>
                        {!product.isAvailable && (
                            <motion.div
                            // ...
                            >
                                {/* ... */}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Badge de popularidad */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-4 left-4 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"
                        style={{ background: 'var(--accent)' }}
                    >
                        <Star size={12} className="fill-white" />
                        Popular
                    </motion.div>
                    {/* Badge de descuento */}
                    {product.discountPercentage && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-12 left-4 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm"
                            style={{ background: 'var(--secondary)' }}
                        >
                            -{product.discountPercentage}%
                        </motion.div>
                    )}

                    {/* Stock Badge */}
                    {product.stock !== undefined && product.stock <= 10 && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: product.discountPercentage ? 0.4 : 0.3 }}
                            className={`absolute ${product.discountPercentage ? 'top-20' : 'top-12'} left-4 px-2 py-1 rounded-md text-xs font-bold shadow-sm ${product.stock === 0
                                    ? 'bg-red-500 text-white'
                                    : 'bg-yellow-500 text-white'
                                }`}
                        >
                            {product.stock === 0 ? '❌ AGOTADO' : `⚡ Solo ${product.stock}`}
                        </motion.div>
                    )}
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col p-6 relative z-10">
                    <Link href={`/product/${product.$id}`} className="group/title mb-3">
                        <motion.h3
                            className="font-bold text-xl leading-tight group-hover/title:opacity-80 transition-opacity duration-300"
                            style={{ color: 'var(--text)' }}
                        >
                            {product.name}
                        </motion.h3>
                    </Link>

                    <p
                        className="text-sm line-clamp-2 mb-auto leading-relaxed"
                        style={{ color: 'var(--muted)' }}
                    >
                        {product.description}
                    </p>

                    {/* Separador sutil */}
                    <motion.div
                        initial={{ scaleX: 0.3 }}
                        animate={{ scaleX: isHovered ? 1 : 0.3 }}
                        transition={{ duration: 0.4 }}
                        className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-4"
                    />

                    {/* Precio y controles */}
                    <div className="space-y-4">
                        <div className="flex items-end justify-between gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                                    Precio
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-none">
                                        ${product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-slate-400 line-through decoration-slate-400/50">
                                            ${product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Selector de cantidad mejorarado */}
                            {product.isAvailable && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-1 rounded-full px-1.5 py-1.5 shadow-sm border border-slate-100 dark:border-slate-800"
                                    style={{ background: 'var(--surface)' }}
                                >
                                    <button
                                        type="button"
                                        onClick={(e) => adjustQuantity(e, -1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-90"
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white'
                                        }}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={14} strokeWidth={3} />
                                    </button>

                                    <motion.span
                                        key={quantity}
                                        initial={{ scale: 1.3, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="font-bold w-6 text-center text-sm"
                                        style={{ color: 'var(--text)' }}
                                    >
                                        {quantity}
                                    </motion.span>

                                    <button
                                        type="button"
                                        onClick={(e) => adjustQuantity(e, 1)}
                                        disabled={product.stock !== undefined && quantity >= product.stock}
                                        className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:opacity-90 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white'
                                        }}
                                    >
                                        <Plus size={14} strokeWidth={3} />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Botón de agregar al carrito */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                className={cn(
                                    "w-full rounded-2xl font-bold h-14 text-base relative overflow-hidden group/button",
                                    product.isAvailable
                                        ? "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40"
                                        : "opacity-60 cursor-not-allowed"
                                )}
                                onClick={handleAdd}
                                disabled={!product.isAvailable || (product.stock !== undefined && product.stock === 0)}
                                size="lg"
                            >
                                {/* Efecto de brillo en hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />

                                {product.isAvailable ? (
                                    <span className="flex items-center gap-3 relative z-10">
                                        <motion.div
                                            animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <ShoppingCart size={20} />
                                        </motion.div>
                                        <span>Agregar</span>
                                        <span className="mx-1 opacity-50">•</span>
                                        <span className="font-black">
                                            ${(product.price * quantity).toLocaleString()}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="relative z-10">No Disponible</span>
                                )}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
