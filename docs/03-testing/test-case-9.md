# Test Case 9: Responsive – Implementación de Componente Avanzado HTML (1)

## Objetivo
Validar la integración, compatibilidad y comportamiento responsive del primer componente avanzado HTML implementado: **elemento `<video>` con subtítulos track** en diferentes dispositivos.

## Herramientas Utilizadas
- BrowserStack Mobile Testing  
- Chrome DevTools Device Mode  
- Google PageSpeed Insights  
- Can I Use (verificación de compatibilidad por navegador)  
- W3C HTML Validator (validación de estándares HTML5)  

## Dispositivos Probados
| Dispositivo       | Resolución | Navegador | Orientación         | Resultado |
|-------------------|------------|-----------|---------------------|-----------|
| iPhone 14 Pro     | 393x852    | Safari    | Portrait/Landscape  | ✅ |
| Galaxy S23        | 360x780    | Chrome    | Portrait/Landscape  | ✅ |
| iPad Air          | 820x1180   | Safari    | Portrait/Landscape  | ✅ |
| Desktop (Laptop)  | >1024px    | Chrome    | Landscape           | ✅ |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

---

## Validaciones específicas
- Confirmar que el componente HTML se adapte a diferentes resoluciones de pantalla.  
- Verificar que **no genere scroll horizontal indeseado**.  
- Validar compatibilidad de controles (play, pause, zoom, interacción táctil).  
- Revisar si el contenido embebido se adapta correctamente al **sistema de grillas de Bootstrap**.  
- Chequear que los estilos personalizados en `css/styles.css`, `css/components.css` y `css/bootstrap-overrides.css` mantengan coherencia visual con el resto del proyecto.  

---

## Uso de herramientas de compatibilidad y validación

- **Can I Use:** Verificar compatibilidad del componente HTML con navegadores principales (ej: Safari iOS, Chrome Android, Edge, Firefox).  
  **Capturas necesarias:**  
  Pantalla de resultados de mostrando la tabla de soporte del componente.
  ![caniuse-video](imagenes/test-case-9/caniuse-video.png)
  ![caniuse-track](imagenes/test-case-9/caniuse-track.png)  

| Componente | Compatibilidad Global | Navegadores compatibles | Limitaciones |
|------------|-----------------------|-------------------------|--------------|
| <video>  | 96.37%  | Chrome, Edge, Safari, Firefox, Opera | Totalmente soportado, no requiere plugins.|
| <track>  | 95.53%  | Chrome, Safari, Firefox, Edge  | No compatible con modo fullscreen en navegadores antiguos.|

- **W3C HTML Validator:** Validar que la implementación del componente sea conforme a HTML5 y no genere errores o warnings de semántica.  
  **Capturas necesarias:**  
 ![W3C HTML Validator](imagenes/test-case-9/W3C-HTML-Validator.png)

 **Resultado general:** Se detectaron errores menores estructurales, relacionados con la organización del documento, no con los componentes avanzados implementados.

 | Tipo       | Descripción                                                                                   | Relevancia |
| ---------- | --------------------------------------------------------------------------------------------- | ---------- |
| ⚠️ Error   | Uso del elemento `<main>` dentro de varias `<section>` → No permitido por especificación.     | Medio      |
| ⚠️ Error   | Múltiples elementos `<main>` visibles en un mismo documento.                                  | Medio      |
| ⚠️ Error   | Atributo `alt` con comillas duplicadas (`alt="logo_tacho_borrar""`).                          | Bajo       |
| ⚠️ Error   | IDs duplicados (`movimientos-form`, `inversiones`).                                           | Medio      |
| ⚠️ Warning | Secciones sin encabezado `<h2>` o similar (por ejemplo, “dashboard”, “metas”, “inversiones”). | Bajo       |
| ⚠️ Error   | Elemento `<div>` sin cerrar dentro de la sección “configuración”.                             | Medio      |

---

## Performance en Mobile
- Medir el impacto del componente en la **performance total de la página** con PageSpeed.  
  **Capturas necesarias:**  

  Resultados del test de Google PageSpeed para **mobile**.
  ![General](imagenes/test-case-9/pagespeed-general.png) 
  Gráfico de puntuación general.  

  ![Accessibility](imagenes/test-case-9/pagespeed-accessibility.png)
  ![Best Practices](imagenes/test-case-9/pagespeed-best-practices.png)
  ![SEO](imagenes/test-case-9/pagespeed-seo.png)

- Confirmar que los recursos cargados (ej: scripts de YouTube o mapas) no bloqueen renderización.  

  Sección de Insights y Diagnósticos de PageSpeed donde se evidencie si hay recursos de bloqueo de renderizado.
  ![Insights](imagenes/test-case-9/pagespeed-insights.png)

  2. Comparación del **First Contentful Paint (FCP)** y **Largest Contentful Paint (LCP)** antes y después de agregar el componente.  

---

## Capturas esperadas
**Iphone 14 pro - Potrait**  

![Iphone 14 pro - Potrait](imagenes/test-case-9/iphone-video.png)

**Iphone 14 pro - Landscape**

![Iphone 14 pro - Landscape](imagenes/test-case-9/iphone-video-landscape.png)

**Samsung Galaxy S23 - Portait**

![Samsung Galaxy S23 - Portait](imagenes/test-case-9/samsung-video.png)

**Samsung Galaxy S23 - Landscape**

![Samsung Galaxy S23 - Landscape](imagenes/test-case-9/samsung-video-landescape.png)

**iPad Air - Portait** 

![iPad Air - Portait](imagenes/test-case-9/ipad-video-portrait.png)

**iPad Air - Landscape**

![iPad Air - Landsacpe](imagenes/test-case-9/ipad-video-landscape.png)

**Desktop**

![Desktop](imagenes/test-case-9/desktop-video.png)  



---

## Resultado Esperado
- El componente HTML se adapta y funciona correctamente en todos los dispositivos probados.  
- Mantiene la coherencia del diseño e integración con Bootstrap.  
- No afecta de forma crítica la performance en mobile.  
- Es compatible con los principales navegadores según **Can I Use** y válido según **W3C HTML Validator**.  

---

## Issues encontrados
Registrar aquí los problemas detectados y su correspondiente issue en el repositorio:  

| IssueID | Descripción |
|---------|-------------|
| [#101](https://github.com/tu-org/tu-repo/issues/101) | Ejemplo: Iframe no escala en versión mobile (iPhone 14 Pro) 