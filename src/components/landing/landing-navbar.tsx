"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";

export function LandingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { items } = useCartStore();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { label: "Inicio", action: () => scrollToSection("hero") },
        { label: "Quiénes Somos", action: () => scrollToSection("about") },
        { label: "Marcas", action: () => scrollToSection("brands") },
        { label: "Catálogo", href: "/shop" },
        { label: "FAQs", action: () => scrollToSection("faq") },
    ];

    return (
        <nav
            className="sticky top-0 z-50 backdrop-blur-md border-b"
            style={{
                background: 'var(--surface)',
                borderColor: 'var(--muted)',
                opacity: 0.95
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img src="/Logo.png" alt="Logo" className="h-16 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link, index) => (
                            link.href ? (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="font-medium hover:opacity-70 transition-opacity"
                                    style={{ color: 'var(--text)' }}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <button
                                    key={index}
                                    onClick={link.action}
                                    className="font-medium hover:opacity-70 transition-opacity"
                                    style={{ color: 'var(--text)' }}
                                >
                                    {link.label}
                                </button>
                            )
                        ))}

                        {/* Cart Icon */}
                        <Link href="/shop">
                            <Button size="sm" className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" style={{ color: 'var(--text)' }} />
                        ) : (
                            <Menu className="w-6 h-6" style={{ color: 'var(--text)' }} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t" style={{ borderColor: 'var(--muted)' }}>
                    <div className="px-4 py-6 space-y-4">
                        {navLinks.map((link, index) => (
                            link.href ? (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="block py-2 font-medium"
                                    style={{ color: 'var(--text)' }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <button
                                    key={index}
                                    onClick={link.action}
                                    className="block w-full text-left py-2 font-medium"
                                    style={{ color: 'var(--text)' }}
                                >
                                    {link.label}
                                </button>
                            )
                        ))}

                        {/* Cart Button Mobile */}
                        <Link href="/shop">
                            <Button className="w-full mt-4 relative">
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Ver Carrito
                                {itemCount > 0 && (
                                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
