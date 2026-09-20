export interface Dish { nombre: string; descripcion?: string; imagen?: string; precio: string; }
export interface Category { id: string; nombre: string; items: Dish[]; }

type MenuRow = [string, string, string?];
const category = (id: string, nombre: string, rows: MenuRow[]): Category => ({
  id, nombre, items: rows.map(([nombre, precio, descripcion]) => ({ nombre, precio, descripcion })),
});

export const DEFAULT_MENU_DATA: Category[] = [
  category('sandwich', 'Sánguches', [
    ['Mixto pavita', 'S/. 12.00', 'Pan molde con queso mozzarella y jamón pavita.'],
    ['Ciabatta con jamón', 'S/. 12.00', 'Con crema de queso, jamón americano, tomate y lechuga orgánica.'],
    ['Croissant con pollo', 'S/. 12.00', 'Pollo desmenuzado con crema de mayonesa y mostaza.'],
    ['Croissant con pollo y durazno', 'S/. 14.00'], ['Pollo clásico', 'S/. 12.00'], ['Pollo palta', 'S/. 14.00'],
  ]),
  category('tequenos', 'Tequeños', [
    ['Tequeños de queso', 'S/. 14.90', '8 unidades con salsa de guacamole.'], ['Tequeños de queso con jamón', 'S/. 15.90', '8 unidades con salsa de guacamole.'],
    ['Tequeños de queso con hot dog', 'S/. 15.90', '8 unidades con salsa de guacamole.'], ['Tequeños de lomo saltado', 'S/. 15.90', '8 unidades con salsa de guacamole.'],
  ]),
  category('refrescantes', 'Bebidas refrescantes', [
    ['Iced Tea del campo', 'S/. 8.00', 'Infusión de cedrón, eucalipto, linaza, hierba luisa, menta y limón.'], ['Iced Tea con naranja y limón', 'S/. 8.00'],
    ['Iced Tea fresa con arándanos', 'S/. 10.00'], ['Iced Tea fresa con naranja', 'S/. 8.00'], ['Iced Coffee Latte', 'S/. 10.00'], ['Chocolate helado', 'S/. 10.00'],
  ]),
  category('jugos', 'Jugos naturales', [
    ['Jugo de plátano', 'S/. 7.00'], ['Jugo de fresa', 'S/. 7.00'], ['Jugo de blueberry', 'S/. 8.00'], ['Jugo de mango', 'S/. 7.00'],
    ['Jugo de maracumango', 'S/. 8.00'], ['Jugo de piña', 'S/. 7.00'], ['Jugo de papaya', 'S/. 7.00'], ['Jugo de fresa con papaya', 'S/. 8.00'], ['Leche adicional para jugo', 'S/. 3.00'],
  ]),
  category('batidos', 'Batidos', [
    ['Batido de fresa', 'S/. 13.00', 'Vaso de 16 oz. Fresa, leche y yogurt griego.'], ['Banana Berry', 'S/. 13.00', 'Plátano, fresa, leche y yogurt griego.'],
    ['Papaya Energy', 'S/. 13.00', 'Papaya, plátano, fresa, leche y yogurt griego.'], ['Batido de mango', 'S/. 13.00'], ['Batido de maracumango', 'S/. 13.00'],
    ['Banana Fit Cream', 'S/. 13.00'], ['Batido de blueberry', 'S/. 13.00'],
  ]),
  category('frappe', 'Frappés', [
    ['Frappe capuccino', 'S/. 10.00'], ['Frappe mocaccino', 'S/. 10.00'], ['Frappe Oreo', 'S/. 10.00'], ['Frappe caramelo', 'S/. 10.00'],
    ['Frappe chocolate', 'S/. 10.00'], ['Frappe fresa blueberry', 'S/. 10.00'], ['Frapuccino', 'S/. 10.00'], ['Frappe maracuyá', 'S/. 10.00'],
    ['Frappe mango', 'S/. 10.00'], ['Frappe lúcuma', 'S/. 10.00'], ['Promo 2 Frappés', 'S/. 15.00'],
  ]),
  category('alitas', 'Alitas', [
    ['Alitas clásicas', 'S/. 18.00'], ['Alitas broaster', 'S/. 18.00'], ['Alitas búfalo', 'S/. 18.00'], ['Alitas en salsa de maracuyá', 'S/. 18.00'],
    ['Alitas BBQ', 'S/. 18.00'], ['Alitas Honey Mustard', 'S/. 18.00'], ['Alitas acevichadas', 'S/. 18.00'], ['Alitas Hot Wings', 'S/. 19.00'],
    ['Duo alitas', 'S/. 19.00'], ['Alitas Teriyaki', 'S/. 19.00'], ['Alitas anticucheras', 'S/. 19.00'], ['Trío de alitas', 'S/. 34.00', '12 alitas.'],
    ['Alitas familiar', 'S/. 70.00', '24 alitas, elige 4 sabores y gaseosa Pepsi de 1 litro.'],
  ]),
  category('broaster', 'Broaster', [
    ['Mostrito', 'S/. 14.00', '1 pieza de pollo, papas y chaufa.'], ['Combo Broaster 1', 'S/. 14.00', '1 pieza de pollo, papas, cremas y Pepsi personal.'],
    ['Combo Broaster 2', 'S/. 22.00', '2 piezas de pollo, papas, cremas y Pepsi personal.'], ['Combo Broaster 3', 'S/. 43.90', '4 piezas de broaster, papas, cremas y Pepsi de 1 litro.'],
  ]),
  category('especiales', 'Platos especiales', [
    ['Lomo saltado', 'S/. 24.00'], ['Pollo saltado', 'S/. 24.00'], ['Pollo a la plancha', 'S/. 24.00'], ['Arroz chaufa de pollo', 'S/. 18.00'],
    ['Arroz chaufa de carne', 'S/. 24.00'], ['Arroz chaufa de cerdo', 'S/. 20.00'], ['Arroz chaufa 3 sabores', 'S/. 25.00'],
  ]),
  category('hamburguesas', 'Hamburguesas', [
    ['Burger clásica', 'S/. 10.00', 'Burger, tomate y lechuga orgánica.'], ['Cheese Burger', 'S/. 12.00', 'Burger con doble queso edam.'],
    ['Cheddar Burger', 'S/. 13.00', 'Burger con doble queso cheddar.'], ['Royal Burger', 'S/. 12.00', 'Burger con huevo frito y queso edam.'],
    ['Royal Americana', 'S/. 13.50', 'Burger, huevo frito, queso edam y jamón americano.'], ['Bacon Burger', 'S/. 18.00', 'Burger doble, bacon y doble cheddar.'],
    ['American Burger', 'S/. 20.00', 'Doble burger, doble cheddar, bacon y aros de cebolla.'], ['Hawaiian Burger', 'S/. 18.00', 'Burger con piña y tocino.'],
  ]),
  category('filetes', 'Filete o desmenuzado', [
    ['Filete clásico', 'S/. 10.00'], ['Filete crispy', 'S/. 11.50'], ['Filete con queso', 'S/. 12.50'], ['Filete Royal', 'S/. 12.50'],
    ['Filete Royal Americana', 'S/. 14.00'], ['Filete con todo', 'S/. 16.00'],
  ]),
  category('chorizos-hotdog', 'Chorizos y hot dogs', [
    ['Chorizo clásico', 'S/. 10.00'], ['Chorizo con queso', 'S/. 12.00'], ['Chorizo Royal', 'S/. 12.00'], ['Chorizo Americano', 'S/. 13.50'],
    ['Hot dog clásico', 'S/. 7.00'], ['Hot dog Royal', 'S/. 10.00'],
  ]),
  category('salchipapas', 'Salchipapas', [
    ['Salchipapa clásica', 'S/. 13.00', 'Hot dog y papas.'], ['Salchi pobre', 'S/. 15.00', 'Hot dog, 2 huevos y papas.'], ['Chori papa', 'S/. 15.00', 'Chorizo y papas.'],
    ['Chicken Crispy', 'S/. 15.00', 'Trozos de pollo crujiente y papas.'], ['Salchipollo', 'S/. 16.00', 'Filete de pollo, hot dog y papas.'],
    ['Salchipollo Crispy', 'S/. 17.00'], ['Salchi Burger', 'S/. 18.50'], ['Salchi Pollo Real', 'S/. 21.50'], ['Camionero', 'S/. 27.00'],
  ]),
  category('jarras', 'Jarras', [
    ['Jarra de chicha morada (½ Lt)', 'S/. 7.00'], ['Jarra de chicha morada (1 Lt)', 'S/. 12.00'], ['Jarra de limonada (½ Lt)', 'S/. 7.00'], ['Jarra de limonada (1 Lt)', 'S/. 12.00'],
    ['Jarra de maracuyá (½ Lt)', 'S/. 7.00'], ['Jarra de maracuyá (1 Lt)', 'S/. 12.00'], ['Jarra de naranjada (½ Lt)', 'S/. 7.00'], ['Jarra de naranjada (1 Lt)', 'S/. 12.00'],
    ['Jarra de fresa (½ Lt)', 'S/. 8.50'], ['Jarra de fresa (1 Lt)', 'S/. 16.00'], ['Jarra de mango (½ Lt)', 'S/. 8.50'], ['Jarra de mango (1 Lt)', 'S/. 16.00'],
    ['Jarra de papaya (½ Lt)', 'S/. 8.50'], ['Jarra de papaya (1 Lt)', 'S/. 16.00'], ['Jarra de piña (½ Lt)', 'S/. 8.50'], ['Jarra de piña (1 Lt)', 'S/. 16.00'],
    ['Jarra de maracumango (½ Lt)', 'S/. 9.50'], ['Jarra de maracumango (1 Lt)', 'S/. 18.00'],
  ]),
  category('bebidas-heladas', 'Bebidas heladas', [
    ['Agua Cielo', 'S/. 2.00'], ['Agua San Luis', 'S/. 3.00'], ['Gaseosa de 600 ml', 'S/. 5.00'], ['Gaseosa de 1 Lt', 'S/. 9.00'], ['Gaseosa de 2 Lt', 'S/. 16.00'],
  ]),
  category('bebidas-calientes', 'Bebidas calientes', [
    ['Té', 'S/. 3.00'], ['Manzanilla', 'S/. 3.00'], ['Anís', 'S/. 3.00'], ['Hierba luisa', 'S/. 3.00'], ['Café gourmet', 'S/. 4.00'], ['Té negro', 'S/. 5.00'],
    ['Té de la abuela', 'S/. 5.00'], ['Emoliente clásico', 'S/. 6.00'], ['Emoliente de maracuyá', 'S/. 6.00'], ['Emoliente de fresa', 'S/. 6.00'], ['Emoliente de mango', 'S/. 6.00'], ['Chocolate caliente', 'S/. 10.00'],
  ]),
  category('mojitos', 'Mojitos', [
    ['Mojito clásico', 'S/. 15.00'], ['Mojito de fresa', 'S/. 15.00'], ['Mojito de maracuyá', 'S/. 15.00'], ['Mojito de mango', 'S/. 15.00'], ['Mojito de maracumango', 'S/. 15.00'],
    ['Mojito Blue Curaçao', 'S/. 15.00'], ['Mojito Jager', 'S/. 18.00'], ['Mojito Blueberry', 'S/. 18.00'], ['Mojito Corona', 'S/. 18.00'], ['Promo 2 mojitos', 'S/. 22.00'], ['Promo 2 mojitos Corona', 'S/. 32.00'],
  ]),
  category('cocteles', 'Cócteles', [
    ['Pisco Sour', 'S/. 15.00'], ['Piña colada', 'S/. 15.00'], ['Algarrobina', 'S/. 15.00'], ['Laguna Azul', 'S/. 15.00'], ['Machu Picchu', 'S/. 15.00'], ['Daiquiri', 'S/. 15.00', 'Fresa o durazno.'], ['Chilcano', 'S/. 15.00'], ['Pink Panther', 'S/. 18.00'],
  ]),
  category('cervezas', 'Cervezas', [
    ['Cusqueña Dorada', 'S/. 12.00'], ['Cusqueña Trigo', 'S/. 12.00'], ['Cusqueña Negra', 'S/. 12.00'], ['Pilsen', 'S/. 12.00'], ['Corona', 'S/. 18.00'],
  ]),
];
