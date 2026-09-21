import fs from 'fs';
import path from 'path';
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

// 2. Construir la consulta de búsqueda más precisa
export function buildQuery(dish) {
  const nombre = dish.nombre.trim();
  const cat = dish.categoriaNombre.toLowerCase();

  // Diccionario de afinamiento gastronómico peruano
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
    frappe: 'frappe artesanal vaso',
    jugos: 'jugo natural peruano vaso',
    batidos: 'batido de frutas vaso',
    jarras: 'jarra bebida jugo refresco',
    mojitos: 'cocktail mojito vaso trago',
    cocteles: 'coctel peruano trago copa',
    'bebidas-heladas': 'bebida gaseosa botella lata',
    'bebidas-calientes': 'bebida caliente infusión taza',
    cervezas: 'cerveza botella peru',
  };

  const context = peruvianContext[dish.categoriaId] || 'comida peruana';

  // Si tiene descripción, tomar palabras clave
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

// 3. Buscar candidatos en DuckDuckGo Images
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
    return data.results || [];
  } catch (err) {
    return [];
  }
}

// 3.1 Motor de respaldo: Bing Images
export async function searchImagesBing(query) {
  try {
    const res = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'es-ES,es;q=0.9',
      },
    });
    const html = await res.text();
    const results = [];
    const matches = html.matchAll(/m="({[^"]+})"/g);
    for (const match of matches) {
      try {
        const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        const json = JSON.parse(decoded);
        if (json.murl) {
          results.push({
            title: json.t || json.desc || '',
            image: json.murl,
            url: json.purl || '',
            width: json.width || 800,
            height: json.height || 600,
          });
        }
      } catch {}
    }
    return results;
  } catch (err) {
    return [];
  }
}

// 3.2 Búsqueda unificada con conmutación por error
export async function fetchCandidates(query) {
  let candidates = await searchImagesDuckDuckGo(query);
  if (!candidates || candidates.length === 0) {
    candidates = await searchImagesBing(query);
  }
  return candidates;
}

// 4. Analizar y calificar de todas cuál es la mejor imagen
export function scoreCandidate(candidate, dish) {
  let score = 50; // base score
  const title = (candidate.title || '').toLowerCase();
  const url = (candidate.image || '').toLowerCase();
  const source = (candidate.url || '').toLowerCase();
  const dishName = dish.nombre.toLowerCase();

  // Filtros negativos estrictos (marcas de agua, vectores, stock genérico, logos)
  const negativeKeywords = [
    'shutterstock', 'gettyimages', 'istock', 'alamy', 'depositphotos', '123rf', 'dreamstime',
    'vector', 'dibujo', 'clipart', 'logo', 'watermark', 'freepik', 'pngwing', 'cartoon',
    'plantilla', 'template', 'icono', 'icon', 'isolated', 'white background', 'fondo blanco',
  ];
  for (const neg of negativeKeywords) {
    if (title.includes(neg) || url.includes(neg) || source.includes(neg)) {
      return -100; // Descartada inmediatamente
    }
  }

  // 1. Coincidencia con el nombre del plato
  const nameParts = dishName.split(' ').filter(p => p.length > 2);
  let matches = 0;
  for (const part of nameParts) {
    if (title.includes(part)) matches++;
  }
  score += (matches / Math.max(nameParts.length, 1)) * 30;

  // 2. Dominios confiables de gastronomía / delivery peruano
  const trustedDomains = [
    'rappi.pe', 'pedidosya.com.pe', 'tofuu.getjusto.com', 'comidaperuana', 'buenazo.pe',
    'peru.travel', 'rpp.pe', 'elcomercio.pe', 'tripadvisor', 'facebook', 'instagram',
  ];
  if (trustedDomains.some(d => url.includes(d) || source.includes(d))) {
    score += 15;
  }

  // 3. Resolución y dimensiones
  const w = candidate.width || 0;
  const h = candidate.height || 0;
  if (w >= 500 && h >= 450) score += 10;
  if (w >= 700 && h >= 600) score += 10;
  if (w > 3000 || h > 3000) score -= 10; // Evitar imágenes excesivamente pesadas sin redimensionar

  // 4. Relación de aspecto (proporción óptima: cercana a cuadrada 1:1 o 4:3 para encajar en la tarjeta)
  if (w > 0 && h > 0) {
    const ratio = w / h;
    if (ratio >= 0.85 && ratio <= 1.4) {
      score += 15; // Proporción ideal para presentación de platos
    } else if (ratio < 0.6 || ratio > 2.0) {
      score -= 20; // Demasiado vertical u horizontal
    }
  }

  // 5. Formatos preferidos
  if (url.endsWith('.webp')) score += 5;
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) score += 3;

  return score;
}

// 5. Descargar la imagen ganadora
export async function downloadImage(url, destPath) {
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
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 5000) throw new Error('Archivo demasiado pequeño o corrupto');

    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (err) {
    clearTimeout(timeout);
    console.error(`Error descargando ${url}:`, err.message);
    return false;
  }
}

// 6. Generar nombre de archivo seguro
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// 7. Actualizar el diccionario LOCAL_IMAGES en App.tsx
export function updateAppLocalImages(imageMap) {
  const appCode = fs.readFileSync(APP_PATH, 'utf-8');
  const mapEntries = Object.entries(imageMap)
    .map(([plato, path]) => `  '${plato.replace(/'/g, "\\'")}': '${path}',`)
    .join('\n');

  const newLocalImagesBlock = `const LOCAL_IMAGES: Record<string, string> = {\n${mapEntries}\n};`;
  const updatedCode = appCode.replace(
    /const LOCAL_IMAGES: Record<string, string> = \{[\s\S]*?\};/,
    newLocalImagesBlock
  );

  fs.writeFileSync(APP_PATH, updatedCode, 'utf-8');
  console.log(`✅ LOCAL_IMAGES actualizado en App.tsx con ${Object.keys(imageMap).length} imágenes.`);
}

