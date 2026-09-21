import React, { useEffect, useMemo, useState } from 'react';
import {
  Bike, Check, CheckCircle2, ChevronRight, Clock3, Facebook, Gift, Instagram, Loader2, MapPin, Minus,
  Navigation, Phone, Plus, ShoppingBag, SlidersHorizontal, Sparkles, Star, Store, Trash2,
  UserRound, Utensils, X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_MENU_DATA } from './data/menuData';
import { fetchSheetData, SheetCategory, SheetDish, SHEET_ID, submitSheetData } from './services/googleSheets';

const RESTAURANTE_NAME = 'La Real Burger';
const RESTAURANTE_SLOGAN = 'Sabor real, momentos inolvidables';
const WHATSAPP_NUMBER = '51914795450';
const STORE_PHONE_DISPLAY = '914 795 450';
const STORE_ADDRESS = 'Asoc. San Francisco, calle Los Álamos, Mz. 05, Lt. 10, 02002 Coronel Gregorio Albarracín Lanchipa, Perú';
const STORE_HOURS = 'Lunes a sábado · 9:00 a. m. – 6:00 p. m.';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;
const INSTAGRAM_URL = 'https://www.instagram.com/larealburguer.pe/';
const FACEBOOK_URL = 'https://www.facebook.com/p/La-Real-burguer-sangucheria-100066460213380/';
const LOGO_PATH = '/assets/la-real-logo.png';
const BANNER_PATH = '/assets/la-real-banner.png';
const BIRTHDAY_PROMO_PATH = '/assets/birthday-promo.png';
const MARQUEE_TEXT = '🔥 HAMBURGUESAS CON SABOR REAL • PEDIDOS RÁPIDOS POR WHATSAPP • RECOJO EN TIENDA O DELIVERY • ';
const LOCAL_IMAGES: Record<string, string> = {
  'Burger clásica': '/assets/platos/burger-clasica.webp',
  'Cheese Burger': '/assets/platos/cheese-burger.webp',
  'Cheddar Burger': '/assets/platos/cheddar-burger.webp',
  'Royal Burger': '/assets/platos/royal-burger.webp',
  'Royal Americana': '/assets/platos/royal-americana.webp',
  'Bacon Burger': '/assets/platos/bacon-burger.webp',
  'American Burger': '/assets/platos/american-burger.webp',
  'Hawaiian Burger': '/assets/platos/hawaiian-burger.webp',
  'Salchipapa clásica': '/assets/platos/salchipapa-clasica.webp',
  'Salchi pobre': '/assets/platos/salchi-pobre.webp',
  'Chori papa': '/assets/platos/chori-papa.webp',
  'Chicken Crispy': '/assets/platos/chicken-crispy.webp',
  'Salchipollo': '/assets/platos/salchipollo.webp',
  'Salchipollo Crispy': '/assets/platos/salchipollo-crispy.webp',
  'Salchi Burger': '/assets/platos/salchi-burger.webp',
  'Salchi Pollo Real': '/assets/platos/salchi-pollo-real.webp',
  'Camionero': '/assets/platos/camionero.webp',
  'Mostrito': '/assets/platos/mostrito.webp',
  'Combo Broaster 1': '/assets/platos/combo-broaster-1.webp',
  'Combo Broaster 2': '/assets/platos/combo-broaster-2.webp',
  'Combo Broaster 3': '/assets/platos/combo-broaster-3.webp',
  'Tequeños de queso': '/assets/platos/tequenos-de-queso.webp',
  'Tequeños de queso con jamón': '/assets/platos/tequenos-de-queso-con-jamon.webp',
  'Tequeños de queso con hot dog': '/assets/platos/tequenos-de-queso-con-hot-dog.webp',
  'Tequeños de lomo saltado': '/assets/platos/tequenos-de-lomo-saltado.webp',
  'Filete clásico': '/assets/platos/filete-clasico.webp',
  'Filete crispy': '/assets/platos/filete-crispy.webp',
  'Filete con queso': '/assets/platos/filete-con-queso.webp',
  'Filete Royal': '/assets/platos/filete-royal.webp',
  'Filete Royal Americana': '/assets/platos/filete-royal-americana.webp',
  'Filete con todo': '/assets/platos/filete-con-todo.webp',
  'Chorizo clásico': '/assets/platos/chorizo-clasico.webp',
  'Chorizo con queso': '/assets/platos/chorizo-con-queso.webp',
  'Chorizo Royal': '/assets/platos/chorizo-royal.webp',
  'Chorizo Americano': '/assets/platos/chorizo-americano.webp',
  'Hot dog clásico': '/assets/platos/hot-dog-clasico.webp',
  'Hot dog Royal': '/assets/platos/hot-dog-royal.webp',
  'Lomo saltado': '/assets/platos/lomo-saltado.webp',
  'Pollo saltado': '/assets/platos/pollo-saltado.webp',
  'Pollo a la plancha': '/assets/platos/pollo-a-la-plancha.webp',
  'Arroz chaufa de pollo': '/assets/platos/arroz-chaufa-de-pollo.webp',
  'Arroz chaufa de carne': '/assets/platos/arroz-chaufa-de-carne.webp',
  'Arroz chaufa de cerdo': '/assets/platos/arroz-chaufa-de-cerdo.webp',
  'Arroz chaufa 3 sabores': '/assets/platos/arroz-chaufa-3-sabores.webp',
  'Alitas broaster': '/assets/platos/alitas-broaster.webp',
  'Alitas búfalo': '/assets/platos/alitas-bufalo.webp',
  'Alitas en salsa de maracuyá': '/assets/platos/alitas-en-salsa-de-maracuya.webp',
  'Alitas BBQ': '/assets/platos/alitas-bbq.webp',
  'Alitas Honey Mustard': '/assets/platos/alitas-honey-mustard.webp',
  'Alitas acevichadas': '/assets/platos/alitas-acevichadas.webp',
  'Alitas Hot Wings': '/assets/platos/alitas-hot-wings.webp',
  'Duo alitas': '/assets/platos/duo-alitas.webp',
  'Alitas Teriyaki': '/assets/platos/alitas-teriyaki.webp',
  'Alitas anticucheras': '/assets/platos/alitas-anticucheras.webp',
  'Trío de alitas': '/assets/platos/trio-de-alitas.webp',
  'Alitas familiar': '/assets/platos/alitas-familiar.webp',
  'Iced Tea del campo': '/assets/platos/iced-tea-del-campo.webp',
  'Iced Tea con naranja y limón': '/assets/platos/iced-tea-con-naranja-y-limon.webp',
  'Iced Tea fresa con arándanos': '/assets/platos/iced-tea-fresa-con-arandanos.webp',
  'Iced Tea fresa con naranja': '/assets/platos/iced-tea-fresa-con-naranja.webp',
  'Iced Coffee Latte': '/assets/platos/iced-coffee-latte.webp',
  'Chocolate helado': '/assets/platos/chocolate-helado.webp',
  'Jugo de plátano': '/assets/platos/jugo-de-platano.webp',
  'Jugo de fresa': '/assets/platos/jugo-de-fresa.webp',
  'Jugo de blueberry': '/assets/platos/jugo-de-blueberry.webp',
  'Jugo de mango': '/assets/platos/jugo-de-mango.webp',
  'Jugo de maracumango': '/assets/platos/jugo-de-maracumango.webp',
  'Jugo de piña': '/assets/platos/jugo-de-pina.webp',
  'Jugo de papaya': '/assets/platos/jugo-de-papaya.webp',
  'Jugo de fresa con papaya': '/assets/platos/jugo-de-fresa-con-papaya.webp',
  'Leche adicional para jugo': '/assets/platos/leche-adicional-para-jugo.webp',
  'Batido de fresa': '/assets/platos/batido-de-fresa.webp',
  'Banana Berry': '/assets/platos/banana-berry.webp',
  'Papaya Energy': '/assets/platos/papaya-energy.webp',
  'Batido de mango': '/assets/platos/batido-de-mango.webp',
  'Batido de maracumango': '/assets/platos/batido-de-maracumango.webp',
  'Banana Fit Cream': '/assets/platos/banana-fit-cream.webp',
  'Batido de blueberry': '/assets/platos/batido-de-blueberry.webp',
  'Frappe capuccino': '/assets/platos/frappe-capuccino.webp',
  'Frappe mocaccino': '/assets/platos/frappe-mocaccino.webp',
  'Frappe Oreo': '/assets/platos/frappe-oreo.webp',
  'Frappe caramelo': '/assets/platos/frappe-caramelo.webp',
  'Frappe chocolate': '/assets/platos/frappe-chocolate.webp',
  'Frappe fresa blueberry': '/assets/platos/frappe-fresa-blueberry.webp',
  'Frapuccino': '/assets/platos/frapuccino.webp',
  'Frappe maracuyá': '/assets/platos/frappe-maracuya.webp',
  'Frappe mango': '/assets/platos/frappe-mango.webp',
  'Frappe lúcuma': '/assets/platos/frappe-lucuma.webp',
  'Promo 2 Frappés': '/assets/platos/promo-2-frappes.webp',
  'Jarra de chicha morada (½ Lt)': '/assets/platos/jarra-de-chicha-morada-lt.webp',
  'Jarra de chicha morada (1 Lt)': '/assets/platos/jarra-de-chicha-morada-1-lt.webp',
  'Jarra de limonada (½ Lt)': '/assets/platos/jarra-de-limonada-lt.webp',
  'Jarra de limonada (1 Lt)': '/assets/platos/jarra-de-limonada-1-lt.webp',
  'Jarra de maracuyá (½ Lt)': '/assets/platos/jarra-de-maracuya-lt.webp',
  'Jarra de maracuyá (1 Lt)': '/assets/platos/jarra-de-maracuya-1-lt.webp',
  'Jarra de naranjada (½ Lt)': '/assets/platos/jarra-de-naranjada-lt.webp',
  'Jarra de naranjada (1 Lt)': '/assets/platos/jarra-de-naranjada-1-lt.webp',
  'Jarra de fresa (½ Lt)': '/assets/platos/jarra-de-fresa-lt.webp',
  'Jarra de fresa (1 Lt)': '/assets/platos/jarra-de-fresa-1-lt.webp',
  'Jarra de mango (½ Lt)': '/assets/platos/jarra-de-mango-lt.webp',
  'Jarra de mango (1 Lt)': '/assets/platos/jarra-de-mango-1-lt.webp',
  'Jarra de papaya (½ Lt)': '/assets/platos/jarra-de-papaya-lt.webp',
  'Jarra de papaya (1 Lt)': '/assets/platos/jarra-de-papaya-1-lt.webp',
  'Jarra de piña (½ Lt)': '/assets/platos/jarra-de-pina-lt.webp',
  'Jarra de piña (1 Lt)': '/assets/platos/jarra-de-pina-1-lt.webp',
  'Jarra de maracumango (½ Lt)': '/assets/platos/jarra-de-maracumango-lt.webp',
  'Jarra de maracumango (1 Lt)': '/assets/platos/jarra-de-maracumango-1-lt.webp',
  'Agua Cielo': '/assets/platos/agua-cielo.webp',
  'Agua San Luis': '/assets/platos/agua-san-luis.webp',
  'Gaseosa de 600 ml': '/assets/platos/gaseosa-de-600-ml.webp',
  'Gaseosa de 1 Lt': '/assets/platos/gaseosa-de-1-lt.webp',
  'Gaseosa de 2 Lt': '/assets/platos/gaseosa-de-2-lt.webp',
  'Té': '/assets/platos/te.webp',
  'Manzanilla': '/assets/platos/manzanilla.webp',
  'Anís': '/assets/platos/anis.webp',
  'Hierba luisa': '/assets/platos/hierba-luisa.webp',
  'Café gourmet': '/assets/platos/cafe-gourmet.webp',
  'Té negro': '/assets/platos/te-negro.webp',
  'Té de la abuela': '/assets/platos/te-de-la-abuela.webp',
  'Emoliente clásico': '/assets/platos/emoliente-clasico.webp',
  'Emoliente de maracuyá': '/assets/platos/emoliente-de-maracuya.webp',
  'Emoliente de fresa': '/assets/platos/emoliente-de-fresa.webp',
  'Emoliente de mango': '/assets/platos/emoliente-de-mango.webp',
  'Chocolate caliente': '/assets/platos/chocolate-caliente.webp',
  'Mojito clásico': '/assets/platos/mojito-clasico.webp',
  'Mojito de fresa': '/assets/platos/mojito-de-fresa.webp',
  'Mojito de maracuyá': '/assets/platos/mojito-de-maracuya.webp',
  'Mojito de mango': '/assets/platos/mojito-de-mango.webp',
  'Mojito de maracumango': '/assets/platos/mojito-de-maracumango.webp',
  'Mojito Blue Curaçao': '/assets/platos/mojito-blue-curacao.webp',
  'Mojito Jager': '/assets/platos/mojito-jager.webp',
  'Mojito Blueberry': '/assets/platos/mojito-blueberry.webp',
  'Mojito Corona': '/assets/platos/mojito-corona.webp',
  'Promo 2 mojitos': '/assets/platos/promo-2-mojitos.webp',
  'Promo 2 mojitos Corona': '/assets/platos/promo-2-mojitos-corona.webp',
  'Pisco Sour': '/assets/platos/pisco-sour.webp',
  'Piña colada': '/assets/platos/pina-colada.webp',
  'Algarrobina': '/assets/platos/algarrobina.webp',
  'Laguna Azul': '/assets/platos/laguna-azul.webp',
  'Machu Picchu': '/assets/platos/machu-picchu.webp',
  'Daiquiri': '/assets/platos/daiquiri.webp',
  'Chilcano': '/assets/platos/chilcano.webp',
  'Pink Panther': '/assets/platos/pink-panther.webp',
  'Cusqueña Dorada': '/assets/platos/cusquena-dorada.webp',
  'Cusqueña Trigo': '/assets/platos/cusquena-trigo.webp',
  'Cusqueña Negra': '/assets/platos/cusquena-negra.webp',
  'Pilsen': '/assets/platos/pilsen.webp',
  'Corona': '/assets/platos/corona.webp',
  'Porción de arroz blanco': '/assets/platos/porcion-de-arroz-blanco.webp',
  'Porción de arroz chaufa': '/assets/platos/porcion-de-arroz-chaufa.webp',
  'Porción de papas personal': '/assets/platos/porcion-de-papas-personal.webp',
  '1/2 porción de papas': '/assets/platos/1-2-porcion-de-papas.webp',
  '1 porción de papas familiar': '/assets/platos/1-porcion-de-papas-familiar.webp',
};

