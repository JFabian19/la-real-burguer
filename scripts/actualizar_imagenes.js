import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MENU_PATH = path.join(ROOT_DIR, 'src', 'data', 'menuData.ts');
const APP_PATH = path.join(ROOT_DIR, 'src', 'App.tsx');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'assets', 'platos');

// Asegurar carpeta de salida
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Validación estricta de archivo de imagen real (no HTML, no corrupto, con magic bytes)
export function isValidImageFile(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const stat = fs.statSync(filePath);
  if (stat.size < 5000) return false;
  const buf = fs.readFileSync(filePath);
  const head = buf.slice(0, 100).toString('utf-8').toLowerCase();
  if (head.includes('<!doctype') || head.includes('<html') || head.includes('<?xml') || head.startsWith('{') || head.startsWith('[')) {
    return false;
  }

  const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
  const isWebp = buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP';
  const isGif = buf.slice(0, 3).toString('ascii') === 'GIF';
  const isAvif = buf.slice(4, 12).toString('ascii').includes('ftyp');

  return isJpeg || isPng || isWebp || isGif || isAvif;
}

export function getImageHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buf).digest('hex');
}

// 1. Extraer los platos desde menuData.ts
export function parseDishesFromMenu() {
  const content = fs.readFileSync(MENU_PATH, 'utf-8');
  const categoryRegex = /category\(\s*'([^']+)',\s*'([^']+)',\s*\[([\s\S]*?)\]\s*\)/g;
  const categories = [];

  let catMatch;
  while ((catMatch = categoryRegex.exec(content)) !== null) {
    const [, catId, catNombre, itemsBlock] = catMatch;
    const itemRegex = /\[\s*'([^']+)',\s*'([^']+)'(?:,\s*'([^']*)')?\s*\]/g;
    const items = [];

    let itemMatch;
    while ((itemMatch = itemRegex.exec(itemsBlock)) !== null) {
      items.push({
        nombre: itemMatch[1],
        precio: itemMatch[2],
        descripcion: itemMatch[3] || '',
        categoriaId: catId,
        categoriaNombre: catNombre,
      });
    }

    categories.push({ id: catId, nombre: catNombre, items });
  }

  return categories;
}

