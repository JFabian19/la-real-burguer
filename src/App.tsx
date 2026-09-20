import React, { useEffect, useMemo, useState } from 'react';
import {
  Bike, CheckCircle2, ChevronRight, Gift, Loader2, MapPin, Minus,
  Navigation, Phone, Plus, ShoppingBag, Star, Store, Trash2,
  UserRound, Utensils, X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_MENU_DATA } from './data/menuData';
import { fetchSheetData, SheetCategory, SheetDish, SHEET_ID, submitSheetData } from './services/googleSheets';

const RESTAURANTE_NAME = 'La Real Burger';
const RESTAURANTE_SLOGAN = 'Sabor real, momentos inolvidables';
const WHATSAPP_NUMBER = '51942055475';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=San+Francisco+Mz.5+Lt.10+Calle+Los+Alamos';
const LOGO_PATH = '/assets/la-real-logo.png';
const BANNER_PATH = '/assets/la-real-banner.png';
const BIRTHDAY_PROMO_PATH = '/assets/birthday-promo.png';
const MARQUEE_TEXT = '🔥 HAMBURGUESAS CON SABOR REAL • PEDIDOS RÁPIDOS POR WHATSAPP • RECOJO EN TIENDA O DELIVERY • ';
const LOCAL_IMAGES: Record<string, string> = {};

interface Dish { nombre: string; descripcion?: string; imagen?: string; precio: string; }
interface Category { id: string; nombre: string; items: Dish[]; }
interface CartItem { nombre: string; precio: string; cantidad: number; }
type OrderType = 'delivery' | 'pickup';
interface OrderData { nombre: string; telefono: string; direccion: string; referencia: string; nombreRecojo: string; }
interface UserLocation { latitude: number; longitude: number; accuracy: number; }

