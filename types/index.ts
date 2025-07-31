export type Revista = "Ésika" | "Cyzone" | "L'bel"

export interface Producto {
  id: string
  codigo?: string
  nombre?: string
  revista: Revista
  precioCatalogo: number
  precioAPagar?: number
  campana: number
  cantidad: number
}

export interface Paquete {
  id: string
  nombre: string
  productos: Producto[]
  fechaCreacion: Date
  fechaModificacion: Date
}

export const REVISTAS: Revista[] = ["Ésika", "Cyzone", "L'bel"]
export const CAMPANAS = Array.from({ length: 18 }, (_, i) => i + 1)
