"use client";

import { useEffect, useState } from "react";
import { SalesPage, type ProductForSale } from "@/components/sales-page";

interface ProductoAPI {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
}

export default function VentasPageContainer() {
    const [products, setProducts] = useState<ProductForSale[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadProducts() {
        setLoading(true);
        const res = await fetch("/api/productos");

        if (!res.ok) {
            console.error("Error al cargar productos:", await res.text());
            setProducts([]);
            setLoading(false);
            return;
        }

        const data: ProductoAPI[] = await res.json();
        setProducts(
            data.map((p) => ({
                id: p.id,
                nombre: p.nombre,
                precio: p.precio,
                stock: p.stock,
            })),
        );
        setLoading(false);
    }

    async function handleCreateSale(input: {
        productoId: number;
        cantidad: number;
    }) {
        const res = await fetch("/api/ventas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Error al registrar venta:", text);
        }

        // Actualizar stock en la UI
        await loadProducts();
    }

    useEffect(() => {
        loadProducts();
    }, []);

    if (loading) {
        return <div className="p-4">Cargando productos para ventas...</div>;
    }

    return <SalesPage products={products} onCreateSale={handleCreateSale} />;
}
