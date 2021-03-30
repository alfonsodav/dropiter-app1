export interface Product {
  id_Producto_Negocio: number;
  nombre: string;
  marca: string;
  codigo_SKU: string;
  descripcion: string;
  cantidad_Inventario: number;
  id_Estado_FK: number;
  id_Categoria_Producto_FK: number;
  precio: number;
  precio_Descuento: number;
  id_Negocio_FK: number;
  img_Portada: [];
  CategoriaData: [];
}

export interface Category {
  id_Categoria: number;
  categoria: string;
  descripcion: string;
  img: string;
  porcentaje_Cobro_Precio_Negocio: number
}