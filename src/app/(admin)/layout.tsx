// app/(admin)/layout.tsx
"use client";

import { Suspense } from "react";
import { Store, LogOut } from "lucide-react";
import AdminNav from "./AdminNav";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/auth-guard";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            toast.success("Sesión cerrada correctamente");
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error("Error al cerrar sesión");
        }
    };

    return (
        <AuthGuard>
            <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <Store className="text-primary" />
                        <h1 className="font-bold text-xl">Admin Panel</h1>
                    </div>

                    <Suspense fallback={<div className="p-4">Cargando...</div>}>
                        <AdminNav />
                    </Suspense>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
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
        </AuthGuard>
    );
}
