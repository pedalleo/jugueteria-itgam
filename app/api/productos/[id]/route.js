// app/api/productos/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/productos/:id → actualizar
export async function PUT(request, context) {
    try {
        // En Next 16, params es una Promise
        const { id } = await context.params;
        const body = await request.json();
        const { nombre, categoriaNombre, precio, stock } = body;

        let categoria = null;

        if (categoriaNombre && categoriaNombre.trim() !== "") {
            // 👇 Mismo patrón: buscar categoría por nombre
            categoria = await prisma.categoria.findFirst({
                where: { nombre: categoriaNombre },
            });

            if (!categoria) {
                categoria = await prisma.categoria.create({
                    data: { nombre: categoriaNombre },
                });
            }
        }

        const actualizado = await prisma.producto.update({
            where: { id: Number(id) },
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

        return NextResponse.json(actualizado);
    } catch (error) {
        console.error("Error en PUT /api/productos/[id]:", error);
        return NextResponse.json(
            { error: "Error al actualizar el producto" },
            { status: 500 }
        );
    }
}

// DELETE /api/productos/:id → eliminar
export async function DELETE(request, context) {
    try {
        const { id } = await context.params;
        const productoId = Number(id);

        // Intentamos borrar
        await prisma.producto.delete({
            where: { id: productoId },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error en DELETE /api/productos/[id]:", error);

        // Prisma P2003 = error de llave foránea
        if (error && error.code === "P2003") {
            return NextResponse.json(
                {
                    error:
                        "No puedes eliminar este producto porque tiene ventas registradas. " +
                        "Las ventas dependen de este producto.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Error al eliminar el producto" },
            { status: 500 }
        );
    }
}