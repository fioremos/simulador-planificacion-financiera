# Test Case 7: Responsive – Implementación de Componente Avanzado Bootstrap (Modal)

## Objetivo
Verificar la correcta integración, personalización y comportamiento responsive del primer componente avanzado de Bootstrap seleccionado: `Modal` en diferentes y navegadores.

## Herramientas Utilizadas
- BrowserStack Mobile Testing  
- Chrome DevTools Device Mode  
- Google PageSpeed Insights  

## Dispositivos Probados
| Dispositivo       | Resolución | Navegador | Orientación         | Resultado | Detalle |
|-------------------|------------|-----------|---------------------|-----------|---------|
| iPhone 14 Pro     | 393x852    | Safari    | Portrait/Landscape  | ✅/⚠️ | En modo landscape, el modal es mas grande que el alto del dispositivo |
| Galaxy S23        | 360x780    | Chrome    | Portrait/Landscape  | ✅/⚠️ | En modo landscape, el modal es mas grande que el alto del dispositivo |
| iPad Air          | 820x1180   | Safari    | Portrait/Landscape  | ✅/✅ | Visualización correcta en ambas orientaciones |
| Desktop (Laptop)  | >1024px    | Chrome    | Landscape           | ✅ | Visualización correcta del modal |

## Breakpoints Verificados
- **Mobile:** 320px – 768px  
- **Tablet:** 768px – 1024px  
- **Desktop:** 1024px+  

---

## Validaciones específicas
- El componente se visualiza correctamente en todas las resoluciones.  
- El fondo se atenúa correctamente.  
- No se genera scroll horizontal.    
- Conserva el estilo general del sitio definido en `css/bootstrap-overrides.css`.  

---

## Capturas esperadas

### iPhone 14 pro - Portrait  
![alt text](../03-testing/imagenes/test-case-8/1-iphone14pro-portrait.png)

### iPhone 14 pro - Landscape  
![alt text](../03-testing/imagenes/test-case-8/2-iphone14pro-landscape.png)

### Samsung Galaxy S23 - Portrait  
![alt text](../03-testing/imagenes/test-case-8/3-samsungS23-portrait.png)

### Samsung Galaxy S23 - Landscape  
![alt text](../03-testing/imagenes/test-case-8/4-samsungS23-landscape.png)

### iPad Air - Portrait  
![alt text](../03-testing/imagenes/test-case-8/5-ipadAir-portrait.png)

### ipad Air - Landscape
![alt text](../03-testing/imagenes/test-case-8/6-ipadAir-landscape.png)

### Desktop  
![alt text](../03-testing/imagenes/test-case-8/7-desktop.png)

### DevTools - Performance
![alt text](../03-testing/imagenes/test-case-8/8-devtools-performance.png)

---

## Performance en Mobile

### Score con la versión anterior
- Performance: 94 / 100  
- Accesibilidad: 100 / 100  
- Prácticas recomendadas: 93 / 100  
- SEO: 91 / 100  

### Score con la versión despues del componente
- Performance: !!49 / 100  
- Accesibilidad: 100 / 100  
- Prácticas recomendadas: 96 / 100  
- SEO: 91 / 100 

### Captura del resultado global
![alt text](../03-testing/imagenes/test-case-8/9-pagespeed-resultado-global.png)

### Resultados antes y despues de la incorpotación del componente 

### Accesibilidad - Antes
![alt text](../03-testing/imagenes/test-case-8/10.1-pagespeed-accesibilidad-antes.png)

### Accesibilidad - Despues
![alt text](../03-testing/imagenes/test-case-8/10.2-pagespeed-accesibilidad-despues.png)

### Practicas recomendadas - Antes
![alt text](../03-testing/imagenes/test-case-8/11.1-pagespeed-practicas-recomendadas-antes.png)

### Practicas recomendadas - Despues
![alt text](../03-testing/imagenes/test-case-8/11.2-pagespeed-practicas-recomendadas-despues.png)

### SEO - Antes
![alt text](../03-testing/imagenes/test-case-8/12.1-pagespeed-seo-antes.png)

### SEO - Despues
![alt text](../03-testing/imagenes/test-case-8/12.2-pagespeed-seo-despues.png)


### Sección de Insights y Diagnósticos de PageSpeed donde se evidencie si hay recursos de bloqueo de renderizado.
![alt text](../03-testing/imagenes/test-case-8/13-pagespeed-insigths-diagnostico.png)

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
| [#61](https://github.com/fioremos/simulador-planificacion-financiera/issues/61) | En modo landscape, el modal es mas grande que el alto del dispositivo (Mobile) |
