"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu as MenuIcon, X, Home, UtensilsCrossed, LayoutDashboard, Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useFavoritesUI } from "@/components/shop/favorites-drawer";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import Image from "next/image";

// ... imports

function FavoritesButton() {
    const { favorites } = useFavoritesStore();
    const { toggleFavorites } = useFavoritesUI();
    const count = favorites.length;

    if (count === 0) return null;

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="hidden md:block"
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorites}
                className="relative rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-600 dark:text-slate-400 hover:text-red-500"
            >
                <Heart size={20} className={count > 0 ? "fill-red-500 text-red-500" : ""} />
            </Button>
        </motion.div>
    );
}

export function Navbar() {
    // ...
    const { toggleCart, items } = useCartStore();
    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [prevCartCount, setPrevCartCount] = useState(0);
    const { scrollY } = useScroll();

    // Efecto de scroll en el navbar
    const navbarBg = useTransform(
        scrollY,
        [0, 100],
        ["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.95)"]
    );

    const navbarShadow = useTransform(
        scrollY,
        [0, 100],
        ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.08)"]
    );

    useEffect(() => {
        setPrevCartCount(cartCount);
    }, [cartCount]);

    const navLinks = [
        { href: "/", label: "Inicio", icon: Home },
        { href: "/#catalog", label: "Menú", icon: UtensilsCrossed },
        { href: "/dashboard", label: "Admin", icon: LayoutDashboard },
    ];

    return (
        <motion.header
            style={{
                backgroundColor: 'var(--surface)',
                backdropFilter: 'blur(12px)',
            }}
            className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                {/* Logo con animación */}
                <Link href="/" className="group flex items-center gap-2.5">
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg"
                        style={{
                            background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
                            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                           <Image src="/src/logo.png" alt="Logo" width={32} height={32}className="object-contain"/>
                    </motion.div>
                    <span
                        className="text-xl md:text-2xl font-black tracking-tighter"
                        style={{ color: 'var(--text)' }}
                    >
                        MenúDigital
                    </span>
                </Link>

                {/* Desktop Nav con iconos y hover mejorado */}
                <nav className="hidden md:flex items-center gap-2">
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={link.href}
                                onClick={(e) => {
                                    if (link.href === "/#catalog") {
                                        e.preventDefault();
                                        const element = document.getElementById("catalog");
                                        if (element) {
                                            element.scrollIntoView({ behavior: "smooth" });
                                        } else if (window.location.pathname !== "/") {
                                            window.location.href = "/#catalog";
                                        }
                                    }
                                }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative overflow-hidden"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        layoutId="navHover"
                                    />
                                    <link.icon size={16} className="relative z-10 group-hover:text-primary transition-colors" />
                                    <span className="relative z-10 group-hover:text-primary transition-colors">{link.label}</span>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Botón de favoritos (Desktop) */}
                    <div className="flex items-center gap-2">
                        <FavoritesButton />

                        {/* Botón de carrito mejorado */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                onClick={toggleCart}
                                className="relative rounded-full px-6 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 overflow-visible"
                                variant="default"
                            >
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ShoppingCart size={22} className="mr-2" />
                                </motion.div>
                                <span className="font-bold text-base">Carrito</span>
                                {/* Badge del carrito - CORREGIDO */}
                                <AnimatePresence mode="wait">
                                    {cartCount > 0 && (
                                        <motion.span
                                            key={cartCount}
                                            initial={{ scale: 0 }}
                                            animate={{
                                                scale: [0, 1.2, 1],
                                                rotate: [0, 10, -10, 0]
                                            }}
                                            exit={{ scale: 0 }}
                                            transition={{
                                                duration: 0.4,
                                            }}
                                            className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-md ring-1 ring-white/50"
                                        >
                                            {cartCount}
                                            <motion.span
                                                className="absolute inset-0 rounded-full bg-red-400"
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{
                                                    scale: 1.8,
                                                    opacity: 0
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    repeatDelay: 0.5
                                                    // Sin type: "spring" funciona bien
                                                }}
                                            />
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                            </Button>
                        </motion.div>
                    </div>
                </nav>

                {/* Mobile Cart & Menu Toggle */}
                <div className="flex items-center gap-2 md:hidden">
                    <FavoritesButtonMobile />
                    <Button
                        onClick={toggleCart}
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    >
                        <ShoppingCart size={24} />
                        <AnimatePresence>
                            {cartCount > 0 && (
                                <motion.span
                                    key={cartCount}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.3, 1] }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                    >
                        <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={24} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MenuIcon size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu con stagger animation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800"
                    >
                        <motion.nav
                            className="flex flex-col p-4 gap-2"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                                open: {
                                    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
                                },
                                closed: {
                                    transition: { staggerChildren: 0.05, staggerDirection: -1 }
                                }
                            }}
                        >
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.href}
                                    variants={{
                                        open: {
                                            y: 0,
                                            opacity: 1,
                                            transition: {
                                                y: { stiffness: 1000, velocity: -100 }
                                            }
                                        },
                                        closed: {
                                            y: 20,
                                            opacity: 0,
                                            transition: {
                                                y: { stiffness: 1000 }
                                            }
                                        }
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-3 text-lg font-medium p-3 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 dark:hover:from-slate-800 dark:hover:to-slate-850 rounded-xl transition-all group"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <link.icon size={20} className="text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
                                        <span className="group-hover:text-primary transition-colors">{link.label}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

function FavoritesButtonMobile() {
    const { favorites } = useFavoritesStore();
    const { toggleFavorites } = useFavoritesUI();

    if (favorites.length === 0) return null;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorites}
            className="text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
        >
            <Heart size={24} className="fill-current" />
        </Button>
    )
}
