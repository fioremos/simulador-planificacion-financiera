# Documentación de Testing - Suite Jasmine

## Índice
1. [Ejecución de Tests](#ejecución-de-tests)
2. [Suites de Tests](#suites-de-tests)
3. [Métricas de Cobertura](#métricas-de-cobertura)
4. [Capturas de Pantalla](#capturas-de-pantalla)
5. [Issues Conocidos](#issues-conocidos)

---

## Ejecución de Tests

### Pasos para Ejecutar
1. Abrir `test-runner.html` en el navegador
2. Los tests se ejecutan automáticamente
3. Verificar resultados en la interfaz de Jasmine

### Interpretación de Resultados
- **Verde**: Tests pasando ✅
- **Rojo**: Tests fallando ❌
- **Amarillo**: Tests pendientes ⚠️

---

## Suites de Tests

### Suite 1: Agregar Movimiento
**Funciones Testeadas:**
- `esFechaValida()` - Valida que la fecha ingresada no sea futura y tenga formato correcto.  
- `esTipoValido()` - Comprueba que el tipo de movimiento sea válido (Ingreso/Gasto).  
- `esCategoriaValida()` - Verifica si la categoría ingresada pertenece al conjunto permitido.  
- `camposCompletos()` - Evalúa que todos los campos requeridos estén completos y el monto sea numérico y positivo.  

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | [Descripción] | Happy Path |
| 2 | [Descripción] | Caso Borde |
| 3 | [Descripción] | Validación de Errores |

---

### Suite 2: Metas de Ahorro
**Funciones Testeadas:**
- `esNombreValido()` - Valida el nombre de la meta asegurando que tenga al menos 2 caracteres.  
- `pedirMeta()` - Evalúa las entradas obtenidas por `prompt()` (nombre, monto y fecha), comprobando la validez del monto.  
- `esFechaFuturaValida()` - Verifica que la fecha ingresada sea futura o vacía, y tenga formato correcto.  

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | [Descripción] | Happy Path |
| 2 | [Descripción] | Caso Borde |

---

### Suite 3: [Nombre del Flujo 3]
**Funciones Testeadas:**
- `[función4()]` - [Descripción breve]

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | [Descripción] | Happy Path |
| 2 | [Descripción] | Validación de Errores |

---

### Suite 4: [Nombre del Flujo 4]
**Funciones Testeadas:**
- `[función5()]` - [Descripción breve]

**Casos de Prueba:**
| # | Descripción | Tipo |
|---|-------------|------|
| 1 | [Descripción] | Happy Path |
| 2 | [Descripción] | Caso Borde |

---

## Métricas de Cobertura

### Resumen General
| Métrica | Valor |
|---------|-------|
| Total de Tests | [XX] |
| Tests Pasando | [XX] ✅ |
| Tests Fallando | [XX] ❌ |
| Porcentaje de Éxito | [XX]% |

### Cobertura por Tipo de Test
| Tipo | Cantidad | Porcentaje |
|------|----------|------------|
| Happy Path | [XX] | [XX]% |
| Casos Borde | [XX] | [XX]% |
| Validación de Errores | [XX] | [XX]% |
| Operaciones Arrays/Objetos | [XX] | [XX]% |

### Análisis de Cobertura de Código

**Metodología:** Se revisó manualmente cada función del código fuente y se verificó qué líneas son ejecutadas por los tests implementados.

| Función | Líneas Totales | Tests | Líneas Cubiertas | Cobertura |
|---------|----------------|-------|------------------|-----------|
| `función1()` | [XX] | [X] | [XX] | [XX]% |
| `función2()` | [XX] | [X] | [XX] | [XX]% |
| `función3()` | [XX] | [X] | [XX] | [XX]% |
| `función4()` | [XX] | [X] | [XX] | [XX]% |
| `función5()` | [XX] | [X] | [XX] | [XX]% |

**Cobertura Total Estimada:** [XX]% ([XX]/[XX] líneas ejecutables)

#### Líneas NO Cubiertas
Ej:
- `script.js:45-48` - Manejo de error de red (difícil de simular)
- `script.js:67` - Caso edge específico de [descripción]

---

## Capturas de Pantalla

### Tests Pasando
![Tests Exitosos](./screenshots/tests-passing.png)
*Todos los tests ejecutándose correctamente*

### Vista Detallada de Suites
![Suite Detalle](./screenshots/suite-detail.png)
*Expansión de una suite mostrando tests individuales*

---

## Issues Conocidos

### Issue #[X]: [Título del Issue]
- **Severidad:** Alta/Media/Baja
- **Suite Afectada:** `describe("[Nombre Suite]")`
- **Test Afectado:** `it("[descripción test]")`
- **Comportamiento Esperado:** [Descripción]
- **Comportamiento Obtenido:** [Descripción]
- **Pasos para Reproducir:**
  1. [Paso 1]
  2. [Paso 2]
  3. [Paso 3]
- **Código del Test que Falla:**
  ```javascript
  it("descripción", function() {
    expect(resultado).toBe(esperado);
  });
  ```
- **GitHub Issue:** #[número]
- **Estado:** Abierto/Resuelto

---

## Limitaciones del Testing

Ej:
- Tests síncronos únicamente (sin Promises/async-await)
- Sin cobertura automatizada de código
- Requiere conexión a internet (CDN de Jasmine)
- No incluye tests de integración con DOM
- [Otras limitaciones específicas del proyecto]

---

**Última Actualización:** [21/10/2025]  
**Tester/QA Engineer:** [Ulises]  
**Colaboración con:** [Desarrollador JavaScript - Fiorella]