# Test Case 7: Responsive – Implementación de Componente Avanzado Bootstrap (Offcanvas)

## Objetivo
Verificar la correcta integración, personalización y comportamiento responsive del primer componente avanzado de Bootstrap seleccionado: __`Offcanvas` con menú lateral seleccionable__ en diferentes dispositivos.  

## Herramientas Utilizadas 
- Chrome DevTools Device Mode  
- Google PageSpeed Insights  

## Dispositivos Probados
| Dispositivo       | Resolución | Navegador | Orientación         | Resultado | Detalle |
|-------------------|------------|-----------|---------------------|-----------|---------|
| iPhone 14 Pro     | 393x852    | Safari    | Portrait/Landscape  | ✅/✅ | Visualización correcta en ambas orientaciones |
| Galaxy S23        | 360x780    | Chrome    | Portrait/Landscape  | ✅/✅ | Visualización correcta en ambas orientaciones |
| iPad Air          | 820x1180   | Safari    | Portrait/Landscape  | ✅/⚠️ | Si el offcanvas esta desplegado y pasas de portrait a landscape, el fondo queda oscuro y bloqueado |
| Desktop (Laptop)  | >1024px    | Chrome    | Landscape           | ✅ | El offcanvas se despliega en mobile y tablet |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

---

## Validaciones específicas
- El componente se visualiza correctamente en todas las resoluciones.  
- No aparece scroll horizontal.  
- El menú lateral responde al clic/touch sin retraso.  
- Conserva el estilo general del sitio definido en `css/styles.css`, `css/components.css` y `css/bootstrap-overrides.css`.  

---

## Capturas esperadas

### iPhone 14 pro - Portrait  
![alt text](../03-testing/imagenes/test-case-7/1-iphone14pro-portrait.png)

### iPhone 14 pro - Landscape  
![alt text](../03-testing/imagenes/test-case-7/2-iphone14pro-landscape.png)

### Samsung Galaxy S23 - Portrait  
![alt text](../03-testing/imagenes/test-case-7/3-samsungS23-portrait.png)

### Samsung Galaxy S23 - Landscape  
![alt text](../03-testing/imagenes/test-case-7/4-samsungS23-landscape.png)

### iPad Air - Portrait  
![alt text](../03-testing/imagenes/test-case-7/5-ipadair-portrait.png)

### ipad Air - Landscape
En este caso el componente Offcanvas no se muestra debido a que se activa el sidebar fijo.
![alt text](../03-testing/imagenes/test-case-7/5.1-ipadair-landscape.png)

### Desktop  
En esta ocación el componente Offcanvas es visible en mobile y tablet ya que en desktop se despliega el sidebar.

### DevTools - Performance
![alt text](../03-testing/imagenes/test-case-7/6-devtools-performance.png)

---

## Performance en Mobile

### Score con la versión anterior
- Performance: 94 / 100  
- Accesibilidad: 100 / 100  
- Prácticas recomendadas: 93 / 100  
- SEO: 91 / 100  

### Score con la versión despues del componente
- Performance: 94 / 100  
- Accesibilidad: 100 / 100  
- Prácticas recomendadas: 96 / 100  
- SEO: 91 / 100 

### Captura del resultado global
![alt text](../03-testing/imagenes/test-case-7/7-pagespeed-resultado-global.png)

### Resultados antes y despues de la incorpotación del componente 

### Accesibilidad - Antes
![alt text](../03-testing/imagenes/test-case-7/8.1-pagespeed-accesibilidad-antes.png)

### Accesibilidad - Despues
![alt text](../03-testing/imagenes/test-case-7/8.2-pagespeed-accesibilidad-despues.png)

### Practicas recomendadas - Antes
![alt text](../03-testing/imagenes/test-case-7/9.1-pagespeed-practicas-recomendadas-antes.png)

### Practicas recomendadas - Despues
![alt text](../03-testing/imagenes/test-case-7/9.2-pagespeed-practicas-recomendadas-despues.png)

### SEO - Antes
![alt text](../03-testing/imagenes/test-case-7/10.1-pagespeed-seo-antes.png)

### SEO - Despues
![alt text](../03-testing/imagenes/test-case-7/10.2-pagespeed-seo-despues.png)


### Sección de Insights y Diagnósticos de PageSpeed donde se evidencie si hay recursos de bloqueo de renderizado.
![alt text](../03-testing/imagenes/test-case-7/11-pagespeed-insigths-diagnstico.png)  

---

## Resultado Esperado
- El componente se adapta correctamente en todos los dispositivos y resoluciones.  
- Mantiene coherencia visual y estilo definido en los archivos CSS del proyecto.  
- No genera problemas de performance ni bloqueos de carga.  

---

## Issues encontrados
Registrar aquí los problemas detectados y su correspondiente issue en el repositorio:  

| IssueID | Descripción |
|---------|-------------|
| [#60](https://github.com/fioremos/simulador-planificacion-financiera/issues/60) | Si el offcanvas esta desplegado y pasas de portrait a landscape, el fondo queda oscuro y bloqueado (iPad air) |