interface Dish { nombre: string; descripcion?: string; imagen?: string; precio: string; }
interface Category { id: string; nombre: string; items: Dish[]; }
interface CartItem {
  id: string;
  nombre: string;
  precio: string;
  cantidad: number;
  categoriaId?: string;
  cremas?: string[];
  sabores?: string[];
  comentario?: string;
  isCustomizable?: boolean;
}
type OrderType = 'delivery' | 'pickup';
interface OrderData { nombre: string; telefono: string; direccion: string; referencia: string; nombreRecojo: string; }
interface UserLocation { latitude: number; longitude: number; accuracy: number; }

const CREMAS_DISPONIBLES = [
  { id: 'ketchup', nombre: 'Kétchup', emoji: '🍅' },
  { id: 'mostaza', nombre: 'Mostaza', emoji: '🟡' },
  { id: 'aji', nombre: 'Ají de la casa', emoji: '🌶️' },
  { id: 'chimichurri', nombre: 'Chimichurri', emoji: '🌿' },
  { id: 'mayonesa', nombre: 'Mayonesa', emoji: '⚪' },
  { id: 'aceituna', nombre: 'Aceituna', emoji: '🫒' },
];

const ALITAS_SABORES = [
  { id: 'bbq', nombre: 'BBQ', emoji: '🍖' },
  { id: 'bufalo', nombre: 'Búfalo', emoji: '🔥' },
  { id: 'broaster', nombre: 'Broaster', emoji: '🍗' },
  { id: 'hot-wings', nombre: 'Hot Wings', emoji: '🌶️' },
  { id: 'acevichada', nombre: 'Acevichada', emoji: '🍋' },
  { id: 'maracuya', nombre: 'Maracuyá', emoji: '🍯' },
  { id: 'anticucheras', nombre: 'Anticucheras', emoji: '🍢' },
  { id: 'teriyaki', nombre: 'Teriyaki', emoji: '🥢' },
  { id: 'honey-mustard', nombre: 'Honey Mustard', emoji: '🟡' },
];

const getMaxAlitasFlavors = (dishName: string): number => {
  const norm = dishName.toLowerCase().trim();
  if (norm.includes('duo alitas') || norm.includes('dúo alitas')) return 2;
  if (norm.includes('trío de alitas') || norm.includes('trio de alitas') || norm.includes('trio alitas')) return 3;
  if (norm.includes('alitas familiar')) return 4;
  return 0;
};

const isExcludedCategory = (value: string) => /waffle|gofre|^s[aá]nguches?$/i.test(value.trim());
const isWaffleRelated = (value: string) => /waffle|gofre/i.test(value);
const isExcludedDish = (value: string) => /alitas\s*cl[aá]sicas/i.test(value.trim());

const sanitizeCategories = (items: Category[]) => items
  .filter(category => !isExcludedCategory(category.nombre) && !isExcludedCategory(category.id))
  .map(category => ({
    ...category,
    items: category.items
      .filter(dish => !isWaffleRelated(`${dish.nombre} ${dish.descripcion || ''}`) && !isExcludedDish(dish.nombre))
      .map(dish => ({
        ...dish,
        imagen: LOCAL_IMAGES[dish.nombre] || dish.imagen,
      })),
  }))
  .filter(category => category.items.length > 0);

