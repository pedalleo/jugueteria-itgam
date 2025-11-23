// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
    DashboardPage,
    type SummaryData,
    type SalesData,
} from "@/components/dashboard-page";

export default function DashboardContainerPage() {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [salesByMonth, setSalesByMonth] = useState<SalesData[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadDashboard() {
        setLoading(true);

        // Llamadas a tus endpoints de Next.js
        const [resResumen, resVentas] = await Promise.all([
            fetch("/api/dashboard/resumen"),
            fetch("/api/dashboard/ventas-mes"),
        ]);

        const resumenJson: SummaryData = await resResumen.json();
        const ventasJson: SalesData[] = await resVentas.json();

        setSummary(resumenJson);
        setSalesByMonth(ventasJson);
        setLoading(false);
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading || !summary) {
        return <div className="p-4">Cargando dashboard...</div>;
    }

    return <DashboardPage summary={summary} salesByMonth={salesByMonth} />;
}