// 2. Consultas hiper-específicas para evitar fotos idénticas y asegurar autenticidad
const DISH_QUERY_OVERRIDES = {
  // Arroz chaufa diferenciado por proteína
  'Arroz chaufa de pollo': 'arroz chaufa de pollo peruano',
  'Arroz chaufa de carne': 'chaufa de carne res peruano',
  'Arroz chaufa de cerdo': 'chaufa de chancho cerdo peruano',
  'Arroz chaufa 3 sabores': 'arroz chaufa especial tres sabores',

  // Alitas diferenciadas por estilo y presentación
  'Alitas clásicas': 'alitas clasicas fritas doradas',
  'Alitas broaster': 'alitas broaster crocantes con papas',
  'Alitas Hot Wings': 'alitas hot wings picantes salsa',
  'Duo alitas': 'duo alitas combo papas',
  'Trío de alitas': 'trio alitas fuente',
  'Alitas familiar': 'alitas familiar banquete',
  'Alitas Teriyaki': 'alitas teriyaki sesamo glaseadas',
  'Alitas BBQ': 'alitas bbq salsa barbacoa',

  // Batidos y Frappés solicitados
  'Batido de maracumango': 'batido de maracuya y mango smoothie vaso',
  'Frappe fresa blueberry': 'frappe fresa blueberry arandanos vaso chantilly',
  'Frappe lúcuma': 'frappe de lucuma peruano vaso chantilly',

  // Salchipapas diferenciadas
  'Salchi Burger': 'salchiburger hamburguesa salchipapa',

  // Mojitos
  'Mojito de maracuyá': 'mojito de maracuya cocktail vaso',

  // Jarras diferenciadas (1/2 Lt vs 1 Lt)
  'Jarra de chicha morada (½ Lt)': 'jarra chicha morada vaso maiz morado',
  'Jarra de chicha morada (1 Lt)': 'jarra grande chicha morada refresco',
  'Jarra de limonada (½ Lt)': 'jarra limonada fresca vaso',
  'Jarra de limonada (1 Lt)': 'jarra grande limonada helada',
  'Jarra de maracuyá (½ Lt)': 'jarra maracuya jugo vaso',
  'Jarra de maracuyá (1 Lt)': 'jarra grande maracuya jugo natural',
  'Jarra de naranjada (½ Lt)': 'jarra naranjada jugo naranja vaso',
  'Jarra de naranjada (1 Lt)': 'jarra grande naranjada 1 litro',
  'Jarra de fresa (½ Lt)': 'jarra jugo de fresa vaso',
  'Jarra de fresa (1 Lt)': 'jarra grande fresa jugo natural',
  'Jarra de mango (½ Lt)': 'jarra jugo de mango vaso',
  'Jarra de mango (1 Lt)': 'jarra grande mango jugo natural',
  'Jarra de papaya (½ Lt)': 'jarra jugo de papaya vaso',
  'Jarra de papaya (1 Lt)': 'jarra grande papaya 1 litro',
  'Jarra de piña (½ Lt)': 'jarra jugo de pina vaso',
  'Jarra de piña (1 Lt)': 'jarra grande pina refresco 1 litro',
  'Jarra de maracumango (½ Lt)': 'jarra jugo maracumango vaso',
  'Jarra de maracumango (1 Lt)': 'jarra grande maracumango refresco 1 litro',

  // Chorizos y Filetes
  'Chorizo americano': 'chorizo americano sandwich jamon queso',
  'Chorizo clásico': 'choripan clasico chimichurri',
  'Chorizo Royal': 'chorizo royal sandwich huevo queso',
  'Filete clásico': 'sandwich filete de pollo clasico',
  'Filete con todo': 'sandwich filete de pollo royal huevo queso',

  // Guarniciones
  'Porción de arroz blanco': 'porcion arroz blanco cocido plato',
  'Porción de arroz chaufa': 'porcion arroz chaufa casero plato',
  'Porción de papas personal': 'porcion papas fritas crocantes restaurante',
  '1/2 porción de papas': 'fuente papas fritas doradas porcion',
  '1 porción de papas familiar': 'fuente familiar grande papas fritas banquete',
};

// 3. Construir la consulta de búsqueda más precisa
export function buildQuery(dish) {
  if (DISH_QUERY_OVERRIDES[dish.nombre]) {
    return DISH_QUERY_OVERRIDES[dish.nombre];
  }

  const nombre = dish.nombre.trim();
  const peruvianContext = {
    hamburguesas: 'hamburguesa peruana sangucheria artesanal',
    filetes: 'sandwich filete pollo peruano sangucheria',
    'chorizos-hotdog': 'sandwich chorizo artesanal peruano',
    salchipapas: 'salchipapa peruana cremas',
    broaster: 'pollo broaster peruano con papas',
    alitas: 'alitas broaster bbq peru',
    especiales: 'comida criolla peruana plato',
    tequenos: 'tequeños peruanos con guacamole',
    refrescantes: 'iced tea bebida refrescante vaso',
    frappe: 'frappe artesanal vaso chantilly',
    jugos: 'jugo natural peruano vaso',
    batidos: 'batido de frutas vaso',
    jarras: 'jarra bebida jugo refresco',
    mojitos: 'cocktail mojito vaso trago menta',
    cocteles: 'coctel peruano trago copa',
    'bebidas-heladas': 'bebida gaseosa botella lata',
    'bebidas-calientes': 'bebida caliente infusión taza',
    cervezas: 'cerveza botella peru',
  };

  const context = peruvianContext[dish.categoriaId] || 'comida peruana';

  let descKeywords = '';
  if (dish.descripcion) {
    descKeywords = dish.descripcion
      .replace(/[.,]/g, '')
      .split(' ')
      .filter(w => w.length > 4 && !['con', 'para', 'salsa', 'del', 'los', 'las', 'una', 'este'].includes(w.toLowerCase()))
      .slice(0, 2)
      .join(' ');
  }

  return `${nombre} ${descKeywords} ${context}`.replace(/\s+/g, ' ').trim();
}

