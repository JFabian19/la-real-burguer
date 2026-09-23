export interface Dish { nombre: string; descripcion?: string; imagen?: string; precio: string; }
export interface Category { id: string; nombre: string; items: Dish[]; }

type MenuRow = [string, string, string?];
const category = (id: string, nombre: string, rows: MenuRow[]): Category => ({
  id, nombre, items: rows.map(([nombre, precio, descripcion]) => ({ nombre, precio, descripcion })),
});

export const DEFAULT_MENU_DATA: Category[] = [
  category('hamburguesas', 'Hamburguesas', [
    ['Burger clásica', 'S/. 10.00', 'Burger, rodajas de tomate y lechuga orgánica.'],
    ['Cheese Burger', 'S/. 12.00', 'Burger, doble queso edam, rodajas de tomate y lechuga orgánica.'],
    ['Cheddar Burger', 'S/. 13.00', 'Burger, doble queso cheddar, rodajas de tomate, aros de cebolla y lechuga orgánica.'],
    ['Royal Burger', 'S/. 12.00', 'Burger, huevo frito, queso edam, rodajas de tomate y lechuga orgánica.'],
    ['Royal Americana', 'S/. 13.50', 'Burger, huevo frito, queso edam, jamón americano, rodajas de tomate y lechuga.'],
    ['Bacon Burger', 'S/. 18.00', 'Burger, doble bacon, doble cheddar, cebolla caramelizada, rodajas de tomate y lechuga orgánica.'],
    ['American Burger', 'S/. 20.00', 'Doble burger, doble cheddar, bacon, aros de cebolla, rodajas de tomate y lechuga orgánica.'],
    ['Hawaiian Burger', 'S/. 18.00', 'Burger, triple queso edam, rodaja de piña, tocino, rodajas de tomate y lechuga orgánica.'],
  ]),
  category('filetes', 'Filete o desmenuzado', [
    ['Filete clásico', 'S/. 10.00', 'Pollo, rodajas de tomate y lechuga orgánica.'],
    ['Filete crispy', 'S/. 11.50', 'Filete crujiente, rodajas de tomate y lechuga orgánica.'],
    ['Filete con queso', 'S/. 12.50', 'Pollo, doble queso, rodajas de tomate y lechuga orgánica.'],
    ['Filete Royal', 'S/. 12.50', 'Filete, queso edam, huevo, rodajas de tomate y lechuga orgánica.'],
    ['Filete Royal Americana', 'S/. 14.00', 'Pollo, huevo frito, queso edam, jamón americano, rodajas de tomate y lechuga.'],
    ['Filete con todo', 'S/. 16.00', 'Filete, queso edam, huevo, jamón, tocino, rodajas de tomate y lechuga orgánica.'],
  ]),
  category('chorizos', 'Chorizos', [
    ['Chorizo clásico', 'S/. 10.00', 'Chorizo, rodajas de tomate y lechuga orgánica.'],
    ['Chorizo con queso', 'S/. 12.00', 'Chorizo, doble queso edam, rodajas de tomate y lechuga orgánica.'],
    ['Chorizo Royal', 'S/. 12.00', 'Chorizo, huevo frito, queso edam, rodajas de tomate y lechuga orgánica.'],
    ['Chorizo Americano', 'S/. 13.50', 'Chorizo, huevo frito, queso edam, jamón americano, rodajas de tomate y lechuga orgánica.'],
  ]),
  category('hot-dogs', 'Hot dogs', [
    ['Hot dog clásico', 'S/. 7.00', 'Hot dog, rodajas de tomate y lechuga orgánica.'],
    ['Hot dog Royal', 'S/. 10.00', 'Hot dog, huevo frito, queso edam, jamón americano, rodajas de tomate y lechuga orgánica.'],
  ]),
  category('salchipapas', 'Salchipapas', [
    ['Salchipapa clásica', 'S/. 13.00', 'Hot dog y papas. (Táper S/. 1.00)'],
    ['Salchi pobre', 'S/. 15.00', 'Hot dog, 2 huevos y papas. (Táper S/. 1.00)'],
    ['Chori papa', 'S/. 15.00', 'Chorizo y papas. (Táper S/. 1.00)'],
    ['Chicken Crispy', 'S/. 15.00', 'Trozos de pollo crujiente y papas. (Táper S/. 1.00)'],
    ['Salchipollo', 'S/. 16.00', 'Filete de pollo, hot dog y papas. (Táper S/. 1.00)'],
    ['Salchipollo Crispy', 'S/. 17.00', 'Hot dog, pollo crispy y papas. (Táper S/. 1.00)'],
    ['Salchi Burger', 'S/. 18.50', 'Hamburguesa, hot dog, 2 huevos, queso y papas. (Táper S/. 1.00)'],
    ['Salchi Pollo Real', 'S/. 21.50', 'Hot dog, filete, chorizo, 2 huevos, queso y papas. (Táper S/. 1.00)'],
    ['Camionero', 'S/. 27.00', 'Hot dog, filete, hamburguesa, chorizo, 2 huevos, queso y papas. (Táper S/. 1.00)'],
  ]),
  category('tequenos', 'Tequeños', [
    ['Tequeños de queso', 'S/. 14.90', 'Deliciosos tequeños rellenos de queso, doraditos y crujientes.'],
    ['Tequeños de queso con jamón', 'S/. 15.90', 'Rellenos de queso y jamón, una combinación clásica que nunca falla.'],
    ['Tequeños de queso con hot dog', 'S/. 15.90', 'Queso derretido con hot dog, el favorito de todos.'],
    ['Tequeños de lomo saltado', 'S/. 15.90', 'Rellenos con lomo saltado, sabor peruano en cada bocado.'],
  ]),
  category('broaster', 'Broaster', [
    ['Mostrito', 'S/. 14.00', '1 pieza de pollo, papas y chaufa. (Táper S/. 1.00)'],
    ['Combo Broaster 1', 'S/. 14.00', '1 pieza de pollo, papas, cremas y Pepsi personal. (Táper S/. 1.00)'],
    ['Combo Broaster 2', 'S/. 22.00', '2 piezas de pollo, papas, cremas y Pepsi personal. (Táper S/. 2.00)'],
    ['Combo Broaster 3', 'S/. 43.90', '4 piezas de broaster, papas, cremas y Pepsi de 1 litro. (Táper S/. 2.00)'],
  ]),
  category('alitas', 'Alitas', [
    ['Alitas broaster', 'S/. 18.00', 'Alitas crocantes estilo broaster. (Táper S/. 1.00)'],
    ['Alitas búfalo', 'S/. 18.00', 'Alitas picantes en salsa búfalo. (Táper S/. 1.00)'],
    ['Alitas en salsa de maracuyá', 'S/. 18.00', 'Alitas en salsa agridulce de maracuyá. (Táper S/. 1.00)'],
    ['Alitas BBQ', 'S/. 18.00', 'Alitas bañadas en salsa BBQ ahumada. (Táper S/. 1.00)'],
    ['Alitas Honey Mustard', 'S/. 18.00', 'Alitas en salsa de mostaza dulce y miel. (Táper S/. 1.00)'],
    ['Alitas acevichadas', 'S/. 18.00', 'Alitas bañadas en crema acevichada. (Táper S/. 1.00)'],
    ['Alitas Hot Wings', 'S/. 19.00', 'Alitas broaster picantes. (Táper S/. 1.00)'],
    ['Alitas Teriyaki', 'S/. 19.00', 'Alitas en salsa teriyaki oriental. (Táper S/. 1.00)'],
    ['Alitas anticucheras', 'S/. 19.00', 'Alitas con auténtico toque anticuchero. (Táper S/. 1.00)'],
    ['Alitas diablas', 'S/. 19.00', 'Alitas en salsa extra picante 🌶️. (Táper S/. 1.00)'],
    ['Duo alitas', 'S/. 19.00', 'Elige 2 deliciosos sabores. (Táper S/. 1.00)'],
    ['Trío de alitas', 'S/. 34.00', '12 alitas, elige 3 sabores. (Táper S/. 2.00)'],
    ['Alitas familiar', 'S/. 70.00', '24 alitas, elige 4 sabores y gaseosa Pepsi de 1 litro. (Táper S/. 2.00)'],
  ]),
  category('criollos', 'Criollos', [
    ['Lomo saltado', 'S/. 24.00', 'Trozos de lomo salteados con cebolla, tomate, papas fritas y arroz. (Táper S/. 1.00)'],
    ['Pollo saltado', 'S/. 24.00', 'Pollo salteado con cebolla, tomate, papas fritas y arroz. (Táper S/. 1.00)'],
    ['Pollo a la plancha', 'S/. 24.00', 'Pechuga a la plancha acompañada de papas y ensalada. (Táper S/. 1.00)'],
    ['Arroz chaufa de pollo', 'S/. 18.00', 'Clásico arroz chaufa al wok con pollo. (Táper S/. 1.00)'],
    ['Arroz chaufa de carne', 'S/. 24.00', 'Arroz chaufa al wok con trozos de lomo. (Táper S/. 1.00)'],
    ['Arroz chaufa de cerdo', 'S/. 20.00', 'Arroz chaufa al wok con dados de cerdo. (Táper S/. 1.00)'],
    ['Arroz chaufa 3 sabores', 'S/. 25.00', 'Chaufa especial con pollo, carne y cerdo. (Táper S/. 1.00)'],
  ]),
  category('frappe', 'Frappés', [
    ['Frappe capuccino', 'S/. 10.00'], ['Frappe mocaccino', 'S/. 10.00'], ['Frappe Oreo', 'S/. 10.00'], ['Frappe caramelo', 'S/. 10.00'],
    ['Frappe chocolate', 'S/. 10.00'], ['Frappe fresa blueberry', 'S/. 10.00'], ['Frapuccino', 'S/. 10.00'], ['Frappe maracuyá', 'S/. 10.00'],
    ['Frappe mango', 'S/. 10.00'], ['Frappe lúcuma', 'S/. 10.00'], ['Promo 2 Frappés', 'S/. 15.00'],
  ]),
  category('jugos', 'Jugos naturales', [
    ['Jugo de plátano', 'S/. 7.00'], ['Jugo de fresa', 'S/. 7.00'], ['Jugo de blueberry', 'S/. 8.00'], ['Jugo de mango', 'S/. 7.00'],
    ['Jugo de maracumango', 'S/. 8.00'], ['Jugo de piña', 'S/. 7.00'], ['Jugo de papaya', 'S/. 7.00'], ['Jugo de fresa con papaya', 'S/. 8.00'],
  ]),
  category('batidos', 'Batidos', [
    ['Batido de fresa', 'S/. 13.00', 'Vaso de 16 oz. Fresa, leche y yogurt griego.'], ['Banana Berry', 'S/. 13.00', 'Plátano, fresa, leche y yogurt griego.'],
    ['Papaya Energy', 'S/. 13.00', 'Papaya, plátano, fresa, leche y yogurt griego.'], ['Batido de mango', 'S/. 13.00'], ['Batido de maracumango', 'S/. 13.00'],
    ['Banana Fit Cream', 'S/. 13.00'], ['Batido de blueberry', 'S/. 13.00'],
  ]),
  category('jarras', 'Jarras', [
    ['Jarra de chicha morada (½ Lt)', 'S/. 7.00'], ['Jarra de chicha morada (1 Lt)', 'S/. 12.00'], ['Jarra de limonada (½ Lt)', 'S/. 7.00'], ['Jarra de limonada (1 Lt)', 'S/. 12.00'],
    ['Jarra de maracuyá (½ Lt)', 'S/. 7.00'], ['Jarra de maracuyá (1 Lt)', 'S/. 12.00'], ['Jarra de naranjada (½ Lt)', 'S/. 7.00'], ['Jarra de naranjada (1 Lt)', 'S/. 12.00'],
    ['Jarra de fresa (½ Lt)', 'S/. 8.50'], ['Jarra de fresa (1 Lt)', 'S/. 16.00'], ['Jarra de mango (½ Lt)', 'S/. 8.50'], ['Jarra de mango (1 Lt)', 'S/. 16.00'],
    ['Jarra de papaya (½ Lt)', 'S/. 8.50'], ['Jarra de papaya (1 Lt)', 'S/. 16.00'], ['Jarra de piña (½ Lt)', 'S/. 8.50'], ['Jarra de piña (1 Lt)', 'S/. 16.00'],
    ['Jarra de maracumango (½ Lt)', 'S/. 9.50'], ['Jarra de maracumango (1 Lt)', 'S/. 18.00'],
  ]),
  category('mojitos', 'Mojitos', [
    ['Mojito clásico', 'S/. 15.00'], ['Mojito de fresa', 'S/. 15.00'], ['Mojito de maracuyá', 'S/. 15.00'], ['Mojito de mango', 'S/. 15.00'], ['Mojito de maracumango', 'S/. 15.00'],
    ['Mojito Blue Curaçao', 'S/. 15.00'], ['Mojito Jager', 'S/. 18.00'], ['Mojito Blueberry', 'S/. 18.00'], ['Mojito Corona', 'S/. 18.00'], ['Promo 2 mojitos', 'S/. 22.00'], ['Promo 2 mojitos Corona', 'S/. 32.00'],
  ]),
  category('cocteles', 'Cócteles', [
    ['Pisco Sour', 'S/. 15.00'], ['Piña colada', 'S/. 15.00'], ['Algarrobina', 'S/. 15.00'], ['Laguna Azul', 'S/. 15.00'], ['Machu Picchu', 'S/. 15.00'], ['Daiquiri', 'S/. 15.00', 'Fresa o durazno.'], ['Chilcano', 'S/. 15.00'], ['Pink Panther', 'S/. 18.00'], ['Orgasmo', 'S/. 18.00'],
  ]),
  category('cervezas', 'Cervezas', [
    ['Cusqueña Dorada', 'S/. 12.00'], ['Cusqueña Trigo', 'S/. 12.00'], ['Cusqueña Negra', 'S/. 12.00'], ['Pilsen', 'S/. 12.00'], ['Corona', 'S/. 18.00'],
  ]),
  category('bebidas-heladas', 'Gaseosas', [
    ['Agua Cielo', 'S/. 2.00'], ['Agua San Luis', 'S/. 3.00'], ['Gaseosa de 600 ml', 'S/. 5.00'], ['Gaseosa de 1 Lt', 'S/. 9.00'], ['Gaseosa de 2 Lt', 'S/. 16.00'],
  ]),
  category('bebidas-calientes', 'Bebidas calientes', [
    ['Té', 'S/. 3.00'], ['Manzanilla', 'S/. 3.00'], ['Anís', 'S/. 3.00'], ['Hierba luisa', 'S/. 3.00'], ['Café gourmet', 'S/. 4.00'], ['Té negro', 'S/. 5.00'],
    ['Té de la abuela', 'S/. 5.00'], ['Emoliente clásico', 'S/. 6.00'], ['Emoliente de maracuyá', 'S/. 6.00'], ['Emoliente de fresa', 'S/. 6.00'], ['Emoliente de mango', 'S/. 6.00'], ['Chocolate caliente', 'S/. 10.00'],
  ]),
  category('refrescantes', 'Bebidas refrescantes', [
    ['Iced Tea del campo', 'S/. 8.00', 'Infusión de cedrón, eucalipto, linaza, hierba luisa, manzanilla y limón.'],
    ['Iced Tea con naranja y limón', 'S/. 8.00', 'Infusión de té con naranja y limón.'],
    ['Iced Tea fresa con arándanos', 'S/. 10.00', 'Infusión de té con fresa y arándanos.'],
    ['Iced Tea fresa con naranja', 'S/. 8.00', 'Infusión de té con zumo de naranja y fresa.'],
    ['Iced Coffee Latte', 'S/. 10.00', 'Leche con un shot de café acompañado de crema batida.'],
    ['Chocolate helado', 'S/. 10.00', 'Acompañado de crema batida, fudge de chocolate y marshmallows.'],
  ]),
  category('guarniciones', 'Guarniciones', [
    ['Porción de arroz blanco', 'S/. 6.00'],
    ['Porción de arroz chaufa', 'S/. 7.00'],
    ['Porción de papas personal', 'S/. 7.00'],
    ['1/2 porción de papas', 'S/. 14.00'],
    ['1 porción de papas familiar', 'S/. 24.00'],
  ]),
];
