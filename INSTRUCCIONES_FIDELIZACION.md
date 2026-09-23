# Fidelización y Apps Script

## Pestaña de Google Sheets

Crea una pestaña llamada exactamente `Fidelización` en la hoja:

`https://docs.google.com/spreadsheets/d/1EBh44zwkiFI8L7xuRGbFpBgSNR-9Ww6wGPzv1-2azRs/edit`

Importa `fidelizacion_template.csv` desde la celda A1. Debe tener estas columnas:

1. Fecha de registro
2. Nombre completo
3. Teléfono
4. Fecha de nacimiento
5. Distrito
6. Correo electrónico

El Apps Script también puede crear automáticamente esta pestaña y sus encabezados si todavía no existen.

## Instalar el Apps Script

1. Abre el Google Sheet.
2. Entra a **Extensiones → Apps Script**.
3. Borra el contenido de `Código.gs`.
4. Copia y pega todo el contenido de `apps-script-fidelizacion.gs`.
5. Guarda el proyecto.
6. Pulsa **Implementar → Nueva implementación**.
7. En tipo, selecciona **Aplicación web**.
8. En **Ejecutar como**, elige **Yo**.
9. En **Quién tiene acceso**, elige **Cualquier persona**.
10. Pulsa **Implementar**, concede los permisos y copia la URL que termina en `/exec`.

## Conectar la página

Abre `src/services/googleSheets.ts` y pega la URL de la implementación aquí:

```ts
export const WEB_APP_URL = 'https://script.google.com/macros/s/TU_IMPLEMENTACION/exec';
```

Usa siempre la URL `/exec`, no la URL de prueba `/dev`.

Después de cambiar la URL, vuelve a compilar o publicar la página. Cada envío del formulario **Registrar mi cumpleaños** se agregará como una nueva fila en `Fidelización`.

Si modificas el Apps Script más adelante, crea una nueva versión desde **Administrar implementaciones → Editar → Nueva versión** para que los cambios lleguen a la URL pública.
