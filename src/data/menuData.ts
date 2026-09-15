export interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

export interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

export const DEFAULT_MENU_DATA: Category[] = [
  {
    id: "categoria-1",
    nombre: "Categoría Ejemplo 1",
    items: [
      {
        nombre: "Plato de Ejemplo A",
        descripcion: "Descripción deliciosa del plato de ejemplo A.",
        precio: "S/. 10.00",
        imagen: ""
      },
      {
        nombre: "Plato de Ejemplo B",
        descripcion: "Descripción deliciosa del plato de ejemplo B.",
        precio: "S/. 12.00",
        imagen: ""
      }
    ]
  },
  {
    id: "categoria-2",
    nombre: "Categoría Ejemplo 2",
    items: [
      {
        nombre: "Bebida de Ejemplo",
        descripcion: "Descripción refrescante de la bebida de ejemplo.",
        precio: "S/. 5.00",
        imagen: ""
      }
    ]
  }
];
