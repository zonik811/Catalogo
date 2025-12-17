"use client";

import { useState, useRef, useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme-store";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { THEME_PRESETS, ThemeSettings } from "@/types";
import { Loader2, Save, Palette } from "lucide-react";

export default function ThemeEditorPage() {
    const { theme, setTheme } = useThemeStore();
    const [saving, setSaving] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const businessId = process.env.NEXT_PUBLIC_BUSINESS_ID || "";

    // Send initial theme when iframe loads
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleLoad = () => {
            console.log("[Editor] Iframe loaded, sending initial theme");
            setTimeout(() => {
                iframe.contentWindow?.postMessage(
                    {
                        type: "THEME_UPDATE",
                        theme,
                    },
                    "*"
                );
            }, 500);
        };

        iframe.addEventListener("load", handleLoad);
        return () => iframe.removeEventListener("load", handleLoad);
    }, [theme]);

    // Send theme updates in real-time
    useEffect(() => {
        if (iframeRef.current?.contentWindow) {
            console.log("[Editor] Sending theme update:", theme);
            iframeRef.current.contentWindow.postMessage(
                {
                    type: "THEME_UPDATE",
                    theme,
                },
                "*"
            );
        }
    }, [theme]);

    // Listen for theme requests from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "REQUEST_THEME") {
                console.log("[Editor] Iframe requested theme, sending...");
                iframeRef.current?.contentWindow?.postMessage(
                    {
                        type: "THEME_UPDATE",
                        theme,
                    },
                    "*"
                );
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [theme]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const existingTheme = await api.business.getTheme(businessId);

            if (existingTheme) {
                await api.business.updateTheme(existingTheme.$id!, theme);
            } else {
                await api.business.createTheme({
                    ...theme,
                    businessId,
                } as any);
            }
            alert("✅ Tema guardado y publicado");
        } catch (error) {
            console.error("Error saving theme:", error);
            alert("❌ Error al guardar el tema");
        } finally {
            setSaving(false);
        }
    };

    const applyPreset = (presetKey: keyof typeof THEME_PRESETS) => {
        setTheme(THEME_PRESETS[presetKey].theme);
    };

    const colors = [
        {
            label: "Color Primario",
            key: "primaryColor" as const,
            desc: "🎯 Botones principales, hero gradient (inicio), links"
        },
        {
            label: "Color Secundario",
            key: "secondaryColor" as const,
            desc: "🌈 Hero gradient (fin), badge descuento (-30%)"
        },
        {
            label: "Color de Acento",
            key: "accentColor" as const,
            desc: "⭐ Badge 'Popular', efectos hover"
        },
        {
            label: "Fondo Principal",
            key: "backgroundColor" as const,
            desc: "📄 Fondo general de toda la página"
        },
        {
            label: "Fondo Superficie",
            key: "surfaceColor" as const,
            desc: "🔲 Navbar, tarjetas, selector de cantidad"
        },
        {
            label: "Texto Principal",
            key: "textColor" as const,
            desc: "📝 Títulos, nombres de productos, textos principales"
        },
        {
            label: "Texto Secundario",
            key: "mutedColor" as const,
            desc: "💬 Descripciones, subtextos, placeholders"
        },
    ];

    return (
        <div className="flex h-screen">
            {/* Panel de Controles */}
            <div className="w-[420px] border-r overflow-y-auto" id="catalog">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Palette className="text-primary" />
                            Editor Visual
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Personaliza la apariencia de tu tienda
                        </p>
                    </div>

                    {/* Paletas Predefinidas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">🎨 Temas Predefinidos</CardTitle>
                            <CardDescription>
                                Aplica un tema completo de un click
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() =>
                                        applyPreset(key as keyof typeof THEME_PRESETS)
                                    }
                                    className="w-full p-3 border rounded-lg hover:border-primary hover:bg-slate-50 transition-all text-left"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{preset.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {preset.description}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            <div
                                                className="w-5 h-5 rounded-full border border-slate-200"
                                                style={{
                                                    backgroundColor:
                                                        preset.theme.primaryColor,
                                                }}
                                            />
                                            <div
                                                className="w-5 h-5 rounded-full border border-slate-200"
                                                style={{
                                                    backgroundColor:
                                                        preset.theme.secondaryColor,
                                                }}
                                            />
                                            <div
                                                className="w-5 h-5 rounded-full border border-slate-200"
                                                style={{
                                                    backgroundColor:
                                                        preset.theme.accentColor,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Colores */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">🎨 Personalización de Colores</CardTitle>
                            <CardDescription>
                                Ajusta cada color según su función
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {colors.map((color) => (
                                <div key={color.key} className="space-y-2 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold">
                                            {color.label}
                                        </Label>
                                        <span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded">
                                            {theme[color.key]}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{color.desc}</p>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={theme[color.key]}
                                            onChange={(e) =>
                                                setTheme({ [color.key]: e.target.value })
                                            }
                                            className="w-20 h-10 cursor-pointer p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={theme[color.key]}
                                            onChange={(e) =>
                                                setTheme({ [color.key]: e.target.value })
                                            }
                                            className="font-mono text-sm flex-1"
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Formas y Radios */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">📐 Formas y Esquinas</CardTitle>
                            <CardDescription>
                                Controla el redondeo de elementos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Radio General</Label>
                                <p className="text-xs text-slate-500">Elementos generales de la interfaz</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {["0", "0.25rem", "0.5rem", "0.75rem", "1rem"].map(
                                        (val) => (
                                            <button
                                                key={val}
                                                onClick={() =>
                                                    setTheme({ borderRadius: val })
                                                }
                                                className={`p-2 border text-xs font-medium transition-all ${theme.borderRadius === val
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white hover:bg-slate-50"
                                                    }`}
                                                style={{ borderRadius: val === "0" ? "0" : val }}
                                            >
                                                {val === "0" ? "0" : val.replace("rem", "")}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Radio Botones</Label>
                                <p className="text-xs text-slate-500">Botón 'Ver Catálogo', botones +/-</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {[
                                        "0",
                                        "0.25rem",
                                        "0.5rem",
                                        "0.75rem",
                                        "9999px",
                                    ].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() =>
                                                setTheme({ buttonRadius: val })
                                            }
                                            className={`p-2 border text-xs font-medium transition-all ${theme.buttonRadius === val
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white hover:bg-slate-50"
                                                }`}
                                            style={{
                                                borderRadius:
                                                    val === "9999px" ? "9999px" : val,
                                            }}
                                        >
                                            {val === "9999px" ? "●" : val === "0" ? "0" : val.replace("rem", "")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Radio Cards</Label>
                                <p className="text-xs text-slate-500">Tarjetas de productos</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {[
                                        "0",
                                        "0.5rem",
                                        "0.75rem",
                                        "1rem",
                                        "1.5rem",
                                    ].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setTheme({ cardRadius: val })}
                                            className={`p-2 border text-xs font-medium transition-all ${theme.cardRadius === val
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white hover:bg-slate-50"
                                                }`}
                                            style={{ borderRadius: val === "0" ? "0" : val }}
                                        >
                                            {val === "0" ? "0" : val.replace("rem", "")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botón Guardar */}
                    <div className="sticky bottom-0 bg-white dark:bg-slate-900 py-4 border-t">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full gap-2"
                            size="lg"
                        >
                            {saving ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Guardar y Publicar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4">
                <div className="h-full bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden">
                    <div className="h-12 bg-slate-200 dark:bg-slate-800 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="flex-1 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Vista Previa en Tiempo Real
                        </div>
                    </div>
                    <iframe
                        ref={iframeRef}
                        src="/?preview=true"
                        className="w-full h-[calc(100%-3rem)] border-0"
                        title="Preview"
                    />
                </div>
            </div>
        </div>
    );
}
