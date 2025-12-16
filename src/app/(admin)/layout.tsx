"use client";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Store, Tag, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: ShoppingBag, label: 'Productos', href: '/dashboard/products' },
        { icon: Tag, label: 'Descuentos', href: '/dashboard/discounts' },
        { icon: Palette, label: 'Editor Visual', href: '/dashboard/theme-editor' },
        { icon: Settings, label: 'Configuración', href: '/dashboard/settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Store className="text-primary" />
                    <h1 className="font-bold text-xl">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={cn("w-full justify-start gap-2", isActive ? "" : "text-slate-500")}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut size={18} />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
