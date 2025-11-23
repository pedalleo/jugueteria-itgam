// app/api/productos/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/productos → lista de productos
export async function GET() {
    try {
        const productos = await prisma.producto.findMany({
            include: {
                categoria: true,
            },
            orderBy: {
                id: "asc",
            },
        });

        return NextResponse.json(productos);
    } catch (error) {
        console.error("Error en GET /api/productos:", error);
        return NextResponse.json(
            { error: "Error al obtener productos" },
            { status: 500 }
        );
    }
}

// POST /api/productos → crear producto
export async function POST(request) {
    try {
        const body = await request.json();
        const { nombre, categoriaNombre, precio, stock } = body;

        let categoria = null;

        if (categoriaNombre && categoriaNombre.trim() !== "") {
            // 👇 Primero buscamos si ya existe esa categoría por nombre
            categoria = await prisma.categoria.findFirst({
                where: { nombre: categoriaNombre },
            });

            // Si no existe, la creamos
            if (!categoria) {
                categoria = await prisma.categoria.create({
                    data: { nombre: categoriaNombre },
                });
            }
        }

        const nuevo = await prisma.producto.create({
            data: {
                nombre,
                precio,
                stock,
                categoriaId: categoria ? categoria.id : null,
            },
            include: {
                categoria: true,
            },
        });

        return NextResponse.json(nuevo, { status: 201 });
    } catch (error) {
        console.error("Error en POST /api/productos:", error);
        return NextResponse.json(
            { error: "Error al crear producto" },
            { status: 500 }
        );
    }
}
