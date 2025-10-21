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

### Suite 3: Exportar Datos
**Funciones Testeadas:**
- `hayDatosSeleccionados()` - Evalúa si el usuario selecciona correctamente tipos de datos para exportar.
- `esFormatoValido()` - Verifica si el formato elegido para exportar (CSV, PDF, JSON) es correcto.
- `sonNombreYRutaValidos()` - Comprueba la validez del nombre del archivo y la ruta destino.
- `exportarDatosFlow()` - Simula todo el proceso de exportación, incluyendo entradas de usuario y llamada final al procesamiento.

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
  1. paso 1
  2. paso 2
  3. paso 3

- **Código del Test que Falla:**
  ```javascript
  it("descripción", function() {
    expect(resultado).toBe(esperado);
  });
  ```
- **GitHub Issue:** #[número]
- **Estado:** Abierto/Resuelto

### Issue #93: Validación del monto (vacío) en Metas de Ahorro
- **Severidad:** Alta
- **Suite Afectada:** `describe("Validaciones de monto en pedirMeta()")`
- **Test Afectado:** `it("debería recharzar monto vacío")`
- **Comportamiento Esperado:** Mostrar alerta de monto inválido.
- **Comportamiento Obtenido:** Meta guardada con éxito.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 2 (Metas de Ahorro) del menu principal.
  2. Seleccionar la opción 1 (Agregar una nueva meta) del menu Gestión de Metas de Ahorro.
  3. Ingresar el nombre de la meta.
  4. Ingresar monto en vacio (`""`).
  5. Ingresar fecha del objetivo (opcional).
  6. Mensaje de "Meta guardada con éxito".
