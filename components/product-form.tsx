"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ProductFormData) => void;
    initialData?: ProductFormData & { id?: string };
    isEditing?: boolean;
}

export interface ProductFormData {
    nombre: string;
    categoriaNombre: string;
    precio: string;
    stock: string;
}

export function ProductForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    isEditing = false,
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>(
        initialData || {
            nombre: "",
            categoriaNombre: "",
            precio: "",
            stock: "",
        }
    );

    // 🔁 Importante: si cambias de producto a editar, actualizamos el formulario
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                nombre: "",
                categoriaNombre: "",
                precio: "",
                stock: "",
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            nombre: "",
            categoriaNombre: "",
            precio: "",
            stock: "",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Producto" : "Agregar Nuevo Producto"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre del Producto</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            placeholder="Ej: Muñeca de peluche"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="categoriaNombre">Categoría</Label>
                        <Input
                            id="categoriaNombre"
                            name="categoriaNombre"
                            placeholder="Ej: Peluches"
                            value={formData.categoriaNombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="precio">Precio ($)</Label>
                        <Input
                            id="precio"
                            name="precio"
                            type="number"
                            placeholder="Ej: 29.99"
                            step="0.01"
                            min="0"
                            value={formData.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock (cantidad)</Label>
                        <Input
                            id="stock"
                            name="stock"
                            type="number"
                            placeholder="Ej: 50"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {isEditing ? "Guardar Cambios" : "Crear Producto"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
