"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Package, Pencil, Trash2 } from "lucide-react"
import { usePaquetes } from "@/hooks/usePaquetes"
import { CAMPANAS } from "@/types"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const {
    paquetes,
    campanaDefault,
    setCampanaDefault,
    crearPaquete,
    eliminarPaquete,
    editarPaquete,
    calcularTotalPaquete,
  } = usePaquetes()

  const router = useRouter()

  const [nombreNuevoPaquete, setNombreNuevoPaquete] = useState("")
  const [paqueteEditando, setPaqueteEditando] = useState<string | null>(null)
  const [nombreEdicion, setNombreEdicion] = useState("")

  const handleCrearPaquete = () => {
    if (!nombreNuevoPaquete.trim()) {
      alert("Por favor ingresa un nombre para el paquete")
      return
    }

    const nuevoPaqueteId = crearPaquete(nombreNuevoPaquete.trim())
    setNombreNuevoPaquete("")

    // Redirigir inmediatamente a la página del paquete
    router.push(`/paquete/${nuevoPaqueteId}`)
  }

  const handleEditarPaquete = (id: string, nombre: string) => {
    setPaqueteEditando(id)
    setNombreEdicion(nombre)
  }

  const handleGuardarEdicion = () => {
    if (paqueteEditando && nombreEdicion.trim()) {
      editarPaquete(paqueteEditando, nombreEdicion.trim())
      setPaqueteEditando(null)
      setNombreEdicion("")
    }
  }

  const handleCancelarEdicion = () => {
    setPaqueteEditando(null)
    setNombreEdicion("")
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(precio)
  }

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(fecha)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">¡Crea tu Paquete de Campaña!</h1>
        <p className="text-muted-foreground text-lg">
          Organiza tus productos de Ésika, Cyzone y L'bel de manera fácil y rápida
        </p>
      </div>

      {/* Configuración de campaña por defecto */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configuración General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="campana-default">Campaña por defecto:</Label>
            <Select
              value={campanaDefault.toString()}
              onValueChange={(value) => setCampanaDefault(Number.parseInt(value))}
            >
              <SelectTrigger className="w-48">
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
        </CardContent>
      </Card>

      {/* Crear nuevo paquete */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Crear Nuevo Paquete</CardTitle>
          <p className="text-sm text-muted-foreground">
            Al crear un paquete serás redirigido para agregar productos inmediatamente
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Nombre del paquete (ej: Paquete Campaña 15)"
              value={nombreNuevoPaquete}
              onChange={(e) => setNombreNuevoPaquete(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCrearPaquete()}
              className="flex-1"
            />
            <Button onClick={handleCrearPaquete}>
              <Plus className="h-4 w-4 mr-2" />
              Crear y Agregar Productos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de paquetes */}
      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold">Mis Paquetes</h2>

        {paquetes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes paquetes aún</h3>
              <p className="text-muted-foreground">Crea tu primer paquete para comenzar a organizar tus productos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {paquetes.map((paquete) => (
              <Card key={paquete.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {paqueteEditando === paquete.id ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            value={nombreEdicion}
                            onChange={(e) => setNombreEdicion(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleGuardarEdicion()}
                            className="max-w-md"
                          />
                          <Button size="sm" onClick={handleGuardarEdicion}>
                            Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelarEdicion}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{paquete.nombre}</h3>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Productos: {paquete.productos.length}</p>
                            <p>Total: {formatearPrecio(calcularTotalPaquete(paquete.id))}</p>
                            <p>Modificado: {formatearFecha(paquete.fechaModificacion)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarPaquete(paquete.id, paquete.nombre)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("¿Estás seguro de eliminar este paquete?")) {
                            eliminarPaquete(paquete.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link href={`/paquete/${paquete.id}`}>
                        <Button>Ver Paquete</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
