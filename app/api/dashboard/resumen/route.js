import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const totalProductos = await prisma.producto.count();
        const inventarioBajo = await prisma.producto.count({
            where: { stock: { lt: 10 } },
        });

        const ventasAgg = await prisma.venta.aggregate({
            _sum: { total: true },
        });

        const ventasTotales = ventasAgg._sum.total
            ? Number(ventasAgg._sum.total)
            : 0;

        return NextResponse.json({
            totalProductos,
            inventarioBajo,
            ventasTotales,
        });
    } catch (error) {
        console.error("Error en GET /api/dashboard/resumen:", error);
        return NextResponse.json(
            { error: "Error al obtener datos del dashboard" },
            { status: 500 }
        );
    }
}
