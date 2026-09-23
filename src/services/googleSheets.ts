import Papa from 'papaparse';

// Hoja principal de la carta. Debe ser visible para cualquier persona con el enlace.
export const SHEET_ID = '1EBh44zwkiFI8L7xuRGbFpBgSNR-9Ww6wGPzv1-2azRs';

export interface SheetDish {
  categoría: string;
  'nombre del plato': string;
  descripción: string;
  precio: string;
  'URL de imagen': string;
}

export interface SheetCategory {
  nombre: string;
  'precio por delivery'?: string;
}

export const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Sheets respondió ${response.status}`);
    }
    const csvText = await response.text();
    if (/<!doctype html|<html/i.test(csvText)) {
      throw new Error('La hoja no está publicada o no permite acceso con el enlace');
    }
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(results.errors.map(error => error.message).join('; ')));
            return;
          }
          resolve(results.data as T[]);
        },
        error: (error: any) => reject(error),
      });
    });
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    return [];
  }
};

// Configura aquí la URL de tu Google Apps Script Web App para poder enviar datos
// Instrucciones: Crea un Apps Script, pega el código que te di, impleméntalo como Aplicación Web y pega la URL de ejecución aquí.
export const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby8_2w1BztvaGbCMW7mRhLHBm7_y32sYZXVGUkQBjVBXwAV2b4daPmK3DRIjsKD5JgD/exec';

export const submitSheetData = async (sheetName: string, data: any): Promise<boolean> => {
  if (!WEB_APP_URL) {
    console.warn('Falta configurar WEB_APP_URL. Simulando envío a:', sheetName, data);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  }

  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // Importante para evitar problemas de CORS con Apps Script
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        sheetName,
        data,
      }),
    });
    
    return true;
  } catch (error) {
    console.error(`Error submitting to sheet ${sheetName}:`, error);
    return false;
  }
};
