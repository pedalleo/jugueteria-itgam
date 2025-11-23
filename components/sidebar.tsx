"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package2, LineChart, ShoppingCart } from "lucide-react";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Productos",
        href: "/productos",
        icon: Package2,
    },
    {
        label: "Realizar venta",
        href: "/ventas",
        icon: ShoppingCart
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:w-64 lg:w-72 border-r bg-slate-900 text-slate-50 flex-col">
            {/* Logo / Título */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <span className="text-lg font-semibold tracking-tight">
                    Juguetería ITGAM
                </span>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer opcional del sidebar */}
            <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
                Proyecto de juguetería · {new Date().getFullYear()}
            </div>
        </aside>
    );
}
