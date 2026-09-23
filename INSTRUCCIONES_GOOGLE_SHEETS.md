# Carta en Google Sheets

La aplicación está conectada a la hoja con ID `1EBh44zwkiFI8L7xuRGbFpBgSNR-9Ww6wGPzv1-2azRs`.

## Importación

1. Crea o renombra dos pestañas exactamente como `Categorías` y `Platos`.
2. Importa `categorias_template.csv` en `Categorías`, empezando en la celda A1.
3. Importa `platos_template.csv` en `Platos`, empezando en la celda A1.
4. Deja la hoja visible para **cualquier persona con el enlace** como lector.

No cambies los encabezados. No se usan IDs ni una columna de orden: el orden de las filas de `Categorías` es el orden que tendrá la carta.

## Precio por delivery

La pestaña `Categorías` tiene solamente estas columnas:

- `nombre`
- `precio por delivery`

En `precio por delivery` escribe solo el número, sin `S/.` ni texto. Por ejemplo:

- `1`
- `1.5`
- `2`

La página agregará automáticamente `S/.` al mostrarlo. Si una categoría no cobra delivery, deja la celda vacía. También se acepta `0`, pero no se mostrará en la página.

Las cremas, sabores de alitas, leche y toppings permanecen configurados dentro de la aplicación y no se administran desde esta pestaña.

La columna `URL de imagen` queda vacía para que puedas pegar enlaces públicos de imágenes. Mientras esté vacía, la web usa las imágenes locales existentes cuando estén disponibles.

## Volver a generar los CSV

Si se actualiza la carta local, ejecuta:

```powershell
npm run export:sheets
```
