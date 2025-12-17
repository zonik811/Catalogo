"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { useBusinessStore } from "@/lib/store/business-store";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ordersApi } from "@/services/orders.api";
import { toast } from "sonner";

export function CartDrawer() {
    const { items, isOpen, toggleCart, updateQuantity, removeItem, clearCart, total } = useCartStore();
    const { business } = useBusinessStore();

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Cálculos de costos
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    // Normalizar tasa de impuestos (si viene como 19, convertir a 0.19)
    const rawTaxRate = business?.taxRate || 0;
    const taxRate = rawTaxRate > 1 ? rawTaxRate / 100 : rawTaxRate;

    const tax = subtotal * taxRate;
    const shippingCost = business?.shippingCost || 0;
    const finalTotal = subtotal + tax + shippingCost;

    const handleCheckout = async () => {
        // Obtener número del negocio o usar fallback
        const phone = business?.whatsapp || "573000000000";
        const businessName = business?.name || "Menú Digital";

        if (!phone) {
            toast.error("Error: No hay número de WhatsApp configurado para este negocio.");
            return;
        }

        if (!business) {
            toast.error("Error: No se pudo cargar la información del negocio.");
            return;
        }

        // 🆕 GUARDAR ORDEN EN APPWRITE
        try {
            toast.loading("Validando stock y guardando orden...");

            // Preparar datos de la orden
            const orderData = {
                businessId: business.$id,
                items: items.map(item => ({
                    productId: item.$id,
                    productName: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    subtotal: item.price * item.quantity
                })),
                total: finalTotal,
                itemsCount: items.reduce((acc, item) => acc + item.quantity, 0)
            };

            // Guardar orden (valida stock automáticamente y lo decrementa)
            const savedOrder = await ordersApi.create(orderData);

            toast.dismiss();
            toast.success(`✅ Orden ${savedOrder.orderNumber} guardada!`);

            console.log('📦 Orden guardada:', savedOrder);

        } catch (error: any) {
            toast.dismiss();

            // Manejar error de stock insuficiente
            if (error.code === 'INSUFFICIENT_STOCK') {
                toast.error(
                    `❌ ${error.message}\nDisponible: ${error.available} | Solicitado: ${error.requested}`,
                    { duration: 5000 }
                );
                return; // NO abrir WhatsApp si falla el stock
            }

            // Otros errores
            toast.error(`Error al guardar la orden: ${error.message || 'Intenta nuevamente'}`);
            console.error('Error guardando orden:', error);
            return; // NO abrir WhatsApp si hay error
        }

        // ✅ SI LLEGAMOS AQUÍ, LA ORDEN SE GUARDÓ CORRECTAMENTE
        // Preparar mensaje de WhatsApp
        const itemsList = items
            .map(item => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString()})`)
            .join('\n');

        // Formatear mensaje con desglose
        let costBreakdown = `\nSubtotal: $${subtotal.toLocaleString()}`;
        if (tax > 0) costBreakdown += `\nIVA (${(taxRate * 100)}%): $${tax.toLocaleString()}`;
        if (shippingCost > 0) costBreakdown += `\nEnvío: $${shippingCost.toLocaleString()}`;
        costBreakdown += `\n*TOTAL: $${finalTotal.toLocaleString()}*`;

        const message = `*Hola ${businessName}, quiero hacer un pedido:*

${itemsList}
${costBreakdown}

_Enviado desde el Menú Digital_`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        // ✅ Limpiar carrito después de confirmar pedido exitoso
        clearCart();
        toggleCart(); // Cerrar el drawer también
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ... (Backdrop y Header sin cambios) ... */}

                    {/* Backdrop mejorado */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        transition={{ duration: 0.2 }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-950 z-50 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
                    >
                        {/* Header mejorado */}
                        <div className="relative p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    initial={{ rotate: -20, scale: 0.8 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-primary/10 p-2.5 rounded-xl"
                                >
                                    <ShoppingBag size={24} className="text-primary" />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Tu Pedido</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                                    </p>
                                </div>
                            </div>

                            <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleCart}
                                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X size={24} />
                                </Button>
                            </motion.div>
                        </div>

                        {/* Lista de productos */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            <AnimatePresence mode="popLayout">
                                {items.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="h-full flex flex-col items-center justify-center text-center px-8"
                                    >
                                        <motion.div
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl mb-6"
                                        >
                                            <Package size={64} className="text-slate-400 dark:text-slate-600 mx-auto" strokeWidth={1.5} />
                                        </motion.div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                            Tu carrito está vacío
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                            Agrega productos deliciosos para comenzar tu pedido
                                        </p>
                                        <Button
                                            onClick={toggleCart}
                                            className="rounded-full px-6"
                                        >
                                            Ver Menú
                                        </Button>
                                    </motion.div>
                                ) : (
                                    items.map((item, index) => (
                                        <motion.div
                                            key={item.$id}
                                            layout
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                                            transition={{
                                                delay: index * 0.05,
                                                layout: { duration: 0.3 }
                                            }}
                                            className="relative group"
                                        >
                                            <div className="flex gap-4 p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                                {/* Imagen del producto */}
                                                {item.imageUrl && (
                                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {/* Detalles del producto */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight line-clamp-2">
                                                            {item.name}
                                                        </h4>

                                                        {/* Botón eliminar */}
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeItem(item.$id)}
                                                            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        {/* Precio */}
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                ${item.price.toLocaleString()} c/u
                                                            </span>
                                                            <span className="text-lg font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                                ${(item.price * item.quantity).toLocaleString()}
                                                            </span>
                                                        </div>

                                                        {/* Controles de cantidad */}
                                                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 shadow-sm">
                                                            <motion.button
                                                                whileHover={{ scale: 1.15 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item.$id, item.quantity - 1)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus size={14} strokeWidth={3} />
                                                            </motion.button>

                                                            <motion.span
                                                                key={item.quantity}
                                                                initial={{ scale: 1.3, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                className="font-bold w-6 text-center text-sm text-slate-900 dark:text-white"
                                                            >
                                                                {item.quantity}
                                                            </motion.span>

                                                            <motion.button
                                                                whileHover={{ scale: 1.15 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => updateQuantity(item.$id, item.quantity + 1)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
                                                            >
                                                                <Plus size={14} strokeWidth={3} />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer con resumen y checkout */}
                        {items.length > 0 && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="border-t border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-5 space-y-4"
                            >
                                {/* Resumen de costos */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>

                                    {tax > 0 && (
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                            <span>IVA ({(taxRate * 100)}%)</span>
                                            <span>${tax.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {shippingCost > 0 && (
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                            <span>Envío</span>
                                            <span>${shippingCost.toLocaleString()}</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

                                    <div className="flex justify-between items-center text-xl font-bold text-slate-900 dark:text-white">
                                        <span>Total</span>
                                        <span className="text-2xl">${finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Botón de checkout */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        className="w-full h-14 text-base font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 group relative overflow-hidden"
                                        disabled={items.length === 0}
                                        onClick={handleCheckout}
                                    >
                                        {/* Efecto de brillo */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.6 }}
                                        />

                                        <span className="flex items-center gap-3 relative z-10">
                                            <span>Confirmar Pedido</span>
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    repeatDelay: 0.5
                                                }}
                                            >
                                                <ArrowRight size={20} />
                                            </motion.div>
                                        </span>
                                    </Button>
                                </motion.div>

                                {/* Botón continuar comprando */}
                                <Button
                                    variant="ghost"
                                    onClick={toggleCart}
                                    className="w-full text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                                >
                                    Continuar Comprando
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