// 8. Generar galería HTML interactiva de previsualización
export function generateHtmlGallery(processedDishes) {
  const html = `<!DOCTYPE html>
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
  <h1>🍔 Galería de Imágenes Curadas con IA - La Real Burger</h1>
  <p class="sub">Total de imágenes analizadas y asignadas: ${processedDishes.length}</p>
  <div class="grid">
    ${processedDishes.map(d => `
      <div class="card">
        <img src="${d.imageRelPath}" alt="${d.nombre}" loading="lazy" />
        <div class="content">
          <span class="cat">${d.categoriaNombre}</span>
          <span class="title">${d.nombre}</span>
          <span class="price">${d.precio}</span>
          <span class="score">Puntuación IA: ${d.score}/100</span>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  const galleryPath = path.join(ROOT_DIR, 'public', 'galeria_imagenes.html');
  fs.writeFileSync(galleryPath, html, 'utf-8');
  console.log(`🖼️ Galería HTML generada en: file:///${galleryPath.replace(/\\/g, '/')}`);
}

// 9. Ejecutor principal con CLI
export async function run(options = {}) {
  const { categoryFilter, limit = 999, delayMs = 600 } = options;
  console.log('🚀 Iniciando escaneo y análisis de imágenes para La Real Burger...\n');

  const categories = parseDishesFromMenu();
  const allDishes = [];
  for (const cat of categories) {
    if (!categoryFilter || cat.id === categoryFilter || cat.nombre.toLowerCase().includes(categoryFilter.toLowerCase())) {
      allDishes.push(...cat.items);
    }
  }

  const targetDishes = allDishes.slice(0, limit);
  console.log(`📋 Total de platos a procesar: ${targetDishes.length}`);

  // Cargar mapeo existente
  const currentAppCode = fs.readFileSync(APP_PATH, 'utf-8');
  const existingMapMatch = currentAppCode.match(/const LOCAL_IMAGES: Record<string, string> = \{([\s\S]*?)\};/);
  const imagesMap = {};
  if (existingMapMatch && existingMapMatch[1]) {
    const lines = existingMapMatch[1].split('\n');
    for (const line of lines) {
      const match = line.match(/'([^']+)':\s*'([^']+)'/);
      if (match) imagesMap[match[1]] = match[2];
    }
  }

  const processedList = [];

  for (let i = 0; i < targetDishes.length; i++) {
    const dish = targetDishes[i];
    const slug = slugify(dish.nombre);
    const destFileName = `${slug}.webp`;
    const destPath = path.join(OUTPUT_DIR, destFileName);
    const relPath = `/assets/platos/${destFileName}`;

    console.log(`\n[${i + 1}/${targetDishes.length}] Analizando: "${dish.nombre}" (${dish.categoriaNombre})...`);

    // Si ya existe la imagen descargada y está en el mapa, conservar salvo que se fuerce
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000 && imagesMap[dish.nombre]) {
      console.log(`  ↪ Imagen local ya existente: ${relPath}`);
      processedList.push({ ...dish, imageRelPath: relPath, score: 95 });
      continue;
    }

    const query = buildQuery(dish);
    console.log(`  🔍 Consulta optimizada: "${query}"`);

    const candidates = await fetchCandidates(query);
    if (!candidates || candidates.length === 0) {
      console.warn(`  ⚠️ No se encontraron candidatos para "${dish.nombre}".`);
      continue;
    }

    // Calificar a cada candidato
    const scoredCandidates = candidates
      .map(c => ({ candidate: c, score: scoreCandidate(c, dish) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    console.log(`  📊 Candidatos válidos calificados: ${scoredCandidates.length} de ${candidates.length}`);

    if (scoredCandidates.length === 0) {
      console.warn(`  ⚠️ Ningún candidato superó los filtros de calidad para "${dish.nombre}".`);
      continue;
    }

    // Probar descargar las 3 mejores opciones hasta que una tenga éxito
    let downloaded = false;
    for (let cIdx = 0; cIdx < Math.min(3, scoredCandidates.length); cIdx++) {
      const best = scoredCandidates[cIdx];
      console.log(`  ⭐ Opción #${cIdx + 1} (Score: ${best.score}): "${best.candidate.title}"`);
      console.log(`     URL: ${best.candidate.image}`);

      downloaded = await downloadImage(best.candidate.image, destPath);
      if (downloaded) {
        imagesMap[dish.nombre] = relPath;
        processedList.push({ ...dish, imageRelPath: relPath, score: best.score });
        console.log(`  ✅ Imagen descargada y guardada con éxito en ${relPath}`);
        break;
      }
    }

    if (!downloaded) {
      console.warn(`  ❌ No se pudo descargar ninguna de las mejores opciones para "${dish.nombre}".`);
    }

    // Pausa de cortesía para no saturar
    await new Promise(res => setTimeout(res, delayMs));
  }

  // Guardar en App.tsx y generar galería
  updateAppLocalImages(imagesMap);
  generateHtmlGallery(processedList);

  console.log('\n🎉 Proceso completado con éxito.');
}

// Ejecución directa si se invoca por CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let categoryFilter = null;
  let limit = 999;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--category' && args[i + 1]) categoryFilter = args[i + 1];
    if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[i + 1], 10);
  }

  run({ categoryFilter, limit });
}
