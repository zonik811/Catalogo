"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, TrendingUp, Package } from "lucide-react";
import { ordersApi } from "@/services/orders.api";
import { useBusinessStore } from "@/lib/store/business-store";
import { OrderStats } from "@/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { business } = useBusinessStore();
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
    }, [business]);

    const loadStats = async () => {
        if (!business) {
            setError("No se pudo cargar el negocio");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await ordersApi.getStats(business.$id);
            setStats(data);
            setError(null);
        } catch (err: any) {
            console.error("Error loading stats:", err);
            setError(err.message || "Error al cargar estadísticas");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Resumen general de tu negocio.</p>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No hay datos disponibles</p>
                            <p className="text-sm mt-2">Las órdenes confirmadas aparecerán aquí</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Ventas Totales',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            description: `${stats.totalOrders} órdenes totales`,
        },
        {
            label: 'Ventas Hoy',
            value: `$${stats.todayRevenue.toLocaleString()}`,
            icon: TrendingUp,
            description: `${stats.todayOrders} órdenes hoy`,
        },
        {
            label: 'Órdenes Totales',
            value: stats.totalOrders.toString(),
            icon: ShoppingBag,
            description: 'Desde el inicio',
        },
        {
            label: 'Promedio por Orden',
            value: stats.totalOrders > 0 ? `$${Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()}` : '$0',
            icon: Package,
            description: 'Ticket promedio',
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Resumen general de tu negocio.</p>
                </div>
                <button
                    onClick={loadStats}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    🔄 Actualizar
                </button>
            </div>

            {/* Tarjetas de métricas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.label}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Sección de Productos Más Vendidos */}
            <Card>
                <CardHeader>
                    <CardTitle>Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.topProducts.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No hay productos vendidos aún</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.topProducts.map((product, index) => (
                                <div key={product.productId} className="flex items-center gap-4">
                                    {/* Ranking badge */}
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' : ''}
                                        ${index === 1 ? 'bg-gray-100 text-gray-700' : ''}
                                        ${index === 2 ? 'bg-orange-100 text-orange-700' : ''}
                                        ${index > 2 ? 'bg-slate-100 text-slate-600' : ''}
                                    `}>
                                        {index + 1}
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-none truncate">
                                            {product.productName}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {product.totalQuantity} {product.totalQuantity === 1 ? 'unidad' : 'unidades'} vendidas
                                        </p>
                                    </div>

                                    {/* Revenue */}
                                    <div className="text-right">
                                        <div className="font-medium">
                                            ${product.totalRevenue.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            ${Math.round(product.totalRevenue / product.totalQuantity).toLocaleString()} c/u
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info card */}
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">💡</div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-1">Datos en tiempo real</h3>
                            <p className="text-sm text-muted-foreground">
                                Estas estadísticas se actualizan automáticamente con cada nueva orden.
                                Los productos más vendidos se actualizan según el total de unidades vendidas.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
