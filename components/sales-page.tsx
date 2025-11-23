"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart,
    PackageSearch,
    AlertCircle,
    Loader2,
} from "lucide-react";

export interface ProductForSale {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
}

interface SalesPageProps {
    products: ProductForSale[];
    onCreateSale: (data: { productoId: number; cantidad: number }) => Promise<void> | void;
}

export function SalesPage({ products, onCreateSale }: SalesPageProps) {
    const [productoId, setProductoId] = useState<number | "">("");
    const [cantidad, setCantidad] = useState<string>("1");
    const [submitting, setSubmitting] = useState(false);

    const selectedProduct = useMemo(
        () => products.find((p) => p.id === Number(productoId)),
        [products, productoId]
    );

    const total = selectedProduct
        ? selectedProduct.precio * (Number(cantidad) || 0)
        : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productoId || Number(cantidad) <= 0) return;

        setSubmitting(true);
        try {
            await onCreateSale({
                productoId: Number(productoId),
                cantidad: Number(cantidad),
            });
            setCantidad("1");
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(value);

    const hasProducts = products.length > 0;

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
            <div className="w-full max-w-3xl">
                <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-900/5">
                    <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                    <ShoppingCart className="h-3.5 w-3.5" />
                                    Nueva venta
                                </div>
                                <CardTitle className="text-xl font-semibold text-slate-900">
                                    Registrar venta de producto
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Selecciona un juguete del catálogo, indica la cantidad y
                                    registra la venta para que se refleje en el dashboard.
                                </p>
                            </div>

                            {/* <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-700 text-slate-50 shadow-md">
                                <PackageSearch className="h-6 w-6" />
                            </div> */}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-2">
                        {!hasProducts ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    <AlertCircle className="h-7 w-7" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        No hay productos disponibles para vender
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 max-w-sm">
                                        Primero registra productos en la sección{" "}
                                        <span className="font-semibold">Productos</span> para poder
                                        crear ventas.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Selector de producto */}
                                <div className="space-y-2">
                                    <Label htmlFor="producto" className="text-sm font-medium">
                                        Producto
                                    </Label>
                                    <select
                                        id="producto"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm outline-none ring-0 transition focus-visible:border-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900/50"
                                        value={productoId}
                                        onChange={(e) =>
                                            setProductoId(
                                                e.target.value ? Number(e.target.value) : ""
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Selecciona un producto</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre} — {formatCurrency(p.precio)} (stock:{" "}
                                                {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-500">
                                        El stock se actualizará automáticamente al registrar la
                                        venta.
                                    </p>
                                </div>

                                {/* Cantidad + Total */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                                    <div className="space-y-2">
                                        <Label htmlFor="cantidad" className="text-sm font-medium">
                                            Cantidad
                                        </Label>
                                        <Input
                                            id="cantidad"
                                            type="number"
                                            min={1}
                                            value={cantidad}
                                            onChange={(e) => setCantidad(e.target.value)}
                                            className="rounded-xl"
                                            required
                                        />
                                        {selectedProduct && (
                                            <p className="text-xs text-slate-500">
                                                Stock disponible:{" "}
                                                <span className="font-semibold">
                                                    {selectedProduct.stock}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-sm font-medium text-slate-700">
                                            Total estimado
                                        </span>
                                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
                                            {selectedProduct ? formatCurrency(total) : "—"}
                                        </div>
                                        {selectedProduct && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                Precio unitario:{" "}
                                                <span className="font-semibold">
                                                    {formatCurrency(selectedProduct.precio)}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Resumen compacto del producto seleccionado */}
                                {selectedProduct && (
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
                                        <p className="font-semibold text-slate-800">
                                            Resumen de la venta
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-medium">Producto:</span>{" "}
                                            {selectedProduct.nombre}
                                        </p>
                                        <p className="mt-0.5">
                                            <span className="font-medium">Cantidad:</span>{" "}
                                            {Number(cantidad) || 0} unidades
                                        </p>
                                        <p className="mt-0.5">
                                            <span className="font-medium">Total:</span>{" "}
                                            {formatCurrency(total)}
                                        </p>
                                    </div>
                                )}

                                {/* Botón */}
                                <Button
                                    type="submit"
                                    disabled={submitting || !productoId}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Guardando venta...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-4 w-4" />
                                            Registrar venta
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
