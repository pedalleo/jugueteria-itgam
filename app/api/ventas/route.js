import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/ventas → listado de ventas
export async function GET() {
    try {
        const ventas = await prisma.venta.findMany({
            include: { producto: true },
            orderBy: { fecha: "desc" },
        });

        return NextResponse.json(ventas);
    } catch (error) {
        console.error("Error en GET /api/ventas:", error);
        return NextResponse.json(
            { error: "Error al obtener ventas" },
            { status: 500 }
        );
    }
}

// POST /api/ventas → registrar venta
export async function POST(request) {
    try {
        const body = await request.json();
        const productoId = Number(body.productoId);
        const cantidad = Number(body.cantidad);

        if (!productoId || cantidad <= 0) {
            return NextResponse.json(
                { error: "Datos inválidos de venta" },
                { status: 400 }
            );
        }

        const producto = await prisma.producto.findUnique({
            where: { id: productoId },
        });

        if (!producto) {
            return NextResponse.json(
                { error: "Producto no encontrado" },
                { status: 404 }
            );
        }

        if (producto.stock < cantidad) {
            return NextResponse.json(
                { error: "No hay stock suficiente para esta venta" },
                { status: 400 }
            );
        }

        const total = Number(producto.precio) * cantidad;

        // Transacción: crear venta y actualizar stock
        const venta = await prisma.$transaction(async (tx) => {
            const nuevaVenta = await tx.venta.create({
                data: {
                    productoId,
                    cantidad,
                    total,
                },
            });

            await tx.producto.update({
                where: { id: productoId },
                data: {
                    stock: producto.stock - cantidad,
                },
            });

            return nuevaVenta;
        });

        return NextResponse.json(venta, { status: 201 });
    } catch (error) {
        console.error("Error en POST /api/ventas:", error);
        return NextResponse.json(
            { error: "Error al registrar la venta" },
            { status: 500 }
        );
    }
}
