"use client"

import { useState, useEffect } from "react"
import type { Paquete, Producto } from "@/types"

const STORAGE_KEY = "paquetes-campana"
const CAMPANA_DEFAULT_KEY = "campana-default"

export function usePaquetes() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [campanaDefault, setCampanaDefault] = useState<number>(1)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedPaquetes = localStorage.getItem(STORAGE_KEY)
    const savedCampana = localStorage.getItem(CAMPANA_DEFAULT_KEY)

    if (savedPaquetes) {
      try {
        const parsed = JSON.parse(savedPaquetes)
        setPaquetes(
          parsed.map((p: any) => ({
            ...p,
            fechaCreacion: new Date(p.fechaCreacion),
            fechaModificacion: new Date(p.fechaModificacion),
          })),
        )
      } catch (error) {
        console.error("Error al cargar paquetes:", error)
      }
    }

    if (savedCampana) {
      setCampanaDefault(Number.parseInt(savedCampana))
    }
  }, [])

  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paquetes))
  }, [paquetes])

  useEffect(() => {
    localStorage.setItem(CAMPANA_DEFAULT_KEY, campanaDefault.toString())
  }, [campanaDefault])

  const crearPaquete = (nombre: string): string => {
    const nuevoPaquete: Paquete = {
      id: crypto.randomUUID(),
      nombre,
      productos: [],
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
    }

    setPaquetes((prev) => [...prev, nuevoPaquete])
    return nuevoPaquete.id
  }

  const eliminarPaquete = (id: string) => {
    setPaquetes((prev) => prev.filter((p) => p.id !== id))
  }

  const editarPaquete = (id: string, nombre: string) => {
    setPaquetes((prev) => prev.map((p) => (p.id === id ? { ...p, nombre, fechaModificacion: new Date() } : p)))
  }

  const agregarProducto = (paqueteId: string, producto: Omit<Producto, "id">) => {
    const nuevoProducto: Producto = {
      ...producto,
      id: crypto.randomUUID(),
      precioAPagar: producto.precioAPagar || producto.precioCatalogo,
    }

    setPaquetes((prev) =>
      prev.map((p) =>
        p.id === paqueteId
          ? {
              ...p,
              productos: [...p.productos, nuevoProducto],
              fechaModificacion: new Date(),
            }
          : p,
      ),
    )
  }

  const eliminarProducto = (paqueteId: string, productoId: string) => {
    setPaquetes((prev) =>
      prev.map((p) =>
        p.id === paqueteId
          ? {
              ...p,
              productos: p.productos.filter((prod) => prod.id !== productoId),
              fechaModificacion: new Date(),
            }
          : p,
      ),
    )
  }

  const editarProducto = (paqueteId: string, productoId: string, producto: Partial<Producto>) => {
    setPaquetes((prev) =>
      prev.map((p) =>
        p.id === paqueteId
          ? {
              ...p,
              productos: p.productos.map((prod) =>
                prod.id === productoId
                  ? {
                      ...prod,
                      ...producto,
                      precioAPagar: producto.precioAPagar || producto.precioCatalogo || prod.precioAPagar,
                    }
                  : prod,
              ),
              fechaModificacion: new Date(),
            }
          : p,
      ),
    )
  }

  const obtenerPaquete = (id: string): Paquete | undefined => {
    return paquetes.find((p) => p.id === id)
  }

  const calcularTotalPaquete = (paqueteId: string): number => {
    const paquete = obtenerPaquete(paqueteId)
    if (!paquete) return 0

    return paquete.productos.reduce((total, producto) => {
      const precio = producto.precioAPagar || producto.precioCatalogo
      return total + precio * producto.cantidad
    }, 0)
  }

  return {
    paquetes,
    campanaDefault,
    setCampanaDefault,
    crearPaquete,
    eliminarPaquete,
    editarPaquete,
    agregarProducto,
    eliminarProducto,
    editarProducto,
    obtenerPaquete,
    calcularTotalPaquete,
  }
}
