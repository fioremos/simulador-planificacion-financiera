# Test Case 1: Compatibilidad Navegadores Desktop

## Objetivo
Verificar la correcta visualización y funcionalidad en navegadores desktop principales.

## Herramientas Utilizadas
- BrowserStack Live Testing
- Can I Use Database
- CSS Stats

## Navegadores Probados
| Navegador | Versión | OS | Resultado |
|-----------|---------|----|-----------|
| Chrome | [versión] | Windows 11 | ✅/❌ |
| Firefox | [versión] | Windows 11 | ✅/❌ |
| Safari | [versión] | macOS | ✅/❌ |
| Edge | [versión] | Windows 11 | ✅/❌ |

## Capturas de Pantalla
### Chrome
![Chrome Desktop](../screenshots/chrome-desktop.png)

### Firefox
![Firefox Desktop](../screenshots/firefox-desktop.png)

### Safari
![Safari Desktop](../screenshots/safari-desktop.png)

### Edge
![Edge Desktop](../screenshots/edge-desktop.png)

## Issues Encontrados
[Documentar problemas específicos con soluciones implementadas]

## Métricas de Compatibilidad (por navegador)

**Definición:**  
Se calcula en base al total de propiedades únicas de CSS detectadas con **CSS Stats** (`TotalProps`).  
Para cada navegador, se cuentan las propiedades soportadas según **Can I Use** (`CompatibleProps`).  

**Fórmula:**  
Compatibilidad CSS (por navegador) = (CompatibleProps / TotalProps) * 100

### Evidencias Requeridas
1. **Captura de CSS Stats** mostrando `TotalProps`.  
   ![CSS Stats Overview](../screenshots/css-stats.png)

2. **Capturas de 4 propiedades consultadas en Can I Use** (una por imagen), indicando si están soportadas en cada navegador.  
   Ejemplo de propiedades sugeridas:  
   - `grid`  
   - `flexbox`  
   - `backdrop-filter`  
   - `position: sticky`  

   Ejemplo de evidencia:  
   ![Can I Use - Grid](../screenshots/caniuse-grid.png)  
   ![Can I Use - Flexbox](../screenshots/caniuse-flexbox.png)  
   ![Can I Use - Backdrop Filter](../screenshots/caniuse-backdrop-filter.png)  
   ![Can I Use - Sticky](../screenshots/caniuse-sticky.png)  

### Tabla de Resultados
| Navegador | TotalProps | CompatibleProps | Compatibilidad CSS |
|-----------|------------|-----------------|---------------------|
| Chrome | 120 | [n] | [n/120 * 100]% |
| Firefox | 120 | [n] | [n/120 * 100]% |
| Safari | 120 | [n] | [n/120 * 100]% |
| Edge | 120 | [n] | [n/120 * 100]% |

> Nota: Esta métrica es **por navegador**, ya que el soporte de propiedades CSS varía entre ellos.