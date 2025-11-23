// app/productos/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductsPage, type Product } from "@/components/products-page";

interface ProductoAPI {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    categoria?: {
        nombre: string;
    } | null;
}

export default function ProductosPageContainer() {
    const [products, setProducts] = useState<Product[]>([]);
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

        const mapped: Product[] = data.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            stock: p.stock,
            categoriaNombre: p.categoria?.nombre ?? "Sin categoría",
        }));

        setProducts(mapped);
        setLoading(false);
    }


    async function handleCreate(producto: Omit<Product, "id">) {
        await fetch("/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
        });
        await loadProducts();
    }

    async function handleEdit(id: number, cambios: Partial<Product>) {
        await fetch(`/api/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cambios),
        });
        await loadProducts();
    }

    async function handleDelete(id: number) {
        const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });

        if (!res.ok) {
            let message = "Error al eliminar el producto";
            try {
                const data = await res.json();
                if (data?.error) message = data.error;
            } catch {
                // ignoramos error al parsear
            }
            alert(message); // puedes cambiarlo por un toast si luego quieres
            return;
        }

        await loadProducts();
    }




    useEffect(() => {
        loadProducts();
    }, []);

    if (loading) {
        return <div className="p-4">Cargando productos...</div>;
    }

    return (
        <ProductsPage
            products={products}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
