"use client";

import type React from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export interface SummaryData {
    totalProductos: number;
    inventarioBajo: number;
    ventasTotales: number;
}

export interface SalesData {
    mes: string;   // Ej: "Ene", "Feb", "2025-01", etc.
    total: number; // Total vendido en ese mes
}

export interface DashboardPageProps {
    summary: SummaryData;
    salesByMonth: SalesData[];
}

export function DashboardPage({ summary, salesByMonth }: DashboardPageProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(value);
    };

    const StatCard = ({
        title,
        value,
        icon,
        trend,
    }: {
        title: string;
        value: string | number;
        icon: React.ReactNode;
        trend?: string;
    }) => (
        <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-primary">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                {trend && <p className="text-xs text-slate-500 mt-1">{trend}</p>}
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-1">
                    Resumen del desempeño de la juguetería
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Productos Totales"
                    value={summary.totalProductos}
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8-4"
                            />
                        </svg>
                    }
                    trend={`${summary.totalProductos} artículos registrados`}
                />

                <StatCard
                    title="Inventario Bajo"
                    value={summary.inventarioBajo}
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4v2m0 4v2M9 7h6m0 0H9m6 0h6m0 0h-6m0 0H9m6 0v10m-6-10v10"
                            />
                        </svg>
                    }
                    trend={
                        summary.inventarioBajo > 0
                            ? "Hay productos con poco stock"
                            : "Todo en orden"
                    }
                />

                <StatCard
                    title="Ventas Totales"
                    value={formatCurrency(summary.ventasTotales)}
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                    trend="Acumulado (según filtro de la API)"
                />
            </div>

            {/* Chart: Ventas por Mes */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Ventas por Mes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={salesByMonth}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="mes"
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #334155",
                                        borderRadius: "6px",
                                    }}
                                    labelStyle={{ color: "#f1f5f9" }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="hsl(var(--chart-1))"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Second chart: Tendencia de ventas */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Tendencia de Ventas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={salesByMonth}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="mes"
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    style={{ fontSize: "12px" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #334155",
                                        borderRadius: "6px",
                                    }}
                                    labelStyle={{ color: "#f1f5f9" }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="hsl(var(--chart-2))"
                                    dot={{ fill: "hsl(var(--chart-2))", r: 5 }}
                                    activeDot={{ r: 7 }}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
