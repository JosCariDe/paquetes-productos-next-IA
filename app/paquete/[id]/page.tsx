"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { usePaquetes } from "@/hooks/usePaquetes"
import { FormularioProducto } from "@/components/FormularioProducto"
import { TablaProductos } from "@/components/TablaProductos"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PaquetePage({ params }: PageProps) {
  const { id } = use(params)
  const { obtenerPaquete, campanaDefault, agregarProducto, eliminarProducto, editarProducto, calcularTotalPaquete } =
    usePaquetes()

  const paquete = obtenerPaquete(id)

  if (!paquete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Paquete no encontrado</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAgregarProducto = (producto: any) => {
    agregarProducto(id, producto)
  }

  const handleEliminarProducto = (productoId: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      eliminarProducto(id, productoId)
    }
  }

  const handleEditarProducto = (productoId: string, producto: any) => {
    editarProducto(id, productoId, producto)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="mb-4 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{paquete.nombre}</h1>
            <p className="text-muted-foreground">
              Creado el{" "}
              {new Intl.DateTimeFormat("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(paquete.fechaCreacion)}
            </p>
          </div>
          <Link href={`/paquete/${id}/agregar`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Productos
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <FormularioProducto onSubmit={handleAgregarProducto} campanaDefault={campanaDefault} />

        <TablaProductos
          productos={paquete.productos}
          onEliminarProducto={handleEliminarProducto}
          onEditarProducto={handleEditarProducto}
          campanaDefault={campanaDefault}
          total={calcularTotalPaquete(id)}
        />
      </div>
    </div>
  )
}
