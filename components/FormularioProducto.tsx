"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Producto, REVISTAS, CAMPANAS, type Revista } from "@/types"

interface FormularioProductoProps {
  onSubmit: (producto: Omit<Producto, "id">) => void
  campanaDefault: number
  productoEditar?: Producto
  onCancel?: () => void
}

export function FormularioProducto({ onSubmit, campanaDefault, productoEditar, onCancel }: FormularioProductoProps) {
  const [formData, setFormData] = useState({
    codigo: productoEditar?.codigo || "",
    nombre: productoEditar?.nombre || "",
    revista: productoEditar?.revista || ("" as Revista),
    precioCatalogo: productoEditar?.precioCatalogo || 0,
    precioAPagar: productoEditar?.precioAPagar || 0,
    campana: productoEditar?.campana || campanaDefault,
    cantidad: productoEditar?.cantidad || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.revista || formData.precioCatalogo <= 0) {
      alert("Por favor completa los campos obligatorios")
      return
    }

    onSubmit({
      codigo: formData.codigo || undefined,
      nombre: formData.nombre || undefined,
      revista: formData.revista,
      precioCatalogo: formData.precioCatalogo,
      precioAPagar: formData.precioAPagar || undefined,
      campana: formData.campana,
      cantidad: formData.cantidad,
    })

    // Limpiar formulario si no estamos editando
    if (!productoEditar) {
      setFormData({
        codigo: "",
        nombre: "",
        revista: "" as Revista,
        precioCatalogo: 0,
        precioAPagar: 0,
        campana: campanaDefault,
        cantidad: 1,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{productoEditar ? "Editar Producto" : "Agregar Producto"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código (Opcional)</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData((prev) => ({ ...prev, codigo: e.target.value }))}
                placeholder="Código del producto"
              />
            </div>

            <div>
              <Label htmlFor="nombre">Nombre (Opcional)</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del producto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="revista">Revista *</Label>
              <Select
                value={formData.revista}
                onValueChange={(value: Revista) => setFormData((prev) => ({ ...prev, revista: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una revista" />
                </SelectTrigger>
                <SelectContent>
                  {REVISTAS.map((revista) => (
                    <SelectItem key={revista} value={revista}>
                      {revista}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="campana">Campaña</Label>
              <Select
                value={formData.campana.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, campana: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPANAS.map((campana) => (
                    <SelectItem key={campana} value={campana.toString()}>
                      Campaña {campana}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="precioCatalogo">Precio Catálogo *</Label>
              <Input
                id="precioCatalogo"
                type="number"
                step="0.01"
                min="0"
                value={formData.precioCatalogo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, precioCatalogo: Number.parseFloat(e.target.value) || 0 }))
                }
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="precioAPagar">Precio a Pagar (Opcional)</Label>
              <Input
                id="precioAPagar"
                type="number"
                step="0.01"
                min="0"
                value={formData.precioAPagar}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, precioAPagar: Number.parseFloat(e.target.value) || 0 }))
                }
                placeholder="Mismo precio catálogo"
              />
            </div>

            <div>
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData((prev) => ({ ...prev, cantidad: Number.parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">{productoEditar ? "Actualizar" : "Agregar"} Producto</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