const isCustomizableCategory = (categoryId: string, categoryNombre?: string) => {
  const normId = categoryId.toLowerCase();
  const normName = (categoryNombre || '').toLowerCase();
  return (
    normId.includes('hamburguesa') ||
    normId.includes('filete') ||
    normId.includes('chorizo') ||
    normId.includes('hotdog') ||
    normId.includes('salchipapa') ||
    normName.includes('hamburguesa') ||
    normName.includes('filete') ||
    normName.includes('chorizo') ||
    normName.includes('hot dog') ||
    normName.includes('salchipapa')
  );
};

const isDrinkOrAgregado = (nombre: string, categoriaId?: string) => {
  const normCat = (categoriaId || '').toLowerCase();
  const normName = nombre.toLowerCase().trim();

  // Guarniciones no son platos principales, no pagan táper
  if (
    normCat.includes('guarnicion') || normCat.includes('guarnición') ||
    normName === 'porción de arroz blanco' || normName === 'porcion de arroz blanco' ||
    normName === 'porción de arroz chaufa' || normName === 'porcion de arroz chaufa' ||
    normName === 'porción de papas personal' || normName === 'porcion de papas personal' ||
    normName === '1/2 porción de papas' || normName === '1/2 porcion de papas' ||
    normName === '1 porción de papas familiar' || normName === '1 porcion de papas familiar' ||
    normName === '1 poción de papas familiar' || normName === '1 pocion de papas familiar' ||
    normName.startsWith('porción de') || normName.startsWith('porcion de')
  ) {
    return true;
  }

  const drinkCatIds = [
    'refrescantes', 'jugos', 'batidos', 'frappe', 'jarras',
    'bebidas-heladas', 'bebidas-calientes', 'mojitos', 'cocteles', 'cervezas',
  ];
  if (drinkCatIds.some(id => normCat.includes(id))) return true;

  if (
    normCat.includes('bebida') || normCat.includes('jugo') ||
    normCat.includes('batido') || normCat.includes('frapp') ||
    normCat.includes('jarra') || normCat.includes('mojito') ||
    normCat.includes('coctel') || normCat.includes('cóctel') ||
    normCat.includes('cerveza')
  ) return true;

  if (
    normName.includes('jugo') || normName.includes('iced tea') ||
    normName.includes('iced coffee') || normName.includes('chocolate helado') ||
    normName.includes('batido') || normName.includes('banana berry') ||
    normName.includes('papaya energy') || normName.includes('banana fit') ||
    normName.includes('frappe') || normName.includes('frapuccino') ||
    normName.includes('jarra') || normName.includes('agua ') ||
    normName.includes('gaseosa') || normName.startsWith('té') ||
    normName.startsWith('te ') || normName.includes('manzanilla') ||
    normName.includes('anís') || normName.includes('anis') ||
    normName.includes('hierba luisa') || normName.includes('café') ||
    normName.includes('cafe ') || normName.includes('emoliente') ||
    normName.includes('chocolate caliente') || normName.includes('mojito') ||
    normName.includes('pisco sour') || normName.includes('piña colada') ||
    normName.includes('pina colada') || normName.includes('algarrobina') ||
    normName.includes('laguna azul') || normName.includes('machu picchu') ||
    normName.includes('daiquiri') || normName.includes('chilcano') ||
    normName.includes('pink panther') || normName.includes('cusqueña') ||
    normName.includes('cusquena') || normName.includes('pilsen') ||
    normName.includes('corona') || normName.includes('leche adicional') ||
    normName.includes('agregado')
  ) {
    return true;
  }

  return false;
};

const getItemDeliveryFee = (item: { nombre: string; categoriaId?: string }) => {
  const normName = item.nombre.toLowerCase().trim();
  const normCat = (item.categoriaId || '').toLowerCase().trim();

  // 1. Reglas específicas de S/. 2.00 de táper:
  // - Trío de alitas y Alitas familiar
  if (
    normName.includes('trío de alitas') ||
    normName.includes('trio de alitas') ||
    normName.includes('trio alitas') ||
    normName.includes('alitas familiar')
  ) {
    return 2;
  }
  // - Broaster: Combo 2 y Combo 3
  if (
    normName.includes('combo broaster 2') ||
    normName.includes('combo 2') ||
    normName.includes('combo broaster 3') ||
    normName.includes('combo 3')
  ) {
    return 2;
  }

  // 2. Bebidas y guarniciones / agregados no pagan táper (S/. 0.00)
  if (isDrinkOrAgregado(item.nombre, item.categoriaId)) {
    return 0;
  }

  // 3. Reglas de S/. 1.00 de táper:
  // - En categoría Alitas: individuales y Duo alitas (1 sol)
  if (normCat.includes('alitas') || normName.includes('alitas') || normName.includes('duo alitas') || normName.includes('dúo alitas')) {
    return 1;
  }
  // - En categoría Salchipapas: todas pagan 1 sol de táper
  if (
    normCat.includes('salchipapa') ||
    normName.includes('salchipapa') ||
    normName.includes('salchi') ||
    normName.includes('chori papa') ||
    normName.includes('chicken crispy') ||
    normName.includes('camionero')
  ) {
    return 1;
  }
  // - En categoría Broaster: Mostrito y Combo 1 pagan 1 sol de táper
  if (normName.includes('mostrito') || normName.includes('combo broaster 1') || normName.includes('combo 1')) {
    return 1;
  }
  // - En categoría Criollos: todos pagan 1 sol de táper
  if (
    normCat.includes('criollo') ||
    normCat.includes('especial') ||
    normName.includes('lomo saltado') ||
    normName.includes('pollo saltado') ||
    normName.includes('pollo a la plancha') ||
    (normName.includes('chaufa') && !normName.includes('porción') && !normName.includes('porcion'))
  ) {
    return 1;
  }
  // - Demás platos de comida: Hamburguesas, Filetes, Chorizos/Hot dogs, Tequeños (1 sol)
  return 1;
};

const getDishUnitPrice = (precio: string) => {
  const priceMatch = precio.match(/\d+(?:[.,]\d+)?/);
  return Number.parseFloat((priceMatch?.[0] || '0').replace(',', '.')) || 0;
};

const fieldClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#ff9d16] focus:bg-white/[0.09]';
const fieldLabelClass = 'mb-1.5 ml-1 block text-[10px] font-black uppercase tracking-[0.15em] text-white/55';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [orderData, setOrderData] = useState<OrderData>({ nombre: '', telefono: '', direccion: '', referencia: '', nombreRecojo: '' });
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showBirthdayPromo, setShowBirthdayPromo] = useState(true);
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [isSubmittingBirthday, setIsSubmittingBirthday] = useState(false);
  const [birthdayData, setBirthdayData] = useState({ nombre: '', telefono: '', fechaNacimiento: '', distrito: '', correo: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({ estrellasMozo: 0, estrellasComida: 0, comentario: '' });
  const [configuringDish, setConfiguringDish] = useState<{ dish: Dish; category: Category } | null>(null);
  const [selectedCremas, setSelectedCremas] = useState<string[]>(CREMAS_DISPONIBLES.map(c => c.nombre));
  const [dishComment, setDishComment] = useState('');
  const [dishQuantity, setDishQuantity] = useState(1);
  const [configuringAlitas, setConfiguringAlitas] = useState<{ dish: Dish; category: Category; maxFlavors: number } | null>(null);
  const [selectedSabores, setSelectedSabores] = useState<string[]>([]);
  const [alitasComment, setAlitasComment] = useState('');
  const [alitasQuantity, setAlitasQuantity] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!SHEET_ID) {
          const cleanCategories = sanitizeCategories(DEFAULT_MENU_DATA);
          setCategories(cleanCategories);
          setActiveCategory(cleanCategories[0]?.id ?? null);
          return;
        }
        const [cats, dishes] = await Promise.all([
          fetchSheetData<SheetCategory>('Categorías'),
          fetchSheetData<SheetDish>('Platos'),
        ]);
        if (cats.length === 0 && dishes.length === 0) {
          const cleanCategories = sanitizeCategories(DEFAULT_MENU_DATA);
          setCategories(cleanCategories);
          setActiveCategory(cleanCategories[0]?.id ?? null);
          return;
        }
        const formattedCategories: Category[] = cats.map(category => ({
          id: category.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: category.nombre,
          items: dishes.filter(dish => dish.categoría === category.nombre).map(dish => ({
            nombre: dish['nombre del plato'], descripcion: dish.descripción, precio: dish.precio,
            imagen: LOCAL_IMAGES[dish['nombre del plato']] || dish['URL de imagen'] || undefined,
          })),
        }));
        const cleanCategories = sanitizeCategories(formattedCategories);
        setCategories(cleanCategories);
        setActiveCategory(cleanCategories[0]?.id ?? null);
      } catch (error) {
        console.error('Error loading data:', error);
        const cleanCategories = sanitizeCategories(DEFAULT_MENU_DATA);
        setCategories(cleanCategories);
        setActiveCategory(cleanCategories[0]?.id ?? null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!showBirthdayPromo || loading) return;
    const timer = window.setTimeout(() => setShowBirthdayPromo(false), 10000);
    return () => window.clearTimeout(timer);
  }, [showBirthdayPromo, loading]);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.cantidad, 0), [cart]);
  const calculateSubtotal = () => cart.reduce((total, item) => {
    const priceMatch = item.precio.match(/\d+(?:[.,]\d+)?/);
    const numericPrice = Number.parseFloat((priceMatch?.[0] || '0').replace(',', '.')) || 0;
    return total + numericPrice * item.cantidad;
  }, 0);

  const calculateDeliveryFee = () => cart.reduce((total, item) => {
    return total + getItemDeliveryFee(item) * item.cantidad;
  }, 0);

  const calculateTotal = () => calculateSubtotal() + calculateDeliveryFee();

  const handleDishClick = (dish: Dish, cat: Category) => {
    const maxFlavors = getMaxAlitasFlavors(dish.nombre);
    if (maxFlavors > 0) {
      setConfiguringAlitas({ dish, category: cat, maxFlavors });
      setSelectedSabores([]);
      setAlitasComment('');
      setAlitasQuantity(1);
    } else if (isCustomizableCategory(cat.id, cat.nombre)) {
      setConfiguringDish({ dish, category: cat });
      setSelectedCremas(CREMAS_DISPONIBLES.map(c => c.nombre));
      setDishComment('');
      setDishQuantity(1);
    } else {
      addToCartDirect(dish, cat);
    }
  };

  const confirmConfiguredAlitas = () => {
    if (!configuringAlitas) return;
    if (selectedSabores.length !== configuringAlitas.maxFlavors) return;
    const { dish } = configuringAlitas;
    const sortedSabores = [...selectedSabores];
    const cleanComment = alitasComment.trim();

    setCart(current => {
      const existing = current.find(item =>
        item.nombre === dish.nombre &&
        item.precio === dish.precio &&
        item.isCustomizable &&
        JSON.stringify(item.sabores?.slice().sort() || []) === JSON.stringify(sortedSabores.slice().sort()) &&
        (item.comentario || '') === cleanComment
      );

      if (existing) {
        return current.map(item => item.id === existing.id ? { ...item, cantidad: item.cantidad + alitasQuantity } : item);
      }

      return [
        ...current,
        {
          id: `${dish.nombre}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          nombre: dish.nombre,
          precio: dish.precio,
          cantidad: alitasQuantity,
          categoriaId: configuringAlitas.category.id,
          sabores: sortedSabores,
          comentario: cleanComment,
          isCustomizable: true,
        },
      ];
    });

    setConfiguringAlitas(null);
  };

  const addToCartDirect = (dish: Dish, cat?: Category) => setCart(current => {
    const exists = current.find(item => item.nombre === dish.nombre && item.precio === dish.precio && !item.isCustomizable);
    if (exists) return current.map(item => item.id === exists.id ? { ...item, cantidad: item.cantidad + 1 } : item);
    return [...current, {
      id: `${dish.nombre}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nombre: dish.nombre,
      precio: dish.precio,
      cantidad: 1,
      categoriaId: cat?.id,
      isCustomizable: false,
    }];
  });

  const confirmConfiguredDish = () => {
    if (!configuringDish) return;
    const { dish } = configuringDish;
    const sortedCremas = [...selectedCremas].sort();
    const cleanComment = dishComment.trim();

    setCart(current => {
      const existing = current.find(item =>
        item.nombre === dish.nombre &&
        item.precio === dish.precio &&
        item.isCustomizable &&
        JSON.stringify(item.cremas?.slice().sort() || []) === JSON.stringify(sortedCremas) &&
        (item.comentario || '') === cleanComment
      );

      if (existing) {
        return current.map(item => item.id === existing.id ? { ...item, cantidad: item.cantidad + dishQuantity } : item);
      }

      return [
        ...current,
        {
          id: `${dish.nombre}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          nombre: dish.nombre,
          precio: dish.precio,
          cantidad: dishQuantity,
          categoriaId: configuringDish.category.id,
          cremas: sortedCremas,
          comentario: cleanComment,
          isCustomizable: true,
        },
      ];
    });

    setConfiguringDish(null);
  };

  const toggleCrema = (cremaNombre: string) => {
    setSelectedCremas(current =>
      current.includes(cremaNombre)
        ? current.filter(c => c !== cremaNombre)
        : [...current, cremaNombre]
    );
  };

  const toggleSabor = (saborNombre: string) => {
    if (!configuringAlitas) return;
    setSelectedSabores(current => {
      if (current.includes(saborNombre)) {
        return current.filter(s => s !== saborNombre);
      }
      if (current.length >= configuringAlitas.maxFlavors) {
        return current;
      }
      return [...current, saborNombre];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => setCart(current => current
    .map(item => {
      if (item.id !== itemId) return item;
      const cantidad = item.cantidad + delta;
      return cantidad > 0 ? { ...item, cantidad } : null;
    })
    .filter(Boolean) as CartItem[]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    document.getElementById(`cat-${categoryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const requestLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no permite compartir la ubicación.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy });
        setLocationLoading(false);
      },
      error => {
        setLocationError(error.code === error.PERMISSION_DENIED
          ? 'No se pudo acceder. Activa el permiso de ubicación precisa e inténtalo otra vez.'
          : 'No pudimos obtener tu ubicación. Revisa tu señal e inténtalo nuevamente.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const sendToWhatsApp = (event: React.FormEvent) => {
    event.preventDefault();
    const subtotal = calculateSubtotal();
    const deliveryFee = calculateDeliveryFee();
    const total = calculateTotal();

    let message = `🍔 *NUEVO PEDIDO — ${RESTAURANTE_NAME.toUpperCase()}*\n\n*Detalle del pedido*\n`;
    cart.forEach(item => {
      message += `• ${item.cantidad} x ${item.nombre} — ${item.precio}\n`;
      if (item.isCustomizable) {
        if (item.sabores && item.sabores.length > 0) {
          message += `   └ *Sabores:* ${item.sabores.join(', ')}\n`;
        }
        if (item.cremas) {
          if (item.cremas.length > 0) {
            message += `   └ *Cremas:* ${item.cremas.join(', ')}\n`;
          } else {
            message += `   └ *Cremas:* Sin cremas\n`;
          }
        }
        if (item.comentario && item.comentario.trim()) {
          message += `   └ *Nota:* ${item.comentario.trim()}\n`;
        }
      }
    });

    message += `\n📋 *Subtotal productos:* S/. ${subtotal.toFixed(2)}\n`;
    const concepto = orderType === 'delivery' ? 'Táper / Empaque delivery' : 'Táper para llevar';
    message += `📦 *${concepto}:* S/. ${deliveryFee.toFixed(2)}\n`;
    message += `💰 *TOTAL A PAGAR: S/. ${total.toFixed(2)}*\n\n`;

    if (orderType === 'delivery') {
      message += `🛵 *Modalidad: Delivery*\n👤 Nombre: ${orderData.nombre.trim()}\n📱 Teléfono: ${orderData.telefono.trim()}\n🏠 Dirección: ${orderData.direccion.trim()}\n📍 Referencia: ${orderData.referencia.trim()}\n`;
      if (userLocation) {
        message += `🗺️ Ubicación actual: https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}\n🎯 Precisión aproximada: ${Math.round(userLocation.accuracy)} m\n`;
      } else message += '🗺️ Ubicación actual: No compartida\n';
    } else {
      message += `🏪 *Modalidad: Recojo en tienda*\n👤 Nombre del cliente: ${orderData.nombre.trim()}\n📱 Teléfono: ${orderData.telefono.trim()}\n🙋 Recoge el pedido: ${orderData.nombreRecojo.trim()}\n📍 Dirección: ${STORE_ADDRESS}\n🕘 Horario: ${STORE_HOURS}\n🗺️ Mapa: ${MAPS_URL}\n`;
    }
    message += '\n✅ Quedo atento(a) a la confirmación. ¡Gracias!';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleBirthdaySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmittingBirthday(true);
    const success = await submitSheetData('Cumpleaños', {
      timestamp: new Date().toLocaleString('es-PE'), ...birthdayData, correo: birthdayData.correo || 'No indicado',
    });
    setIsSubmittingBirthday(false);
    if (success) {
      setShowBirthdayForm(false);
      setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: '', correo: '' });
    } else window.alert('Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.');
  };

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (reviewData.estrellasMozo === 0 || reviewData.estrellasComida === 0) {
      window.alert('Por favor, califica ambas opciones con estrellas.');
      return;
    }
    setIsSubmittingReview(true);
    const success = await submitSheetData('Reseñas', {
      timestamp: new Date().toLocaleString('es-PE'), ...reviewData, comentario: reviewData.comentario || 'Sin comentarios',
    });
    setIsSubmittingReview(false);
    if (success) {
      setReviewSuccess(true);
      window.setTimeout(() => {
        setShowReviewForm(false); setReviewSuccess(false);
        setReviewData({ estrellasMozo: 0, estrellasComida: 0, comentario: '' });
      }, 2500);
    } else window.alert('Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo.');
  };

  if (loading) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#090806] text-[#ff9d16]">
      <img src={LOGO_PATH} alt="La Real Burger" className="mb-5 h-24 w-24 rounded-full object-cover shadow-[0_0_45px_rgba(255,157,22,.28)]" />
      <Loader2 className="mb-3 h-8 w-8 animate-spin" />
      <p className="font-slogan text-xs font-black uppercase tracking-[0.25em]">Preparando algo real...</p>
    </div>
  );

  return (
    <div className="menu-shell relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-[#0b0a08] font-sans text-white shadow-2xl">
      <div className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-md overflow-hidden" aria-hidden="true">
        <span className="floating-orb orb-one" /><span className="floating-orb orb-two" /><span className="floating-orb orb-three" />
        <span className="ember ember-one" /><span className="ember ember-two" /><span className="ember ember-three" />
      </div>

      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#ff9d16]/20 bg-[#0b0a08]/88 px-4 py-3 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <img src={LOGO_PATH} alt="Logo de La Real Burger" className="h-12 w-12 shrink-0 rounded-full border border-[#ff9d16]/50 object-cover shadow-[0_0_20px_rgba(255,157,22,.18)]" />
          <div className="min-w-0"><h1 className="truncate font-title text-[25px] leading-none text-[#ff9d16]">{RESTAURANTE_NAME}</h1><span className="block truncate font-slogan text-[9px] font-bold uppercase tracking-[0.13em] text-orange-100/60">{RESTAURANTE_SLOGAN}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <motion.a href={MAPS_URL} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.92 }} aria-label="Ver ubicación de la tienda" className="brand-icon-button"><MapPin size={19} /></motion.a>
          <motion.button type="button" onClick={() => cartCount > 0 && setShowSummary(true)} whileTap={{ scale: 0.92 }} aria-label="Ver mi pedido" className="brand-icon-button relative">
            <ShoppingBag size={19} />{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </motion.button>
        </div>
      </header>

      <div className="relative z-10 flex overflow-hidden border-y border-orange-300/50 bg-gradient-to-r from-[#f27b16] via-[#ffb11b] to-[#f05a22] py-2">
        <div className="animate-marquee flex gap-6 whitespace-nowrap font-slogan text-[10px] font-black uppercase tracking-[0.16em] text-[#1b1006]">{[...Array(8)].map((_, index) => <span key={index}>{MARQUEE_TEXT}</span>)}</div>
      </div>

      <div className="relative z-10 px-4 pt-4">
        <motion.button type="button" onClick={() => setShowBirthdayForm(true)} whileTap={{ scale: 0.98 }} className="birthday-card group w-full overflow-hidden rounded-[1.6rem] border border-[#ffc35c]/50 p-4 text-left shadow-[0_18px_45px_rgba(117,29,4,.26)]">
          <span className="birthday-shine" />
          <span className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/20 text-yellow-100 ring-1 ring-white/20"><Gift size={25} className="gift-float" /></span>
            <span className="min-w-0"><span className="block font-title text-xl leading-none text-white">¡Para ti, cumpleañero! 🎊</span><span className="mt-1.5 block text-[11px] font-semibold leading-snug text-orange-50/90">Hoy es tu día: elige un frappé o mojito de cortesía. Déjanos tus datos y ven a celebrarlo con sabor real.</span><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-yellow-100">Quiero mi regalo <ChevronRight size={13} /></span></span>
          </span>
        </motion.button>
      </div>

      <div className="relative z-10 px-4 pb-3 pt-4">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="hero-card relative aspect-[1.78/1] overflow-hidden rounded-[1.75rem] border border-[#ff9d16]/35 shadow-[0_24px_55px_rgba(0,0,0,.5)]">
          <img src={BANNER_PATH} alt="Hamburguesa de La Real Burger" className="h-full w-full object-cover" />
        </motion.div>
      </div>

      <nav className="sticky top-[73px] z-40 border-y border-white/[0.06] bg-[#0b0a08]/92 px-4 py-3 backdrop-blur-xl" aria-label="Categorías del menú">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">{categories.map(category => (
          <button key={category.id} type="button" onClick={() => scrollToCategory(category.id)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition ${activeCategory === category.id ? 'border-[#ffad22] bg-[#ff9d16] text-[#1a0f05] shadow-[0_8px_22px_rgba(255,157,22,.24)]' : 'border-white/10 bg-white/[0.05] text-white/65 hover:border-[#ff9d16]/60 hover:text-[#ffb43a]'}`}>{category.nombre}</button>
        ))}</div>
      </nav>

      <main className="relative z-10 flex-1 px-4 pb-36">
        {categories.map((category, categoryIndex) => (
          <section key={category.id} id={`cat-${category.id}`} className="mb-11 scroll-mt-32">
            <div className="mb-4 pt-6">
              <div className="mb-1 flex items-center gap-2 text-[#ff9d16]">
                <span className="text-[9px] font-black uppercase tracking-[0.25em]">{String(categoryIndex + 1).padStart(2, '0')} · Nuestra carta</span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#ff9d16]/55 to-transparent" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Utensils size={20} className="wave-icon text-[#ff9d16]" />
                  <h3 className="category-underline font-category text-[27px] font-bold leading-none text-white">{category.nombre}</h3>
                </div>
                {category.id === 'alitas' && (
                  <span className="rounded-full border border-[#ff9d16]/30 bg-[#ff9d16]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#ffad26]">
                    📦 Táper S/. 1.00 · Trío S/. 2.00
                  </span>
                )}
                {category.id === 'salchipapas' && (
                  <span className="rounded-full border border-[#ff9d16]/30 bg-[#ff9d16]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#ffad26]">
                    📦 Táper S/. 1.00
                  </span>
                )}
                {category.id === 'broaster' && (
                  <span className="rounded-full border border-[#ff9d16]/30 bg-[#ff9d16]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#ffad26]">
                    📦 Táper S/. 1.00 / S/. 2.00
                  </span>
                )}
                {(category.id === 'criollos' || category.id === 'especiales') && (
                  <span className="rounded-full border border-[#ff9d16]/30 bg-[#ff9d16]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#ffad26]">
                    📦 Táper S/. 1.00
                  </span>
                )}
                {category.id === 'guarniciones' && (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                    Sin costo de táper
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">{category.items.map((dish, index) => (
              <motion.article key={`${dish.nombre}-${dish.precio}`} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: Math.min(index * 0.025, 0.15) }} className="menu-dish-row relative flex min-h-[126px] overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-gradient-to-br from-[#1b1915] to-[#11100e] shadow-[0_14px_30px_rgba(0,0,0,.22)]">
                <div className="flex min-w-0 flex-1 flex-col p-4 pr-2 cursor-pointer" onClick={() => handleDishClick(dish, category)}><div className="flex items-start gap-2"><h4 className="font-dish text-[13px] font-black uppercase leading-[1.08] tracking-wide text-white">{dish.nombre}</h4><span className="mt-2.5 min-w-3 flex-1 border-t border-dotted border-[#ff9d16]/35" /></div>{dish.descripcion && <p className="mt-2 line-clamp-3 pr-1 text-[10px] leading-[1.35] text-white/52">{dish.descripcion}</p>}<div className="flex-1" /><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-lg bg-[#ff9d16] px-2.5 py-1 font-dish text-[12px] font-black text-[#1a0f05]">{dish.precio}</span>{getMaxAlitasFlavors(dish.nombre) > 0 ? <span className="rounded-md border border-[#ff9d16]/30 bg-[#ff9d16]/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#ffb13a]">{getMaxAlitasFlavors(dish.nombre)} Sabores</span> : isCustomizableCategory(category.id, category.nombre) ? <span className="rounded-md border border-[#ff9d16]/30 bg-[#ff9d16]/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#ffb13a]">Cremas</span> : null}{getItemDeliveryFee({ nombre: dish.nombre, categoriaId: category.id }) > 0 && <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[8px] font-bold text-white/70">📦 Táper S/. {getItemDeliveryFee({ nombre: dish.nombre, categoriaId: category.id })}</span>}<motion.button type="button" onClick={(e) => { e.stopPropagation(); handleDishClick(dish, category); }} whileTap={{ scale: 0.78 }} aria-label={`Agregar ${dish.nombre} al pedido`} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ff9d16]/40 bg-[#ff9d16]/10 text-[#ffab2e] transition hover:bg-[#ff9d16] hover:text-black"><Plus size={16} strokeWidth={3} /></motion.button></div></div>
                <button type="button" onClick={() => dish.imagen && setSelectedImage(dish.imagen)} className="dish-visual relative flex w-[33%] min-w-[108px] items-center justify-center overflow-hidden border-l border-[#ff9d16]/15" aria-label={dish.imagen ? `Ampliar imagen de ${dish.nombre}` : undefined}>
                  {dish.imagen ? <img src={dish.imagen} alt={dish.nombre} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-110" /> : <span className="relative flex flex-col items-center text-center"><span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#ff9d16]/25 bg-black/25 text-[#ff9d16]"><Utensils size={18} /></span><span className="text-[8px] font-black uppercase leading-snug tracking-[0.15em] text-[#ffc05c]/70">Preparado<br />al momento</span></span>}
                </button>
              </motion.article>
            ))}</div>
          </section>
        ))}

        <section className="experience-card mb-6 mt-8 rounded-[1.75rem] border border-[#ff9d16]/25 p-6 text-center"><Star size={24} className="mx-auto mb-2 fill-[#ff9d16] text-[#ff9d16]" /><h3 className="font-title text-2xl text-[#ffac29]">¿Cómo estuvo tu experiencia?</h3><p className="mx-auto mb-4 mt-1 max-w-[270px] text-[11px] leading-relaxed text-white/55">Tu opinión nos ayuda a servirte cada vez mejor y a seguir creando momentos con sabor real.</p><motion.button type="button" whileTap={{ scale: 0.96 }} onClick={() => setShowReviewForm(true)} className="brand-button w-full"><Star size={17} /> Calificar mi experiencia</motion.button></section>
        <footer className="flex flex-col items-center border-t border-[#ff9d16]/15 pb-8 pt-9 text-center">
          <img src={LOGO_PATH} alt="La Real Burger" className="mb-4 h-28 w-28 rounded-full border border-[#ff9d16]/35 object-cover shadow-[0_0_35px_rgba(255,157,22,.14)]" />
          <p className="font-title text-2xl text-[#ff9d16]">{RESTAURANTE_NAME}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Sabor real en cada pedido</p>
          <div className="mt-5 w-full space-y-2 text-left">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="footer-info-card">
              <Phone size={19} className="shrink-0 text-[#ff9d16]" />
              <span className="min-w-0 flex-1"><small>Pedidos por WhatsApp y teléfono</small>{STORE_PHONE_DISPLAY}</span>
              <ChevronRight size={17} className="shrink-0 text-white/35" />
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="footer-info-card">
              <MapPin size={19} className="shrink-0 text-[#ff9d16]" />
              <span className="min-w-0 flex-1"><small>Encuéntranos en</small>{STORE_ADDRESS}</span>
              <ChevronRight size={17} className="shrink-0 text-white/35" />
            </a>
            <div className="footer-info-card">
              <Clock3 size={19} className="shrink-0 text-[#ff9d16]" />
              <span><small>Horario de atención</small>{STORE_HOURS}</span>
            </div>
          </div>
          <div className="mt-3 grid w-full grid-cols-2 gap-2">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-button social-instagram"><Instagram size={18} /> Instagram</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="social-button social-facebook"><Facebook size={18} /> Facebook</a>
          </div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">© 2026 · La Real Burger</p>
          <a href="https://tymasolutions.lat/" target="_blank" rel="noopener noreferrer" className="mt-4 text-[11px] font-bold text-white/35 transition hover:text-white/70">Hecho por <span className="text-[#31b9ff]">Tyma Solutions</span></a>
        </footer>
      </main>

      <AnimatePresence>{cartCount > 0 && !showSummary && !showCheckout && (
        <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md p-4">
          <div className="cart-dock flex items-center gap-3 rounded-[1.6rem] border border-[#ff9d16]/30 p-3 shadow-[0_20px_55px_rgba(0,0,0,.6)] backdrop-blur-xl"><div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff9d16] text-black shadow-[0_8px_22px_rgba(255,157,22,.25)]"><ShoppingBag size={21} /><span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#17130f] bg-[#df3d21] px-1 text-[9px] font-black text-white">{cartCount}</span></div><div className="min-w-0 flex-1"><p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/42">Tu pedido</p><p className="font-dish text-[15px] font-black text-white">S/. {calculateTotal().toFixed(2)}</p></div><motion.button type="button" whileTap={{ scale: 0.96 }} onClick={() => setShowSummary(true)} className="inline-flex items-center gap-1 rounded-2xl bg-gradient-to-r from-[#f27a16] to-[#ffad1f] px-4 py-3 text-xs font-black text-[#180e05] shadow-[0_8px_24px_rgba(255,141,19,.24)]">Ver mi pedido <ChevronRight size={16} /></motion.button></div>
        </motion.div>
      )}</AnimatePresence>

      <AnimatePresence>{showSummary && (
        <div className="modal-backdrop fixed inset-0 z-[60] flex items-end justify-center p-0 sm:p-4">
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} className="modal-panel w-full max-w-md overflow-y-auto rounded-t-[2rem] border border-white/10 p-5 sm:rounded-[2rem]">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff9d16]">Revisa antes de continuar</p><h2 className="font-title text-[28px] text-white">Mi pedido</h2></div><button type="button" onClick={() => setShowSummary(false)} className="modal-close"><X size={19} /></button></div>
            <div className="mb-5 max-h-[42vh] space-y-2.5 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.045] p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-dish text-xs font-black uppercase text-white">{item.nombre}</h4>
                      <p className="mt-0.5 text-[11px] font-black text-[#ff9d16]">{item.precio}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-2 py-1.5">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} className="text-white/55 hover:text-[#ff9d16]"><Minus size={15} /></button>
                      <span className="w-4 text-center text-xs font-black text-white">{item.cantidad}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} className="text-[#ff9d16]"><Plus size={15} /></button>
                    </div>
                    <button type="button" onClick={() => updateQuantity(item.id, -item.cantidad)} className="p-1 text-red-400/60 hover:text-red-400" aria-label={`Eliminar ${item.nombre}`}><Trash2 size={17} /></button>
                  </div>
                  {item.isCustomizable && (
                    <div className="rounded-xl border border-white/[0.06] bg-black/35 p-2 text-[10px] space-y-1">
                      {item.sabores && item.sabores.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold uppercase tracking-wider text-[#ff9d16]">Sabores:</span>
                          <span className="text-white/85">{item.sabores.join(', ')}</span>
                        </div>
                      )}
                      {item.cremas && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold uppercase tracking-wider text-[#ff9d16]">Cremas:</span>
                          {item.cremas.length > 0 ? (
                            <span className="text-white/85">{item.cremas.join(', ')}</span>
                          ) : (
                            <span className="italic text-white/40">Sin cremas</span>
                          )}
                        </div>
                      )}
                      {item.comentario && (
                        <div className="flex items-start gap-1 text-white/75">
                          <span className="font-bold text-orange-200/60">Nota:</span>
                          <span className="italic text-white/80">“{item.comentario}”</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mb-5 space-y-2 border-y border-dashed border-white/10 py-4 text-xs">
              <div className="flex items-center justify-between text-white/65">
                <span>Subtotal platos</span>
                <span className="font-dish font-bold text-white">S/. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-white/65">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag size={14} className="text-[#ff9d16]" />
                  <span>Costo de táper / empaque</span>
                </span>
                <span className="font-dish font-bold text-[#ffad26]">
                  {calculateDeliveryFee() > 0 ? `+ S/. ${calculateDeliveryFee().toFixed(2)}` : 'S/. 0.00'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.08] pt-2.5 text-sm">
                <span className="font-bold text-white">Total a pagar</span>
                <span className="font-dish text-2xl font-black text-[#ff9d16]">S/. {calculateTotal().toFixed(2)}</span>
              </div>
              <p className="text-[9px] leading-snug text-white/40">
                * Costo de táper: S/. 1.00 en Salchipapas, Alitas (individuales y dúo), Criollos, Mostrito, Combo 1 y demás platos de comida; S/. 2.00 en Trío de alitas, Alitas familiar, Combo Broaster 2 y 3. Guarniciones y bebidas no pagan táper.
              </p>
            </div>
            <button type="button" onClick={() => { setShowSummary(false); setShowCheckout(true); }} className="brand-button w-full py-4">Elegir entrega y enviar <ChevronRight size={19} /></button>
          </motion.div>
        </div>
      )}</AnimatePresence>

      {/* Modal de configuración de pedido para platos personalizables */}
      <AnimatePresence>
        {configuringDish && (
          <div className="modal-backdrop fixed inset-0 z-[65] flex items-end justify-center p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="modal-panel max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] border border-[#ff9d16]/30 p-5 shadow-2xl sm:rounded-[2rem]"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#ff9d16]">
                    <SlidersHorizontal size={13} />
                    <span>Configurar pedido</span>
                  </div>
                  <h2 className="truncate font-title text-2xl text-white sm:text-[26px]">
                    {configuringDish.dish.nombre}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-dish text-sm font-black text-[#ffad26]">
                      {configuringDish.dish.precio} c/u
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/70">
                      📦 Táper: S/. {getItemDeliveryFee({ nombre: configuringDish.dish.nombre, categoriaId: configuringDish.category.id }).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfiguringDish(null)}
                  className="modal-close"
                  aria-label="Cerrar personalización"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Cremas */}
              <div className="mb-5">
                <div className="mb-2.5 flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/85">
                      Elige tus cremas
                    </label>
                    <span className="text-[9px] font-semibold text-white/45">
                      {selectedCremas.length === 0
                        ? 'Sin cremas seleccionadas'
                        : `${selectedCremas.length} de ${CREMAS_DISPONIBLES.length} seleccionadas`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCremas(CREMAS_DISPONIBLES.map(c => c.nombre))}
                      className={`crema-quick-btn ${selectedCremas.length === CREMAS_DISPONIBLES.length ? 'active' : ''}`}
                    >
                      Todas
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCremas([])}
                      className={`crema-quick-btn ${selectedCremas.length === 0 ? 'active' : ''}`}
                    >
                      Ninguna
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {CREMAS_DISPONIBLES.map(crema => {
                    const isSelected = selectedCremas.includes(crema.nombre);
                    return (
                      <button
                        key={crema.id}
                        type="button"
                        onClick={() => toggleCrema(crema.nombre)}
                        className={`crema-chip ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{crema.emoji}</span>
                          <span className="text-xs font-bold">{crema.nombre}</span>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                            isSelected
                              ? 'border-[#ff9d16] bg-[#ff9d16] text-[#130d07]'
                              : 'border-white/20 bg-white/[0.04] text-transparent'
                          }`}
                        >
                          <Check size={13} strokeWidth={3.5} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comentarios / Indicaciones */}
              <div className="mb-5">
                <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.14em] text-white/85" htmlFor="dish-comment">
                  Comentarios o indicaciones especiales
                </label>
                <textarea
                  id="dish-comment"
                  rows={2}
                  value={dishComment}
                  onChange={e => setDishComment(e.target.value)}
                  placeholder="Ej. Sin cebolla, cremas aparte, papas bien doradas..."
                  className={`${fieldClass} resize-none text-xs`}
                />
              </div>

              {/* Cantidad y botón de agregar */}
              <div className="flex items-center gap-3 border-t border-white/[0.08] pt-4">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setDishQuantity(q => Math.max(1, q - 1))}
                    disabled={dishQuantity <= 1}
                    className="p-1 text-white/60 hover:text-[#ff9d16] disabled:opacity-30"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-5 text-center font-dish text-sm font-black text-white">
                    {dishQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDishQuantity(q => q + 1)}
                    className="p-1 text-[#ff9d16] hover:scale-110"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={confirmConfiguredDish}
                  className="brand-button flex-1 py-3.5 text-xs font-black"
                >
                  <span>Agregar al pedido</span>
                  <span className="rounded-lg bg-black/20 px-2 py-0.5 text-[11px]">
                    S/. {(getDishUnitPrice(configuringDish.dish.precio) * dishQuantity).toFixed(2)}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de selección de sabores para alitas (Dúo, Trío, Familiar) */}
      <AnimatePresence>
        {configuringAlitas && (
          <div className="modal-backdrop fixed inset-0 z-[65] flex items-end justify-center p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="modal-panel max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] border border-[#ff9d16]/30 p-5 shadow-2xl sm:rounded-[2rem]"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#ff9d16]">
                    <Sparkles size={13} />
                    <span>Selección de sabores</span>
                  </div>
                  <h2 className="truncate font-title text-2xl text-white sm:text-[26px]">
                    {configuringAlitas.dish.nombre}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-dish text-sm font-black text-[#ffad26]">
                      {configuringAlitas.dish.precio}
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/70">
                      📦 Táper: S/. {getItemDeliveryFee({ nombre: configuringAlitas.dish.nombre, categoriaId: configuringAlitas.category.id }).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfiguringAlitas(null)}
                  className="modal-close"
                  aria-label="Cerrar selección de sabores"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Sabores selection */}
              <div className="mb-5">
                <div className="mb-2.5 flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.14em] text-white/85">
                      Elige tus sabores ({configuringAlitas.maxFlavors} permitidos)
                    </label>
                    <span className="text-[9px] font-semibold text-white/45">
                      {selectedSabores.length === configuringAlitas.maxFlavors
                        ? '✅ ¡Sabores completos!'
                        : `Selecciona ${configuringAlitas.maxFlavors - selectedSabores.length} más (${selectedSabores.length} de ${configuringAlitas.maxFlavors})`}
                    </span>
                  </div>
                  {selectedSabores.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedSabores([])}
                      className="crema-quick-btn"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {ALITAS_SABORES.map(sabor => {
                    const isSelected = selectedSabores.includes(sabor.nombre);
                    const isMaxReached = selectedSabores.length >= configuringAlitas.maxFlavors && !isSelected;
                    return (
                      <button
                        key={sabor.id}
                        type="button"
                        onClick={() => toggleSabor(sabor.nombre)}
                        disabled={isMaxReached}
                        className={`crema-chip ${isSelected ? 'selected' : ''} ${isMaxReached ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{sabor.emoji}</span>
                          <span className="text-xs font-bold">{sabor.nombre}</span>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                            isSelected
                              ? 'border-[#ff9d16] bg-[#ff9d16] text-[#130d07]'
                              : 'border-white/20 bg-white/[0.04] text-transparent'
                          }`}
                        >
                          <Check size={13} strokeWidth={3.5} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comentarios / Indicaciones */}
              <div className="mb-5">
                <label className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.14em] text-white/85" htmlFor="alitas-comment">
                  Comentarios o indicaciones especiales
                </label>
                <textarea
                  id="alitas-comment"
                  rows={2}
                  value={alitasComment}
                  onChange={e => setAlitasComment(e.target.value)}
                  placeholder="Ej. Salsa aparte, bien doraditas..."
                  className={`${fieldClass} resize-none text-xs`}
                />
              </div>

              {/* Cantidad y botón de agregar */}
              <div className="flex items-center gap-3 border-t border-white/[0.08] pt-4">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setAlitasQuantity(q => Math.max(1, q - 1))}
                    disabled={alitasQuantity <= 1}
                    className="p-1 text-white/60 hover:text-[#ff9d16] disabled:opacity-30"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-5 text-center font-dish text-sm font-black text-white">
                    {alitasQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAlitasQuantity(q => q + 1)}
                    className="p-1 text-[#ff9d16] hover:scale-110"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={confirmConfiguredAlitas}
                  disabled={selectedSabores.length !== configuringAlitas.maxFlavors}
                  className={`brand-button flex-1 py-3.5 text-xs font-black ${
                    selectedSabores.length !== configuringAlitas.maxFlavors ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {selectedSabores.length !== configuringAlitas.maxFlavors ? (
                    <span>Elige {configuringAlitas.maxFlavors - selectedSabores.length} sabor{configuringAlitas.maxFlavors - selectedSabores.length > 1 ? 'es' : ''} más</span>
                  ) : (
                    <>
                      <span>Agregar al pedido</span>
                      <span className="rounded-lg bg-black/20 px-2 py-0.5 text-[11px]">
                        S/. {(getDishUnitPrice(configuringAlitas.dish.precio) * alitasQuantity).toFixed(2)}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showCheckout && (
        <div className="modal-backdrop fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 250 }} className="modal-panel max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] border border-white/10 p-5 sm:rounded-[2rem]">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff9d16]">Último paso</p><h2 className="font-title text-[28px] text-white">¿Cómo lo recibes?</h2></div><button type="button" onClick={() => setShowCheckout(false)} className="modal-close"><X size={19} /></button></div>
            <div className="mb-5 grid grid-cols-2 gap-2" role="tablist" aria-label="Modalidad del pedido"><button type="button" onClick={() => setOrderType('delivery')} className={`order-type-card ${orderType === 'delivery' ? 'active' : ''}`}><Bike size={22} /><span>Delivery</span><small>Hasta tu puerta</small></button><button type="button" onClick={() => setOrderType('pickup')} className={`order-type-card ${orderType === 'pickup' ? 'active' : ''}`}><Store size={22} /><span>Recojo</span><small>En nuestra tienda</small></button></div>
            <form onSubmit={sendToWhatsApp} className="space-y-3">
              <div><label className={fieldLabelClass} htmlFor="order-name">Tu nombre</label><div className="relative"><UserRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff9d16]" /><input id="order-name" required value={orderData.nombre} onChange={event => setOrderData({ ...orderData, nombre: event.target.value })} className={`${fieldClass} pl-11`} placeholder="Ej. Juan Pérez" autoComplete="name" /></div></div>
              <div><label className={fieldLabelClass} htmlFor="order-phone">Número de teléfono</label><div className="relative"><Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff9d16]" /><input id="order-phone" required type="tel" inputMode="numeric" minLength={9} maxLength={11} pattern="[0-9]*" value={orderData.telefono} onChange={event => setOrderData({ ...orderData, telefono: event.target.value.replace(/\D/g, '') })} className={`${fieldClass} pl-11`} placeholder="987654321" autoComplete="tel" /></div></div>
              {orderType === 'delivery' ? <>
                <div><label className={fieldLabelClass} htmlFor="order-address">Dirección de entrega</label><input id="order-address" required value={orderData.direccion} onChange={event => setOrderData({ ...orderData, direccion: event.target.value })} className={fieldClass} placeholder="Calle, número, urbanización y distrito" autoComplete="street-address" /></div>
                <div><label className={fieldLabelClass} htmlFor="order-reference">Referencia de la dirección</label><textarea id="order-reference" required rows={2} value={orderData.referencia} onChange={event => setOrderData({ ...orderData, referencia: event.target.value })} className={`${fieldClass} resize-none`} placeholder="Ej. Frente al parque, portón negro" /></div>
                <div className="rounded-2xl border border-[#ff9d16]/20 bg-[#ff9d16]/[0.06] p-3"><button type="button" onClick={requestLocation} disabled={locationLoading} className={`location-button ${userLocation ? 'location-ready' : ''}`}>{locationLoading ? <Loader2 size={19} className="animate-spin" /> : userLocation ? <CheckCircle2 size={19} /> : <Navigation size={19} />}<span>{locationLoading ? 'Obteniendo ubicación...' : userLocation ? 'Ubicación lista para compartir' : 'Compartir mi ubicación actual'}</span></button><p className="mt-2 flex gap-2 text-[9px] leading-relaxed text-orange-100/55"><MapPin size={13} className="mt-0.5 shrink-0 text-[#ff9d16]" />Al pulsar, permite el acceso y activa “ubicación precisa”. Se añadirá un enlace de Google Maps al mensaje de WhatsApp para ubicarte correctamente.</p>{userLocation && <p className="mt-2 text-[9px] font-bold text-emerald-400">Ubicación capturada · precisión aproximada de {Math.round(userLocation.accuracy)} m</p>}{locationError && <p className="mt-2 text-[9px] font-bold text-red-300">{locationError}</p>}</div>
              </> : <div><label className={fieldLabelClass} htmlFor="pickup-name">Nombre de quien recogerá</label><input id="pickup-name" required value={orderData.nombreRecojo} onChange={event => setOrderData({ ...orderData, nombreRecojo: event.target.value })} className={fieldClass} placeholder="Ej. María Pérez" /><div className="pickup-store-card"><div className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-[#ff9d16]" /><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#ff9d16]">Dirección de recojo</p><p className="mt-1 text-[10px] font-semibold leading-relaxed text-white/75">{STORE_ADDRESS}</p></div></div><div className="mt-3 flex items-center gap-3 border-t border-white/[0.08] pt-3"><Clock3 size={18} className="shrink-0 text-[#ff9d16]" /><div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#ff9d16]">Horario</p><p className="mt-0.5 text-[10px] font-semibold text-white/75">{STORE_HOURS}</p></div></div><a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="pickup-map-button"><span>Abrir ubicación en Google Maps</span><ChevronRight size={16} /></a></div></div>}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-white/60">
                  <span>Subtotal platos:</span>
                  <span className="font-dish font-bold text-white">S/. {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span>{orderType === 'delivery' ? '🛵 Táper / empaque delivery:' : '🏪 Táper para llevar:'}</span>
                  <span className="font-dish font-bold text-[#ffad26]">+ S/. {calculateDeliveryFee().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.08] pt-2 text-sm">
                  <span className="font-bold text-white">Total a pagar:</span>
                  <span className="font-dish text-lg font-black text-[#ff9d16]">S/. {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" className="whatsapp-button mt-2 w-full"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20"><ChevronRight size={19} /></span><span className="text-left"><small className="block text-[8px] font-black uppercase tracking-[0.16em] text-white/65">Todo listo</small>Enviar pedido por WhatsApp</span></button>
            </form>
          </motion.div>
        </div>
      )}</AnimatePresence>

      <AnimatePresence>{selectedImage && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setSelectedImage(null)}><button type="button" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white" onClick={() => setSelectedImage(null)}><X /></button><motion.img initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} src={selectedImage} alt="Plato ampliado" className="max-h-[85vh] max-w-full rounded-2xl object-contain" onClick={event => event.stopPropagation()} /></motion.div>}</AnimatePresence>

      <AnimatePresence>{showBirthdayPromo && (
        <div className="modal-backdrop fixed inset-0 z-[90] flex items-center justify-center p-3">
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }} className="birthday-promo-modal relative flex max-h-[96vh] w-full max-w-sm flex-col overflow-hidden rounded-[1.75rem] border border-[#ff9d16]/45 shadow-[0_28px_90px_rgba(0,0,0,.75)]">
            <button type="button" onClick={() => setShowBirthdayPromo(false)} className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md" aria-label="Cerrar promoción"><X size={20} /></button>
            <img src={BIRTHDAY_PROMO_PATH} alt="Promoción de cumpleaños: frappé o mojito de regalo" className="min-h-0 w-full flex-1 object-contain" />
            <div className="relative border-t border-[#ff9d16]/30 bg-[#100c08] p-3">
              <button type="button" onClick={() => { setShowBirthdayPromo(false); setShowBirthdayForm(true); }} className="promo-register-button w-full">
                <Gift size={21} />
                <span><small>Quiero mi regalo</small>REGÍSTRATE ACÁ</span>
                <ChevronRight size={22} />
              </button>
              <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">Esta promoción se cerrará automáticamente en 10 segundos</p>
              <span className="promo-countdown absolute inset-x-0 bottom-0 h-1 bg-[#ff9d16]" />
            </div>
          </motion.div>
        </div>
      )}</AnimatePresence>

      <AnimatePresence>{showBirthdayForm && (
        <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center p-4"><motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="modal-panel max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-[2rem] border border-white/10 p-6"><button type="button" onClick={() => setShowBirthdayForm(false)} className="modal-close absolute right-5 top-5"><X size={18} /></button><div className="mb-5 pr-8"><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff9d16]/15 text-[#ff9d16]"><Gift size={24} /></span><p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff9d16]">Un detalle de la casa</p><h2 className="font-title text-[28px] text-white">¡Feliz cumpleaños! 🎁</h2><p className="mt-1 text-[11px] leading-relaxed text-white/55">Regístrate y celebra con un frappé o mojito de cortesía. Queremos que tu día tenga un sabor muy especial.</p></div>
          <form onSubmit={handleBirthdaySubmit} className="space-y-3"><div><label className={fieldLabelClass}>Nombre completo</label><input required value={birthdayData.nombre} onChange={event => setBirthdayData({ ...birthdayData, nombre: event.target.value })} className={fieldClass} placeholder="Ej. Juan Pérez" /></div><div><label className={fieldLabelClass}>Teléfono</label><input required type="tel" inputMode="numeric" minLength={9} maxLength={11} pattern="[0-9]*" value={birthdayData.telefono} onChange={event => setBirthdayData({ ...birthdayData, telefono: event.target.value.replace(/\D/g, '') })} className={fieldClass} placeholder="987654321" /></div><div><label className={fieldLabelClass}>Fecha de nacimiento</label><input required type="date" value={birthdayData.fechaNacimiento} onChange={event => setBirthdayData({ ...birthdayData, fechaNacimiento: event.target.value })} className={`${fieldClass} [color-scheme:dark]`} /></div><div><label className={fieldLabelClass}>Distrito</label><input required value={birthdayData.distrito} onChange={event => setBirthdayData({ ...birthdayData, distrito: event.target.value })} className={fieldClass} placeholder="Ej. San Martín de Porres" /></div><div><label className={fieldLabelClass}>Correo electrónico (opcional)</label><input type="email" value={birthdayData.correo} onChange={event => setBirthdayData({ ...birthdayData, correo: event.target.value })} className={fieldClass} placeholder="correo@ejemplo.com" /></div><button disabled={isSubmittingBirthday} type="submit" className="brand-button mt-2 w-full py-3.5 disabled:opacity-60">{isSubmittingBirthday ? <Loader2 size={18} className="animate-spin" /> : <><Gift size={18} /> Registrar mi cumpleaños</>}</button></form>
        </motion.div></div>
      )}</AnimatePresence>

      <AnimatePresence>{showReviewForm && (
        <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center p-4"><motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="modal-panel max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-[2rem] border border-white/10 p-6"><button type="button" onClick={() => setShowReviewForm(false)} className="modal-close absolute right-5 top-5"><X size={18} /></button><div className="mb-5 pr-8"><p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff9d16]">Tu opinión importa</p><h2 className="font-title text-[28px] text-white">Cuéntanos tu experiencia</h2><p className="mt-1 text-[11px] text-white/55">Ayúdanos a seguir mejorando cada detalle.</p></div>
          {reviewSuccess ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center text-sm font-bold text-emerald-300">¡Gracias por tu reseña! Nos ayuda muchísimo.</div> : <form onSubmit={handleReviewSubmit} className="space-y-4">{[{ label: 'Atención del equipo', key: 'estrellasMozo' as const }, { label: 'Calidad de la comida', key: 'estrellasComida' as const }].map(item => <div key={item.key} className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 text-center"><p className="mb-2 text-xs font-bold text-white/65">{item.label}</p><div className="flex justify-center gap-1">{[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => setReviewData({ ...reviewData, [item.key]: star })} className="p-1 transition hover:scale-110" aria-label={`${star} estrellas`}><Star size={27} className={reviewData[item.key] >= star ? 'fill-[#ffad1f] text-[#ffad1f]' : 'text-white/15'} /></button>)}</div></div>)}<div><label className={fieldLabelClass}>Comentario (opcional)</label><textarea rows={3} value={reviewData.comentario} onChange={event => setReviewData({ ...reviewData, comentario: event.target.value })} className={`${fieldClass} resize-none`} placeholder="¿Qué fue lo que más te gustó?" /></div><button disabled={isSubmittingReview} type="submit" className="brand-button w-full py-3.5 disabled:opacity-60">{isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : <><Star size={18} /> Enviar mi reseña</>}</button></form>}
        </motion.div></div>
      )}</AnimatePresence>
    </div>
  );
}
