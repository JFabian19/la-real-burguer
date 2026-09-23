const SPREADSHEET_ID = '1EBh44zwkiFI8L7xuRGbFpBgSNR-9Ww6wGPzv1-2azRs';
const TIME_ZONE = 'America/Lima';

const SHEET_CONFIG = {
  'Fidelización': {
    headers: [
      'Fecha de registro',
      'Nombre completo',
      'Teléfono',
      'Fecha de nacimiento',
      'Distrito',
      'Correo electrónico',
    ],
    required: ['nombre', 'telefono', 'fechaNacimiento', 'distrito'],
    toRow: data => [
      Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss'),
      safeCell(data.nombre),
      safeCell(data.telefono),
      safeCell(data.fechaNacimiento),
      safeCell(data.distrito),
      safeCell(data.correo || 'No indicado'),
    ],
  },
  'Reseñas': {
    headers: [
      'Fecha de registro',
      'Calificación del mozo',
      'Calificación de la comida',
      'Comentario',
    ],
    required: ['estrellasMozo', 'estrellasComida'],
    toRow: data => [
      Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss'),
      Number(data.estrellasMozo),
      Number(data.estrellasComida),
      safeCell(data.comentario || 'Sin comentarios'),
    ],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Solicitud vacía.' });
    }

    const request = JSON.parse(e.postData.contents);
    const sheetName = String(request.sheetName || '').trim();
    const data = request.data || {};
    const config = SHEET_CONFIG[sheetName];

    if (!config) {
      return jsonResponse({ ok: false, error: 'Hoja no permitida.' });
    }

    const missingFields = config.required.filter(field => {
      const value = data[field];
      return value === undefined || value === null || String(value).trim() === '' || Number(value) === 0;
    });

    if (missingFields.length > 0) {
      return jsonResponse({ ok: false, error: `Faltan campos: ${missingFields.join(', ')}` });
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet(spreadsheet, sheetName, config.headers);
    sheet.appendRow(config.toRow(data));
    SpreadsheetApp.flush();

    return jsonResponse({ ok: true, sheet: sheetName });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {
      // El bloqueo no llegó a adquirirse; no hay nada que liberar.
    }
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: 'La Real Burger', message: 'Apps Script activo.' });
}

function getOrCreateSheet(spreadsheet, sheetName, headers) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#ff9d16')
      .setFontColor('#1a0f05');
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function safeCell(value) {
  const text = String(value === undefined || value === null ? '' : value).trim();
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
