"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import type { Producto } from "@/types"
import { FormularioProducto } from "./FormularioProducto"

interface TablaProductosProps {
  productos: Producto[]
  onEliminarProducto: (id: string) => void
  onEditarProducto: (id: string, producto: Partial<Producto>) => void
  campanaDefault: number
  total: number
}

export function TablaProductos({
  productos,
  onEliminarProducto,
  onEditarProducto,
  campanaDefault,
  total,
}: TablaProductosProps) {
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null)

  const handleEditar = (producto: Producto) => {
    setProductoEditando(producto)
  }

  const handleGuardarEdicion = (productoData: Omit<Producto, "id">) => {
    if (productoEditando) {
      onEditarProducto(productoEditando.id, productoData)
      setProductoEditando(null)
    }
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(precio)
  }

  if (productoEditando) {
    return (
      <FormularioProducto
        onSubmit={handleGuardarEdicion}
        campanaDefault={campanaDefault}
        productoEditar={productoEditando}
        onCancel={() => setProductoEditando(null)}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos del Paquete</CardTitle>
      </CardHeader>
      <CardContent>
        {productos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay productos en este paquete. ¡Agrega el primero!
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Revista</TableHead>
                    <TableHead>Campaña</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio Catálogo</TableHead>
                    <TableHead>Precio a Pagar</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto) => {
                    const precioFinal = producto.precioAPagar || producto.precioCatalogo
                    const subtotal = precioFinal * producto.cantidad

                    return (
                      <TableRow key={producto.id}>
                        <TableCell>{producto.codigo || "-"}</TableCell>
                        <TableCell>{producto.nombre || "-"}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {producto.revista}
                          </span>
                        </TableCell>
                        <TableCell>{producto.campana}</TableCell>
                        <TableCell>{producto.cantidad}</TableCell>
                        <TableCell>{formatearPrecio(producto.precioCatalogo)}</TableCell>
                        <TableCell>{formatearPrecio(precioFinal)}</TableCell>
                        <TableCell className="font-semibold">{formatearPrecio(subtotal)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditar(producto)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => onEliminarProducto(producto.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="text-right">
                <p className="text-lg font-semibold">Total a Pagar: {formatearPrecio(total)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