const isWaffleRelated = (value: string) => /waffle|gofre/i.test(value);
const sanitizeCategories = (items: Category[]) => items
  .filter(category => !isWaffleRelated(`${category.id} ${category.nombre}`))
  .map(category => ({
    ...category,
    items: category.items.filter(dish => !isWaffleRelated(`${dish.nombre} ${dish.descripcion || ''}`)),
  }))
  .filter(category => category.items.length > 0);

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
  const calculateTotal = () => cart.reduce((total, item) => {
    const priceMatch = item.precio.match(/\d+(?:[.,]\d+)?/);
    const numericPrice = Number.parseFloat((priceMatch?.[0] || '0').replace(',', '.')) || 0;
    return total + numericPrice * item.cantidad;
  }, 0);

  const addToCart = (dish: Dish) => setCart(current => {
    const exists = current.find(item => item.nombre === dish.nombre && item.precio === dish.precio);
    if (exists) return current.map(item => item.nombre === dish.nombre && item.precio === dish.precio ? { ...item, cantidad: item.cantidad + 1 } : item);
    return [...current, { nombre: dish.nombre, precio: dish.precio, cantidad: 1 }];
  });

  const updateQuantity = (nombre: string, precio: string, delta: number) => setCart(current => current
    .map(item => {
      if (item.nombre !== nombre || item.precio !== precio) return item;
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
    let message = `🍔 *NUEVO PEDIDO — ${RESTAURANTE_NAME.toUpperCase()}*\n\n*Detalle del pedido*\n`;
    cart.forEach(item => { message += `• ${item.cantidad} x ${item.nombre} — ${item.precio}\n`; });
    message += `\n💰 *TOTAL: S/. ${calculateTotal().toFixed(2)}*\n\n`;
    if (orderType === 'delivery') {
      message += `🛵 *Modalidad: Delivery*\n👤 Nombre: ${orderData.nombre.trim()}\n📱 Teléfono: ${orderData.telefono.trim()}\n🏠 Dirección: ${orderData.direccion.trim()}\n📍 Referencia: ${orderData.referencia.trim()}\n`;
      if (userLocation) {
        message += `🗺️ Ubicación actual: https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}\n🎯 Precisión aproximada: ${Math.round(userLocation.accuracy)} m\n`;
      } else message += '🗺️ Ubicación actual: No compartida\n';
    } else {
      message += `🏪 *Modalidad: Recojo en tienda*\n👤 Nombre del cliente: ${orderData.nombre.trim()}\n📱 Teléfono: ${orderData.telefono.trim()}\n🙋 Recoge el pedido: ${orderData.nombreRecojo.trim()}\n`;
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
            <div className="mb-4 pt-6"><div className="mb-1 flex items-center gap-2 text-[#ff9d16]"><span className="text-[9px] font-black uppercase tracking-[0.25em]">{String(categoryIndex + 1).padStart(2, '0')} · Nuestra carta</span><span className="h-px flex-1 bg-gradient-to-r from-[#ff9d16]/55 to-transparent" /></div><div className="flex items-center gap-2"><Utensils size={20} className="wave-icon text-[#ff9d16]" /><h3 className="category-underline font-category text-[27px] font-bold leading-none text-white">{category.nombre}</h3></div></div>
            <div className="space-y-3">{category.items.map((dish, index) => (
              <motion.article key={`${dish.nombre}-${dish.precio}`} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ delay: Math.min(index * 0.025, 0.15) }} className="menu-dish-row relative flex min-h-[126px] overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-gradient-to-br from-[#1b1915] to-[#11100e] shadow-[0_14px_30px_rgba(0,0,0,.22)]">
                <div className="flex min-w-0 flex-1 flex-col p-4 pr-2"><div className="flex items-start gap-2"><h4 className="font-dish text-[13px] font-black uppercase leading-[1.08] tracking-wide text-white">{dish.nombre}</h4><span className="mt-2.5 min-w-3 flex-1 border-t border-dotted border-[#ff9d16]/35" /></div>{dish.descripcion && <p className="mt-2 line-clamp-3 pr-1 text-[10px] leading-[1.35] text-white/52">{dish.descripcion}</p>}<div className="flex-1" /><div className="mt-3 flex items-center gap-2"><span className="rounded-lg bg-[#ff9d16] px-2.5 py-1 font-dish text-[12px] font-black text-[#1a0f05]">{dish.precio}</span><motion.button type="button" onClick={() => addToCart(dish)} whileTap={{ scale: 0.78 }} aria-label={`Agregar ${dish.nombre} al pedido`} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ff9d16]/40 bg-[#ff9d16]/10 text-[#ffab2e] transition hover:bg-[#ff9d16] hover:text-black"><Plus size={16} strokeWidth={3} /></motion.button></div></div>
                <button type="button" onClick={() => dish.imagen && setSelectedImage(dish.imagen)} className="dish-visual relative flex w-[33%] min-w-[108px] items-center justify-center overflow-hidden border-l border-[#ff9d16]/15" aria-label={dish.imagen ? `Ampliar imagen de ${dish.nombre}` : undefined}>
                  {dish.imagen ? <img src={dish.imagen} alt={dish.nombre} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-110" /> : <span className="relative flex flex-col items-center text-center"><span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#ff9d16]/25 bg-black/25 text-[#ff9d16]"><Utensils size={18} /></span><span className="text-[8px] font-black uppercase leading-snug tracking-[0.15em] text-[#ffc05c]/70">Preparado<br />al momento</span></span>}
                </button>
              </motion.article>
            ))}</div>
          </section>
        ))}

        <section className="experience-card mb-6 mt-8 rounded-[1.75rem] border border-[#ff9d16]/25 p-6 text-center"><Star size={24} className="mx-auto mb-2 fill-[#ff9d16] text-[#ff9d16]" /><h3 className="font-title text-2xl text-[#ffac29]">¿Cómo estuvo tu experiencia?</h3><p className="mx-auto mb-4 mt-1 max-w-[270px] text-[11px] leading-relaxed text-white/55">Tu opinión nos ayuda a servirte cada vez mejor y a seguir creando momentos con sabor real.</p><motion.button type="button" whileTap={{ scale: 0.96 }} onClick={() => setShowReviewForm(true)} className="brand-button w-full"><Star size={17} /> Calificar mi experiencia</motion.button></section>
        <footer className="flex flex-col items-center border-t border-[#ff9d16]/15 pb-8 pt-9 text-center"><img src={LOGO_PATH} alt="La Real Burger" className="mb-4 h-28 w-28 rounded-full border border-[#ff9d16]/35 object-cover shadow-[0_0_35px_rgba(255,157,22,.14)]" /><p className="font-title text-2xl text-[#ff9d16]">{RESTAURANTE_NAME}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">© 2026 · Sabor real en cada pedido</p><a href="https://tymasolutions.lat/" target="_blank" rel="noopener noreferrer" className="mt-5 text-[11px] font-bold text-white/35 transition hover:text-white/70">Hecho por <span className="text-[#31b9ff]">Tyma Solutions</span></a></footer>
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
            <div className="mb-5 max-h-[42vh] space-y-2.5 overflow-y-auto pr-1">{cart.map(item => <div key={`${item.nombre}-${item.precio}`} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.045] p-3"><div className="min-w-0 flex-1"><h4 className="truncate font-dish text-xs font-black uppercase text-white">{item.nombre}</h4><p className="mt-0.5 text-[11px] font-black text-[#ff9d16]">{item.precio}</p></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-2 py-1.5"><button type="button" onClick={() => updateQuantity(item.nombre, item.precio, -1)} className="text-white/55 hover:text-[#ff9d16]"><Minus size={15} /></button><span className="w-4 text-center text-xs font-black text-white">{item.cantidad}</span><button type="button" onClick={() => updateQuantity(item.nombre, item.precio, 1)} className="text-[#ff9d16]"><Plus size={15} /></button></div><button type="button" onClick={() => updateQuantity(item.nombre, item.precio, -item.cantidad)} className="p-1 text-red-400/60 hover:text-red-400" aria-label={`Eliminar ${item.nombre}`}><Trash2 size={17} /></button></div>)}</div>
            <div className="mb-5 flex items-center justify-between border-y border-dashed border-white/10 py-4"><span className="text-sm font-bold text-white/60">Total a pagar</span><span className="font-dish text-2xl font-black text-[#ff9d16]">S/. {calculateTotal().toFixed(2)}</span></div>
            <button type="button" onClick={() => { setShowSummary(false); setShowCheckout(true); }} className="brand-button w-full py-4">Elegir entrega y enviar <ChevronRight size={19} /></button>
          </motion.div>
        </div>
      )}</AnimatePresence>

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
              </> : <div><label className={fieldLabelClass} htmlFor="pickup-name">Nombre de quien recogerá</label><input id="pickup-name" required value={orderData.nombreRecojo} onChange={event => setOrderData({ ...orderData, nombreRecojo: event.target.value })} className={fieldClass} placeholder="Ej. María Pérez" /><a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[10px] font-bold text-white/65 transition hover:border-[#ff9d16]/40 hover:text-[#ffb33a]"><MapPin size={17} className="text-[#ff9d16]" /> Ver ubicación de la tienda</a></div>}
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
