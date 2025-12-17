"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // Verificar si hay sesión activa en Appwrite
            await account.get();
            setIsAuthenticated(true);
        } catch (error) {
            // No hay sesión válida → redirigir a login
            console.log('No authenticated session found, redirecting to login...');
            router.push("/login");
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // Si está autenticado, mostrar el contenido protegido
    return isAuthenticated ? <>{children}</> : null;
}