- **Código del Test que Falla:**
  ```javascript
  it("debería recharzar monto vacío", function () {
    spyOn(window, 'prompt').and.returnValues("Meta1", "", "2026-12-31");
    const montoVacio = pedirMeta();
    expect(montoVacio).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#93](https://github.com/fioremos/simulador-planificacion-financiera/issues/93)
- **Estado:** Abierto

### Issue #94: Validación del monto (no numérico) en Metas de Ahorro
- **Severidad:** Alta
- **Suite Afectada:** `describe("Validaciones de monto en pedirMeta()")`
- **Test Afectado:** `it("debería recharzar monto no numérico")`
- **Comportamiento Esperado:** Mostrar alerta de monto inválido.
- **Comportamiento Obtenido:** Meta guardada con éxito.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 2 (Metas de Ahorro) del menu principal.
  2. Seleccionar la opción 1 (Agregar una nueva meta) del menu Gestión de Metas de Ahorro.
  3. Ingresar el nombre de la meta.
  4. Ingresar monto no numérico (`abc`).
  5. Ingresar fecha del objetivo (opcional).
  6. Mensaje de "Meta guardada con éxito".
- **Código del Test que Falla:**
  ```javascript
  it("debería recharzar monto no numérico", function () {
    spyOn(window, 'prompt').and.returnValues("Meta1", "abc", "2026-12-31");
    const montoNoNumerico = pedirMeta();
    expect(montoNoNumerico).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#94](https://github.com/fioremos/simulador-planificacion-financiera/issues/94)
- **Estado:** Abierto

### Issue #95: Validación del monto (con espacios) en Metas de Ahorro
- **Severidad:** Alta
- **Suite Afectada:** `describe("Validaciones de monto en pedirMeta()")`
- **Test Afectado:** `it("debería recharzar monto con espacios")`
- **Comportamiento Esperado:** Mostrar alerta de monto inválido.
- **Comportamiento Obtenido:** Meta guardada con éxito.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 2 (Metas de Ahorro) del menu principal.
  2. Seleccionar la opción 1 (Agregar una nueva meta) del menu Gestión de Metas de Ahorro.
  3. Ingresar el nombre de la meta.
  4. Ingresar monto con espacios (`  5000  `).
  5. Ingresar fecha del objetivo (opcional).
  6. Mensaje de "Meta guardada con éxito".
- **Código del Test que Falla:**
  ```javascript
  it("debería recharzar monto con espacios", function () {
    spyOn(window, 'prompt').and.returnValues("Meta1", " 5000 ", "2026-12-31");
    const montoConEspacios = pedirMeta();
    expect(montoConEspacios).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#95](https://github.com/fioremos/simulador-planificacion-financiera/issues/95)
- **Estado:** Abierto

### Issue #96: Validación de fecha futura (formato incorrecto) en Metas de Ahorro
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función esFechaFuturaValida()")`
- **Test Afectado:** `it ("debería rechazar fechas con formato incorrecto")`
- **Comportamiento Esperado:** Mostrar alerta de formato incorrecto.
- **Comportamiento Obtenido:** Meta guardada con éxito.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 2 (Metas de Ahorro) del menu principal.
  2. Seleccionar la opción 1 (Agregar una nueva meta) del menu Gestión de Metas de Ahorro.
  3. Ingresar el nombre de la meta.
  4. Ingresar monto de la meta.
  5. Ingresar fecha del objetivo (`01-01-2026`).
  6. Mensaje de "Meta guardada con éxito".
- **Código del Test que Falla:**
  ```javascript
  it("debería rechazar fechas con formato incorrecto", function () {
    const formatoIncorrecto = "01-01-2026";
    expect(esFechaFuturaValida(formatoIncorrecto)).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#96](https://github.com/fioremos/simulador-planificacion-financiera/issues/96)
- **Estado:** Abierto

### Issue #97: Validación de fecha (formato incorrecto) en Agregar Movimiento
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función esFechaValida()")`
- **Test Afectado:** `it("debería rechazar una fecha con formato incorrecto")`
- **Comportamiento Esperado:** Mostrar alerta de formato incorrecto.
- **Comportamiento Obtenido:** Movimiento agregado con éxito.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 1 (Agregar Movimiento) del menu principal.
  2. Ingresar fecha del movimiento (`01-10-2025`)
  3. Ingresar el tipo de movimiento (`Ingreso`)
  5. Ingresar la categoria del movimiento (`Sueldo`)
  4. Ingresar monto del movimiento (`500000`).
  6. Mensaje de "Movimiento agregado con éxito".
- **Código del Test que Falla:**
  ```javascript
  it("debería rechazar una fecha con formato incorrecto", function () {
    const formatoIncorrecto = "01-10-2025";
    expect(esFechaValida(formatoIncorrecto)).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#97](https://github.com/fioremos/simulador-planificacion-financiera/issues/97)
- **Estado:** Abierto

### Issue #98: Validación de Tipos (mayúscula) en Agregar Movimiento
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función esTipoValido()")`
- **Test Afectado:** `it("debería aceptar 'tipos' en mayúscula")`
- **Comportamiento Esperado:** Aceptar mayúsculas.
- **Comportamiento Obtenido:** Alerta de Tipo inválido.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 1 (Agregar Movimiento) del menu principal.
  2. Ingresar fecha del movimiento (`2025-10-01`)
  3. Ingresar el tipo de movimiento (`INGRESO`)
  5. Ingresar la categoria del movimiento (`Sueldo`)
  4. Ingresar monto del movimiento (`500000`).
  6. Mensaje de "Tipo inválido. Debe ser uno de: Ingreso, Ahorro, Inversión o Gasto".
- **Código del Test que Falla:**
  ```javascript
  it("debería aceptar 'tipos' en mayúscula", function () {
    expect(esTipoValido("INGRESO")).toBeTruthy();
  });
  ```
- **GitHub Issue:** [#98](https://github.com/fioremos/simulador-planificacion-financiera/issues/98)
- **Estado:** Abierto

### Issue #99: Validación de Tipos (minúscula) en Agregar Movimiento
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función esTipoValido()")`
- **Test Afectado:** `it("debería aceptar 'tipos' en minúscula")`
- **Comportamiento Esperado:** Aceptar minúscula.
- **Comportamiento Obtenido:** Alerta de Tipo inválido.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 1 (Agregar Movimiento) del menu principal.
  2. Ingresar fecha del movimiento (`2025-10-01`)
  3. Ingresar el tipo de movimiento (`ingreso`)
  5. Ingresar la categoria del movimiento (`Sueldo`)
  4. Ingresar monto del movimiento (`500000`).
  6. Mensaje de "Tipo inválido. Debe ser uno de: Ingreso, Ahorro, Inversión o Gasto".
- **Código del Test que Falla:**
  ```javascript
  it("debería aceptar 'tipos' en minúscula", function () {
    expect(esTipoValido("ingreso")).toBeTruthy();
  });
  ```
- **GitHub Issue:** [#99](https://github.com/fioremos/simulador-planificacion-financiera/issues/90)
- **Estado:** Abierto

### Issue #100: Validación de Categorías (mayúscula) en Agregar Movimiento
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función esCategoriaValida()")`
- **Test Afectado:** `it ("debería aceptar categorías en mayúscula")`
- **Comportamiento Esperado:** Aceptar mayúscula.
- **Comportamiento Obtenido:** Alerta de Categoría inválida.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 1 (Agregar Movimiento) del menu principal.
  2. Ingresar fecha del movimiento (`2025-10-01`)
  3. Ingresar el tipo de movimiento (`Gasto`)
  5. Ingresar la categoria del movimiento (`HOGAR`)
  4. Ingresar monto del movimiento (`150000`).
  6. Mensaje de "Categoría inválida. Debe ser una de: Hogar, Ocio, Salud, Sueldo, Objetivos u Otros".
- **Código del Test que Falla:**
  ```javascript
  it ("debería aceptar categorías en mayúscula", function () {
    expect(esCategoriaValida("HOGAR")).toBeTruthy();
  });
  ```
- **GitHub Issue:** [#100](https://github.com/fioremos/simulador-planificacion-financiera/issues/100)
- **Estado:** Abierto

### Issue #101: Validación de Categorías (minúscula) en Agregar Movimiento
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función esCategoriaValida()")`
- **Test Afectado:** `it ("debería aceptar categorías en minúscula")`
- **Comportamiento Esperado:** Aceptar minúsculas.
- **Comportamiento Obtenido:** Alerta de Categoría inválida.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 1 (Agregar Movimiento) del menu principal.
  2. Ingresar fecha del movimiento (`2025-10-01`)
  3. Ingresar el tipo de movimiento (`Gasto`)
  5. Ingresar la categoria del movimiento (`hogar`)
  4. Ingresar monto del movimiento (`150000`).
  6. Mensaje de "Categoría inválida. Debe ser una de: Hogar, Ocio, Salud, Sueldo, Objetivos u Otros".
- **Código del Test que Falla:**
  ```javascript
  it ("debería aceptar categorías en minúscula", function () {
    expect(esCategoriaValida("hogar")).toBeTruthy();
  });
  ```
- **GitHub Issue:** [#101](https://github.com/fioremos/simulador-planificacion-financiera/issues/101)
- **Estado:** Abierto

### Issue #102: Validación de tipos de datos disponibles (mayúscula) en Exportar Datos
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función hayDatosSeleccionados()")`
- **Test Afectado:** `it("deberia aceptar tipos de datos disponibles en mayúscula (MOVIMIENTOS)")`
- **Comportamiento Esperado:** Aceptar mayúscula.
- **Comportamiento Obtenido:** Alerta de "Seleccionar tipo de dato válido".
- **Pasos para Reproducir:**
  1. Seleccionar la opción 3 (Exportar Datos) del menu principal.
  2. Ingresar los datos que se desea exportar (`MOVIMIENTOS`)
  3. Mensaje de "Debe seleccionar al menos un tipo de dato válido".
- **Código del Test que Falla:**
  ```javascript
  it("deberia aceptar tipos de datos disponibles en mayúscula (MOVIMIENTOS)", function () {
    // Simula el prompt donde el usuario escribe "MOVIMIENTOS"
    spyOn(window, 'prompt').and.returnValue("MOVIMIENTOS");

    // Reproducir la lógica de parsing que hace exportarDatosFlow
    const tiposDisponibles = ['Movimientos', 'Metas', 'Presupuesto', 'Historial'];
    const seleccion = prompt(); // devuelve "MOVIMIENTOS" por el spy
    const tiposSeleccionados = seleccion
        ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e))
        : [];

    // Compruebo que el array contiene "MOVIMIENTOS" y que hayDatosSeleccionados lo reconoce
    expect(hayDatosSeleccionados(tiposSeleccionados)).toBeTruthy();
    });
  ```
- **GitHub Issue:** [#102](https://github.com/fioremos/simulador-planificacion-financiera/issues/102)
- **Estado:** Abierto

### Issue #103: Validación de tipos de datos disponibles (minúscula) en Exportar Datos
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función hayDatosSeleccionados()")`
- **Test Afectado:** `it("deberia aceptar tipos de datos disponibles en minúscula (movimientos)"`
- **Comportamiento Esperado:** Aceptar minúsculas.
- **Comportamiento Obtenido:** Alerta de "Seleccionar tipo de dato válido".
- **Pasos para Reproducir:**
  1. Seleccionar la opción 3 (Exportar Datos) del menu principal.
  2. Ingresar los datos que se desea exportar (`movimientos`)
  3. Mensaje de "Debe seleccionar al menos un tipo de dato válido".
- **Código del Test que Falla:**
  ```javascript
  it("deberia aceptar tipos de datos disponibles en minúscula (movimientos)", function () {
    // Simula el prompt donde el usuario escribe "movimientos"
    spyOn(window, 'prompt').and.returnValue("movimientos");

    // Reproducir la lógica de parsing que hace exportarDatosFlow
    const tiposDisponibles = ['Movimientos', 'Metas', 'Presupuesto', 'Historial'];
    const seleccion = prompt(); // devuelve "movimientos" por el spy
    const tiposSeleccionados = seleccion
        ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e))
        : [];

    // Compruebo que el array contiene "movimientos" y que hayDatosSeleccionados lo reconoce
    expect(hayDatosSeleccionados(tiposSeleccionados)).toBeTruthy();
    });
  ```
- **GitHub Issue:** [#103](https://github.com/fioremos/simulador-planificacion-financiera/issues/103)
- **Estado:** Abierto

### Issue #104: Validación de un tipo de dato disponible y otro incorrecto (Metas, Hogar) en Exportar Datos
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función hayDatosSeleccionados()")`
- **Test Afectado:** `it("deberia rechazar un tipo de dato disponible y otro incorrecto (Metas, Hogar)")`
- **Comportamiento Esperado:** Alerta de "seleccionar al menos un tipo de dato válido".
- **Comportamiento Obtenido:** Acepta el ingreso de un tipo de dato incorrecto.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 3 (Exportar Datos) del menu principal.
  2. Ingresar los datos que se desea exportar (`Metas, Hogar`).
  3. Ingresar formato de exportación (`PDF`).
  4. Ingresar nombre del archivo (`reporte`).
  5. Ingresar ruta del directorio (`C:\\Exports`)
  6. Mensaje de "Exportación exitosa. El archivo fue generado correctamente".
- **Código del Test que Falla:**
  ```javascript
  it("deberia rechazar un tipo de dato disponible y otro incorrecto (Metas, Hogar)", function () {
    // Simula el prompt donde el usuario escribe "Metas, Hogar"
    spyOn(window, 'prompt').and.returnValue("Metas, Hogar");

    // Reproducir la lógica de parsing que hace exportarDatosFlow
    const tiposDisponibles = ['Movimientos', 'Metas', 'Presupuesto', 'Historial'];
    const seleccion = prompt(); // devuelve "Metas, Hogar" por el spy
    const tiposSeleccionados = seleccion
        ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e))
        : [];
            
    // Compruebo que el array contiene "Metas" y "Hogar" y que hayDatosSeleccionados lo reconoce
    expect(hayDatosSeleccionados(tiposSeleccionados)).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#104](https://github.com/fioremos/simulador-planificacion-financiera/issues/104)
- **Estado:** Abierto

### Issue #105: Validación de un tipo de dato incorrecto y otro disponible (Hogar, Metas) en Exportar Datos
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función hayDatosSeleccionados()")`
- **Test Afectado:** `it("deberia rechazar un tipo de dato incorrecto y otro disponible (Hogar, Metas)")`
- **Comportamiento Esperado:** Alerta de "seleccionar al menos un tipo de dato válido".
- **Comportamiento Obtenido:** Acepta el ingreso de un tipo de dato incorrecto.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 3 (Exportar Datos) del menu principal.
  2. Ingresar los datos que se desea exportar (`Hogar, Metas`).
  3. Ingresar formato de exportación (`PDF`).
  4. Ingresar nombre del archivo (`reporte`).
  5. Ingresar ruta del directorio (`C:\\Exports`)
  6. Mensaje de "Exportación exitosa. El archivo fue generado correctamente".
- **Código del Test que Falla:**
  ```javascript
  it("deberia rechazar un tipo de dato incorrecto y otro disponible (Hogar, Metas)", function () {
    // Simula el prompt donde el usuario escribe "Hogar, Meta"
    spyOn(window, 'prompt').and.returnValue("Hogar, Metas");

    // Reproducir la lógica de parsing que hace exportarDatosFlow
    const tiposDisponibles = ['Movimientos', 'Metas', 'Presupuesto', 'Historial'];
    const seleccion = prompt(); // devuelve "Hogar, Metas" por el spy
    const tiposSeleccionados = seleccion
        ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e))
        : [];
            
    // Compruebo que el array contiene "Hogar" y "Meta" y que hayDatosSeleccionados lo reconoce
    expect(hayDatosSeleccionados(tiposSeleccionados)).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#105](https://github.com/fioremos/simulador-planificacion-financiera/issues/105)
- **Estado:** Abierto

### Issue #106: Validación del nombre del archivo con extensión (reporte.pdf) en Exportar Datos
- **Severidad:** Alta
- **Suite Afectada:** `describe("Función sonNombreYRutaValidos()")`
- **Test Afectado:** `it("debería recharzar nombre con extensión (reporte.pdf)")`
- **Comportamiento Esperado:** Alerta de nombre del archivo no válido.
- **Comportamiento Obtenido:** Acepta el ingreso del nombre con extensión.
- **Pasos para Reproducir:**
  1. Seleccionar la opción 3 (Exportar Datos) del menu principal.
  2. Ingresar los datos que se desea exportar (`Metas`).
  3. Ingresar formato de exportación (`PDF`).
  4. Ingresar nombre del archivo (`reporte.pdf`).
  5. Ingresar ruta del directorio (`C:\\Exports`)
  6. Mensaje de "Exportación exitosa. El archivo fue generado correctamente".
- **Código del Test que Falla:**
  ```javascript
  it("debería recharzar nombre con extensión (reporte.pdf)", function () {
    expect(sonNombreYRutaValidos("reporte.pdf", "C:\\Exports")).toBeFalsy();
  });
  ```
- **GitHub Issue:** [#106](https://github.com/fioremos/simulador-planificacion-financiera/issues/106)
- **Estado:** Abierto
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