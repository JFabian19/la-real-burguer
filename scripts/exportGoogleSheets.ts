import { writeFileSync } from 'node:fs';
import Papa from 'papaparse';
import { DEFAULT_MENU_DATA } from '../src/data/menuData.ts';

const deliveryPriceByCategory: Record<string, number> = {
  salchipapas: 1,
  broaster: 1,
  alitas: 1,
  criollos: 1,
};

const categoryRows = DEFAULT_MENU_DATA.map(category => ({
  nombre: category.nombre,
  'precio por delivery': deliveryPriceByCategory[category.id] ?? '',
}));

const dishRows = DEFAULT_MENU_DATA.flatMap(category => category.items.map(dish => ({
  categoría: category.nombre,
  'nombre del plato': dish.nombre,
  descripción: (dish.descripcion || '').replace(/\s*\(Táper S\/\.\s*\d+(?:[.,]\d+)?\)\.?$/i, '').trim(),
  precio: dish.precio,
  'URL de imagen': '',
})));

const csvOptions = { quotes: false, newline: '\r\n' } as const;
writeFileSync('categorias_template.csv', `\uFEFF${Papa.unparse(categoryRows, csvOptions)}`, 'utf8');
writeFileSync('platos_template.csv', `\uFEFF${Papa.unparse(dishRows, csvOptions)}`, 'utf8');

console.log(`Exportadas ${categoryRows.length} categorías y ${dishRows.length} platos.`);
