"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ProductForm, type ProductFormData } from "./product-form";
import { Pencil, Trash2, Plus } from "lucide-react";

export interface Product {
    id: number;
    nombre: string;
    categoriaNombre: string;
    precio: number;
    stock: number;
}

interface ProductsPageProps {
    products: Product[];
    onCreate: (producto: Omit<Product, "id">) => Promise<void> | void;
    onEdit: (id: number, cambios: Partial<Product>) => Promise<void> | void;
    onDelete: (id: number) => Promise<void> | void;
}

export function ProductsPage({
    products,
    onCreate,
    onEdit,
    onDelete,
}: ProductsPageProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleCreateClick = () => {
        setEditingId(null);
        setSelectedProduct(null);
        setDialogOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setEditingId(product.id);
        setDialogOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setDeleteAlertOpen(true);
    };

    const handleFormSubmit = async (formData: ProductFormData) => {
        const payload = {
            nombre: formData.nombre,
            categoriaNombre: formData.categoriaNombre,
            precio: Number.parseFloat(formData.precio),
            stock: Number.parseInt(formData.stock, 10),
        };

        if (editingId !== null) {
            await onEdit(editingId, payload);
        } else {
            await onCreate(payload);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            await onDelete(selectedProduct.id);
            setDeleteAlertOpen(false);
            setSelectedProduct(null);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(value);
    };

    const getStockColor = (stock: number) => {
        if (stock === 0) return "text-destructive";
        if (stock < 10) return "text-orange-500";
        return "text-green-600";
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestión de Productos</CardTitle>
                    <Button onClick={handleCreateClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Producto
                    </Button>
                </CardHeader>
                <CardContent>
                    {products.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            <p>No hay productos registrados</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.nombre}
                                            </TableCell>
                                            <TableCell>{product.categoriaNombre}</TableCell>
                                            <TableCell>{formatCurrency(product.precio)}</TableCell>
                                            <TableCell>
                                                <span className={getStockColor(product.stock)}>
                                                    {product.stock} unidades
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(product)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Editar {product.nombre}
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-destructive hover:text-destructive bg-transparent"
                                                        onClick={() => handleDeleteClick(product)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Eliminar {product.nombre}
                                                        </span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <ProductForm
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleFormSubmit}
                initialData={
                    selectedProduct
                        ? {
                            id: selectedProduct.id.toString(),
                            nombre: selectedProduct.nombre,
                            categoriaNombre: selectedProduct.categoriaNombre,
                            precio: selectedProduct.precio.toString(),
                            stock: selectedProduct.stock.toString(),
                        }
                        : undefined
                }
                isEditing={editingId !== null}
            />

            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar{" "}
                            <strong>{selectedProduct?.nombre}</strong>? Esta acción no se
                            puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirmDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
