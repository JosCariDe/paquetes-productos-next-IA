"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Package } from "lucide-react"
import { usePaquetes } from "@/hooks/usePaquetes"
import { FormularioProducto } from "@/components/FormularioProducto"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AgregarProductoPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { obtenerPaquete, campanaDefault, agregarProducto } = usePaquetes()

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
    // Mostrar mensaje de éxito y continuar en la misma página
  }

  const handleTerminar = () => {
    router.push(`/paquete/${id}`)
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

        <div className="flex items-center gap-3 mb-4">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Agregar productos</h1>
            <p className="text-muted-foreground">Paquete: {paquete.nombre}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <FormularioProducto onSubmit={handleAgregarProducto} campanaDefault={campanaDefault} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Paquete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Productos agregados:</span>
                  <span className="font-semibold">{paquete.productos.length}</span>
                </div>

                {paquete.productos.length > 0 && (
                  <>
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Últimos productos:</h4>
                      <div className="space-y-2">
                        {paquete.productos.slice(-3).map((producto) => (
                          <div key={producto.id} className="flex justify-between text-sm">
                            <span>{producto.nombre || producto.codigo || "Sin nombre"}</span>
                            <span>{producto.cantidad}x</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total estimado:</span>
                        <span>
                          {new Intl.NumberFormat("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          }).format(
                            paquete.productos.reduce((total, producto) => {
                              const precio = producto.precioAPagar || producto.precioCatalogo
                              return total + precio * producto.cantidad
                            }, 0),
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-4 space-y-2">
                  <Button onClick={handleTerminar} className="w-full">
                    Ver paquete completo
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Puedes seguir agregando productos o ver el resumen completo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