// 4. Búsqueda en DuckDuckGo Images
export async function searchImagesDuckDuckGo(query) {
  try {
    const initRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    });
    const html = await initRes.text();
    const vqdMatch = html.match(/vqd=([0-9-]+)/) || html.match(/vqd=['"]([0-9-]+)['"]/);
    if (!vqdMatch) return [];

    const vqd = vqdMatch[1];
    const res = await fetch(`https://duckduckgo.com/i.js?l=es-es&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://duckduckgo.com/',
      },
    });
    const text = await res.text();
    if (!text.startsWith('{')) return [];
    const data = JSON.parse(text);
    return (data.results || []).map(r => ({
      title: r.title,
      image: r.image,
      thumbnail: r.thumbnail,
      url: r.url,
      width: r.width,
      height: r.height,
    }));
  } catch {
    return [];
  }
}

// 5. Búsqueda alternativa en Bing Images
export async function searchImagesBing(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    });
    const html = await res.text();
    const results = [];
    const regex = /m=(["'])({[\s\S]*?})\1/g;
    let match;
    while ((match = regex.exec(html)) !== null && results.length < 35) {
      try {
        const jsonStr = match[2].replace(/&quot;/g, '"');
        const data = JSON.parse(jsonStr);
        if (data.murl) {
          results.push({
            title: data.t || data.desc || query,
            image: data.murl,
            thumbnail: data.turl || data.murl,
            url: data.purl || '',
            width: data.mw || 800,
            height: data.mh || 600,
          });
        }
      } catch {}
    }

    if (results.length === 0) {
      const murlRegex = /&quot;murl&quot;:&quot;([^&]+)&quot;/g;
      let murlMatch;
      while ((murlMatch = murlRegex.exec(html)) !== null && results.length < 35) {
        results.push({
          title: query,
          image: murlMatch[1],
          thumbnail: murlMatch[1],
          url: '',
          width: 800,
          height: 600,
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

export async function fetchCandidates(query) {
  let candidates = await searchImagesDuckDuckGo(query);
  if (!candidates || candidates.length === 0) {
    candidates = await searchImagesBing(query);
  }
  return candidates;
}

// 6. Analizar y calificar de todas cuál es la mejor imagen
export function scoreCandidate(candidate, dish, usedUrls = new Set()) {
  let score = 50;
  const title = (candidate.title || '').toLowerCase();
  const url = (candidate.image || '').toLowerCase();
  const source = (candidate.url || '').toLowerCase();
  const dishName = dish.nombre.toLowerCase();

  // EXCLUSIÓN ESTRICTA DE PÁGINAS DE RETO / CRAWLERS DE REDES SOCIALES (no son imágenes binarias)
  const forbiddenDomains = [
    'lookaside.instagram', 'lookaside.fbsbx', 'facebook.com', 'instagram.com',
    'threads.net', 'fbcdn.net', 'cdninstagram', 'tiktok.com', 'twitter.com', 'x.com'
  ];
  if (forbiddenDomains.some(d => url.includes(d) || source.includes(d))) {
    return -1000;
  }

  // Filtros negativos (marcas de agua, vectores, cliparts, fondos blancos de banco)
  const negativeKeywords = [
    'shutterstock', 'gettyimages', 'istock', 'alamy', 'depositphotos', '123rf', 'dreamstime',
    'vector', 'dibujo', 'clipart', 'logo', 'watermark', 'freepik', 'pngwing', 'cartoon',
    'plantilla', 'template', 'icono', 'icon', 'isolated', 'white background', 'fondo blanco',
  ];
  for (const neg of negativeKeywords) {
    if (title.includes(neg) || url.includes(neg) || source.includes(neg)) {
      return -1000;
    }
  }

  // Si esta URL ya fue usada por otro plato, penalizar para garantizar fotos únicas
  if (usedUrls.has(candidate.image)) {
    score -= 200;
  }

  // Coincidencia de palabras clave con el nombre del plato
  const nameParts = dishName.split(' ').filter(p => p.length > 2);
  let matches = 0;
  for (const part of nameParts) {
    if (title.includes(part)) matches++;
  }
  score += (matches / Math.max(nameParts.length, 1)) * 30;

  // Dominios gastronómicos peruanos confiables
  const trustedDomains = [
    'rappi.pe', 'pedidosya.com.pe', 'tofuu.getjusto.com', 'buenazo.pe',
    'peru.travel', 'rpp.pe', 'elcomercio.pe', 'recetasgratis.net'
  ];
  if (trustedDomains.some(d => url.includes(d) || source.includes(d))) {
    score += 20;
  }

  // Resolución óptima
  const w = candidate.width || 0;
  const h = candidate.height || 0;
  if (w >= 500 && h >= 450) score += 10;
  if (w >= 700 && h >= 600) score += 10;
  if (w > 3000 || h > 3000) score -= 10;

  // Relación de aspecto
  if (w > 0 && h > 0) {
    const ratio = w / h;
    if (ratio >= 0.85 && ratio <= 1.4) {
      score += 15;
    } else if (ratio < 0.6 || ratio > 2.0) {
      score -= 20;
    }
  }

  if (url.endsWith('.webp')) score += 5;
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) score += 3;

  return score;
}

// 7. Descargar y validar que sea una imagen binaria real y única
export async function downloadImage(url, destPath, usedHashes = new Set()) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('text/html') || contentType.includes('application/json')) {
      throw new Error(`Tipo de contenido inválido: ${contentType}`);
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 5000) throw new Error('Archivo demasiado pequeño');

    const nodeBuffer = Buffer.from(buffer);
    const head = nodeBuffer.slice(0, 100).toString('utf-8').toLowerCase();
    if (head.includes('<!doctype') || head.includes('<html') || head.includes('<?xml')) {
      throw new Error('La respuesta fue una página HTML de crawler/bloqueo');
    }

    // Validar magic bytes de imágenes reales
    const isJpeg = nodeBuffer[0] === 0xFF && nodeBuffer[1] === 0xD8;
    const isPng = nodeBuffer[0] === 0x89 && nodeBuffer[1] === 0x50 && nodeBuffer[2] === 0x4E && nodeBuffer[3] === 0x47;
    const isWebp = nodeBuffer.slice(0, 4).toString('ascii') === 'RIFF' && nodeBuffer.slice(8, 12).toString('ascii') === 'WEBP';
    const isGif = nodeBuffer.slice(0, 3).toString('ascii') === 'GIF';
    const isAvif = nodeBuffer.slice(4, 12).toString('ascii').includes('ftyp');

    if (!isJpeg && !isPng && !isWebp && !isGif && !isAvif) {
      throw new Error('Formato binario no reconocido como imagen válida');
    }

    // Validar unicidad por hash MD5
    const hash = crypto.createHash('md5').update(nodeBuffer).digest('hex');
    if (usedHashes.has(hash)) {
      throw new Error('Imagen idéntica a otra ya descargada (duplicada)');
    }

    fs.writeFileSync(destPath, nodeBuffer);
    return { success: true, hash };
  } catch (err) {
    clearTimeout(timeout);
    console.error(`  ⚠️ Descartando ${url.slice(0, 65)}...: ${err.message}`);
    return { success: false };
  }
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function updateAppLocalImages(imageMap) {
  const appCode = fs.readFileSync(APP_PATH, 'utf-8');
  const mapEntries = Object.entries(imageMap)
    .map(([plato, path]) => `  '${plato.replace(/'/g, "\\'")}': '${path}',`)
    .join('\n');

  const regex = /const LOCAL_IMAGES: Record<string, string> = \{[\s\S]*?\};/;
  const updatedCode = appCode.replace(regex, `const LOCAL_IMAGES: Record<string, string> = {\n${mapEntries}\n};`);
  fs.writeFileSync(APP_PATH, updatedCode, 'utf-8');
  console.log(`✅ LOCAL_IMAGES actualizado en App.tsx con ${Object.keys(imageMap).length} imágenes.`);
}

