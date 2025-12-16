import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Wrench, Hammer } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Resumen general de tu negocio.</p>
            </div>

            <Card className="border-dashed border-2">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center space-y-6 py-12">
                        <div className="flex items-center gap-3">
                            <Construction className="h-16 w-16 text-orange-500 animate-pulse" />
                            <Hammer className="h-12 w-12 text-orange-400" />
                            <Wrench className="h-10 w-10 text-orange-600" />
                        </div>
                        
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">
                                🚧 Dashboard en Construcción
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                Estamos trabajando en traerte las mejores estadísticas y métricas para tu negocio.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                            <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce" />
                            <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                                Próximamente disponible
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-dashed opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            📊 Métricas de Ventas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">En desarrollo...</p>
                    </CardContent>
                </Card>

                <Card className="border-dashed opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            📈 Análisis de Rendimiento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">En desarrollo...</p>
                    </CardContent>
                </Card>

                <Card className="border-dashed opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            🎯 Productos Populares
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">En desarrollo...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
