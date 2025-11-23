import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MESES_ES = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
];

export async function GET() {
    try {
        const ventas = await prisma.venta.findMany({
            select: { fecha: true, total: true },
            orderBy: { fecha: "asc" },
        });

        const acumulado = new Map();

        for (const venta of ventas) {
            const fecha =
                venta.fecha instanceof Date ? venta.fecha : new Date(venta.fecha);

            const year = fecha.getFullYear();
            const month = fecha.getMonth() + 1;
            const key = `${year}-${String(month).padStart(2, "0")}`;

            const total = venta.total ? Number(venta.total) : 0;
            acumulado.set(key, (acumulado.get(key) ?? 0) + total);
        }

        const resultado = Array.from(acumulado.entries())
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
            .map(([key, total]) => {
                const [yearStr, monthStr] = key.split("-");
                const monthIndex = Number(monthStr) - 1;
                return { mes: `${MESES_ES[monthIndex]} ${yearStr}`, total };
            });

        return NextResponse.json(resultado);
    } catch (error) {
        console.error("Error en GET /api/dashboard/ventas-mes:", error);
        return NextResponse.json(
            { error: "Error al obtener ventas por mes" },
            { status: 500 }
        );
    }
}