export function generateHtmlGallery(dishesWithImages) {
  const galleryPath = path.join(ROOT_DIR, 'public', 'galeria_imagenes.html');
  const cardsHtml = dishesWithImages.map(d => `
      <div class="card">
        <img src="${d.imageRelPath}" alt="${d.nombre}" loading="lazy" />
        <div class="content">
          <span class="cat">${d.categoriaNombre}</span>
          <span class="title">${d.nombre}</span>
          <span class="price">${d.precio}</span>
          <span class="score">Puntuación: ${d.score}/100</span>
        </div>
      </div>
    `).join('\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Galería de Platos - La Real Burger</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0c0b09; color: #fff; margin: 0; padding: 24px; }
    h1 { color: #ff9d16; text-align: center; }
    p.sub { text-align: center; color: #aaa; margin-bottom: 30px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; max-width: 1200px; margin: 0 auto; }
    .card { background: #181512; border: 1px solid rgba(255,157,22,0.2); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
    .card img { width: 100%; height: 180px; object-fit: cover; background: #222; }
    .content { padding: 12px; flex: 1; display: flex; flex-direction: column; }
    .cat { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #ff9d16; letter-spacing: .1em; }
    .title { font-size: 15px; font-weight: 800; margin: 4px 0; }
    .price { font-size: 13px; font-weight: bold; color: #ffb13a; }
    .score { font-size: 10px; color: #34d399; margin-top: auto; padding-top: 8px; font-weight: 700; }
  </style>
</head>
<body>
  <h1>🍔 Galería de Imágenes Curadas - La Real Burger</h1>
  <p class="sub">Total de imágenes analizadas y asignadas: ${dishesWithImages.length}</p>
  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>`;

  fs.writeFileSync(galleryPath, fullHtml, 'utf-8');
  console.log(`🖼️ Galería HTML generada en: file:///${galleryPath.replace(/\\/g, '/')}`);
}

// 8. Flujo de ejecución principal
export async function run({ categoryFilter = null, dishNamesFilter = null, delayMs = 1200 } = {}) {
  console.log('🚀 Iniciando escaneo, validación y desduplicación de imágenes para La Real Burger...\n');

  const categories = parseDishesFromMenu();
  let targetDishes = categories.flatMap(c => c.items);

  if (categoryFilter) {
    targetDishes = targetDishes.filter(d => d.categoriaId === categoryFilter);
  }

  if (dishNamesFilter && dishNamesFilter.length > 0) {
    const lowerFilter = dishNamesFilter.map(n => n.toLowerCase());
    targetDishes = targetDishes.filter(d => lowerFilter.includes(d.nombre.toLowerCase()));
  }

  console.log(`📋 Total de platos a evaluar: ${targetDishes.length}`);

  const appContent = fs.readFileSync(APP_PATH, 'utf-8');
  const existingMapMatch = appContent.match(/const LOCAL_IMAGES: Record<string, string> = \{([\s\S]*?)\};/);
  const imagesMap = {};
  if (existingMapMatch && existingMapMatch[1]) {
    const lines = existingMapMatch[1].split('\n');
    for (const line of lines) {
      const match = line.match(/'([^']+)':\s*'([^']+)'/);
      if (match) imagesMap[match[1]] = match[2];
    }
  }

  // Registrar hashes ya existentes para detectar y prevenir duplicados
  const usedHashes = new Set();
  const usedUrls = new Set();
  const processedList = [];

  // Para los platos que NO están en targetDishes, registrar sus hashes existentes para no repetirlos
  const allDishes = categories.flatMap(c => c.items);
  for (const d of allDishes) {
    if (dishNamesFilter && dishNamesFilter.some(n => n.toLowerCase() === d.nombre.toLowerCase())) {
      continue; // Este plato será recalculado
    }
    const slug = slugify(d.nombre);
    const destPath = path.join(OUTPUT_DIR, `${slug}.webp`);
    if (isValidImageFile(destPath)) {
      const h = getImageHash(destPath);
      if (h) usedHashes.add(h);
    }
  }

  for (let i = 0; i < targetDishes.length; i++) {
    const dish = targetDishes[i];
    const slug = slugify(dish.nombre);
    const destFileName = `${slug}.webp`;
    const destPath = path.join(OUTPUT_DIR, destFileName);
    const relPath = `/assets/platos/${destFileName}`;

    console.log(`\n[${i + 1}/${targetDishes.length}] Analizando: "${dish.nombre}" (${dish.categoriaNombre})...`);

    // Validar si el archivo actual es válido Y NO es un duplicado de otro plato
    const fileIsValid = isValidImageFile(destPath);
    const fileHash = fileIsValid ? getImageHash(destPath) : null;
    const isDuplicate = fileHash && usedHashes.has(fileHash);

    const forceRedownload = dishNamesFilter && dishNamesFilter.some(n => n.toLowerCase() === dish.nombre.toLowerCase());

    if (fileIsValid && !isDuplicate && !forceRedownload && imagesMap[dish.nombre]) {
      console.log(`  ↪ Imagen local válida y única: ${relPath}`);
      usedHashes.add(fileHash);
      processedList.push({ ...dish, imageRelPath: relPath, score: 95 });
      continue;
    }

    if (!fileIsValid) {
      console.log(`  ⚠️ Archivo local corrupto, HTML o inexistente. Buscando imagen real...`);
    } else if (isDuplicate) {
      console.log(`  ⚠️ Imagen local duplicada de otro plato. Buscando imagen distinta y única...`);
    } else if (forceRedownload) {
      console.log(`  🔄 Reemplazo forzado solicitado por el usuario...`);
    }

    const query = buildQuery(dish);
    console.log(`  🔍 Consulta optimizada: "${query}"`);

    const candidates = await fetchCandidates(query);
    if (!candidates || candidates.length === 0) {
      console.warn(`  ⚠️ No se encontraron candidatos para "${dish.nombre}".`);
      continue;
    }

    const scoredCandidates = candidates
      .map(c => ({ candidate: c, score: scoreCandidate(c, dish, usedUrls) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log(`  📊 Candidatos válidos calificados: ${scoredCandidates.length} de ${candidates.length}`);

    let downloaded = false;
    for (let cIdx = 0; cIdx < Math.min(6, scoredCandidates.length); cIdx++) {
      const best = scoredCandidates[cIdx];
      console.log(`  ⭐ Opción #${cIdx + 1} (Score: ${best.score}): "${best.candidate.title}"`);

      const result = await downloadImage(best.candidate.image, destPath, usedHashes);
      if (result.success) {
        imagesMap[dish.nombre] = relPath;
        usedHashes.add(result.hash);
        usedUrls.add(best.candidate.image);
        processedList.push({ ...dish, imageRelPath: relPath, score: best.score });
        console.log(`  ✅ Imagen descargada con éxito en ${relPath}`);
        downloaded = true;
        break;
      }
    }

    if (!downloaded) {
      console.warn(`  ❌ No se pudo descargar ninguna opción válida para "${dish.nombre}".`);
    }

    await new Promise(res => setTimeout(res, delayMs));
  }

  // Actualizar mapa y regenerar galería
  updateAppLocalImages(imagesMap);

  // Agregar al reporte todos los platos de la carta
  const fullProcessed = allDishes.map(d => {
    const slug = slugify(d.nombre);
    return {
      ...d,
      imageRelPath: `/assets/platos/${slug}.webp`,
      score: 95,
    };
  });
  generateHtmlGallery(fullProcessed);

  console.log('\n🎉 Proceso completado con éxito.');
}

// Ejecución directa CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let categoryFilter = null;
  let dishNamesFilter = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--category' && args[i + 1]) categoryFilter = args[i + 1];
    if (args[i] === '--dishes' && args[i + 1]) dishNamesFilter = args[i + 1].split(';');
  }

  run({ categoryFilter, dishNamesFilter });
}
