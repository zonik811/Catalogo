"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

export default function SettingsPage() {
    const businessId = process.env.NEXT_PUBLIC_BUSINESS_ID || "";
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        whatsapp: "",
        taxRate: 19,
        shippingCost: 0,
        heroTitle: "",
        heroSubtitle: "",
        description: "",
    });

    useEffect(() => {
        loadBusiness();
    }, []);

    const loadBusiness = async () => {
        try {
            const business = await api.business.getById(businessId);
            setFormData({
                name: (business as any).name || "",
                slug: (business as any).slug || "",
                whatsapp: (business as any).whatsapp || "",
                taxRate: (business as any).taxRate || 19,
                shippingCost: (business as any).shippingCost || 0,
                heroTitle: (business as any).heroTitle || "",
                heroSubtitle: (business as any).heroSubtitle || "",
                description: (business as any).description || "",
            });
        } catch (error) {
            console.error("Error loading business:", error);
            alert("Error al cargar la configuración");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "taxRate" || name === "shippingCost"
                ? parseFloat(value) || 0
                : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!formData.name || !formData.slug) {
            alert("Nombre y Slug son obligatorios");
            return;
        }

        if (formData.taxRate < 0 || formData.taxRate > 100) {
            alert("El IVA debe estar entre 0 y 100");
            return;
        }

        if (formData.shippingCost < 0) {
            alert("El costo de envío no puede ser negativo");
            return;
        }

        setSaving(true);
        try {
            await api.business.update(businessId, {
                name: formData.name,
                slug: formData.slug,
                whatsapp: formData.whatsapp || null,
                taxRate: formData.taxRate,
                shippingCost: formData.shippingCost,
                heroTitle: formData.heroTitle || null,
                heroSubtitle: formData.heroSubtitle || null,
                description: formData.description || "Tienda online",
            });
            alert("✅ Configuración guardada correctamente");
        } catch (error) {
            console.error("Error saving business:", error);
            alert("❌ Error al guardar la configuración");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Configuración del Negocio
                </h2>
                <p className="text-muted-foreground">
                    Administra la información y ajustes de tu tienda.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información General */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información General</CardTitle>
                        <CardDescription>
                            Datos básicos de tu negocio
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Nombre del Negocio *
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Mi Restaurante"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL) *</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="Ej: mi-restaurante"
                                    pattern="[a-z0-9\-]+"
                                    title="Solo minúsculas, números y guiones"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Solo minúsculas, números y guiones
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input
                                id="whatsapp"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="Ej: 573001234567"
                                type="tel"
                            />
                            <p className="text-xs text-muted-foreground">
                                Número con código de país (sin +)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Configuración de Ventas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración de Ventas</CardTitle>
                        <CardDescription>
                            Impuestos y costos de envío
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="taxRate">IVA (%)</Label>
                                <Input
                                    id="taxRate"
                                    name="taxRate"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.taxRate}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Porcentaje de impuesto (0-100)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shippingCost">
                                    Costo de Envío ($)
                                </Label>
                                <Input
                                    id="shippingCost"
                                    name="shippingCost"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.shippingCost}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Costo fijo de envío
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Textos de Portada */}
                <Card>
                    <CardHeader>
                        <CardTitle>Textos de Portada</CardTitle>
                        <CardDescription>
                            Personaliza los mensajes principales
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="heroTitle">Título Principal</Label>
                            <Input
                                id="heroTitle"
                                name="heroTitle"
                                value={formData.heroTitle}
                                onChange={handleChange}
                                placeholder="Ej: Bienvenido a nuestro restaurante"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heroSubtitle">Subtítulo</Label>
                            <Input
                                id="heroSubtitle"
                                name="heroSubtitle"
                                value={formData.heroSubtitle}
                                onChange={handleChange}
                                placeholder="Ej: Los mejores sabores de la ciudad"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Descripción breve de tu negocio"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Botón Guardar */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={saving}
                        size="lg"
                        className="w-full md:w-auto gap-2"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        Guardar Cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}
