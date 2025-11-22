#  Documentación del Módulo de Storage  

##  Propósito del módulo

El módulo `StorageUtil` proporciona una interfaz unificada y segura para gestionar el **almacenamiento persistente** del navegador (localStorage y sessionStorage).  
Se encarga de guardar, recuperar, actualizar y eliminar datos de manera estructurada, incluyendo:

- **Colecciones de clases** (`Movimiento`, `MetaAhorro`, `Planificador`).  
- **Configuraciones y preferencias** del usuario.  


Gracias a la serialización JSON y a los métodos `toJSON()` / `fromJSON()` implementados en las clases, el sistema puede **guardar y reconstruir instancias completas** sin perder su estructura ni comportamiento.

---

##  Qué datos se almacenan

El sistema persiste diferentes tipos de información según el contexto:

| Tipo de dato | Origen | Descripción | Clase relacionada | Tipo de almacenamiento |
|---------------|---------|-------------|-------------------|------------------------|
| **Movimientos** | Registro de operaciones financieras | Guarda ingresos, gastos, ahorros e inversiones. | `Movimiento` | `localStorage` |
| **Metas de ahorro** | Objetivos financieros | Contiene nombre, monto objetivo, progreso y fecha límite. | `MetaAhorro` | `localStorage` |
| **Configuración del generador de reportes** | Configuración del generador de reportes | Filtros, moneda, rango de fechas, etc. | `Planificador` | `sessionStorage` |
| **Configuración del exportador** | Preferencias de exportación del usuario | Formato, ruta o nombre de archivo exportado. | `Exportador` | `sessionStorage` |
---

##  Estructura de claves

Todas las claves del almacenamiento siguen la convención:  
app:< modulo >:< tipo-dato >


| Clave | Contenido | Ejemplo | Tipo |
|--------|------------|----------|------|
| `app:planificador` | Lista de objetos de tipo `Movimiento`. | `{fecha, tipo, categoria, monto}` | local |
| `app:planificador:filtros` | Estado temporal del simulador financiero. | `{ fechaAscii, fechaDesde, fechaHasta, categoria , moneda}` | session |
| `app:exportador:config` | Estado temporal de la configuración de exportación. | `{tipo, formato, nombreArchivo, rutaDestino}` | session |

---

##  Formato de datos (Schemas JSON)

A continuación se presentan los **schemas JSON** utilizados por cada tipo de entidad almacenada.

### 🔹 Movimiento
```json
{
  "id": 1,
  "fecha": "2025-11-01",
  "tipo": "gasto",
  "categoria": "hogar",
  "monto": 1200.50
}
```

### 🔹 MetaAhorro  
```json
{
  "id": 10,
  "nombre": "Viaje a Córdoba",
  "montoObjetivo": 80000,
  "fechaObjetivo": "2026-03-01",
  "montoActual": 25000
}
```

###  Planificador (filtros)
```json
{
  "fechaDesde": "2025-10-01",
  "fechaHasta": "2025-10-31",
  "categoria": "Todas",
  "moneda": "ARS"
}
```

### 🔹 Exportador (config)
```json
{
  "tipo": ["movimientos"],
  "formato": "CSV",
  "nombreArchivo": "resumen_financiero",
  "rutaDestino": "/exportaciones",
}
```


## Diferencia entre localStorage y sessionStorage

| Aspecto              | **localStorage**                                                 | **sessionStorage**                                     |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| **Persistencia**     | Permanece incluso después de cerrar el navegador.                | Se borra al cerrar la pestaña.                         |
| **Uso principal**    | Datos duraderos del usuario (movimientos, metas). | Datos temporales del flujo activo (filtros, reportes, exportaciones). |
| **Ejemplo de clave** | `app:planificador`                      | `app:planificador:filtros`, `app:exportador:config`                             |
| **Volumen de datos** | Mayor, se usa para colecciones.                                  | Ligero, solo configuraciones temporales.               |
| **Recomendado para** | Información de largo plazo.                                      | Sesiones o estados transitorios.                       |

## Ejemplos de uso

###  Guardar una colección de movimientos
[Ejemplo en proyecto](../../js/script.js#L942)

```js
// Supongamos que tenemos un planificador con la lista de instancias de Movimiento
const movimientos = [
  new Movimiento('2025-11-01', 'ingreso', 'sueldo', 150000),
  new Movimiento('2025-11-02', 'gasto', 'hogar', 25000)
];

// Y lista de instancias de metas
const metas = [
  new MetaAhorro('Auto nuevo', 3000000, '2026-06-01'),
  new MetaAhorro('Emergencias', 500000)
];

// llamamos al metodo de logica de negocio
actualizarLocalVariables('planificador', 'planificador', null)

// la cual utiliza la funcion 
StorageUtil.actualizar('app:planificador', this.localToJSON(), 'local');
```

###  Recuperar los movimientos desde el almacenamiento

[Ejemplo en proyecto](../../js/script.js#L367)
```js
// Cargar la lista y reconstruir las instancias originales
const movimientosGuardados = planificador.obtenerVariables('planificador', 'local')

// la cual utiliza la funcion 
StorageUtil.obtener('app:planificador', 'local');
```

### Guardar configuración de exportación
[Ejemplo en proyecto](../../js/script.js#L402)
```js
const configActivo = {
  tipo: ["movimientos"],
  formato: "CSV",
  nombreArchivo: "resumen_financiero",
  rutaDestino: "/exportaciones"
}

planificador.actualizarSessionVariables('exportador', 'exportador:config', exportador);

//utiliza
StorageUtil.actualizar('app:exportador:config', exportador.sessionToJSON(), 'session');
```

### Cargar configuración de exportación
[Ejemplo en proyecto](../../js/script.js#L526)
```js
const config = planificador.obtenerVariables('exportador:config', 'session');

//Que utiliza
StorageUtil.obtener('app:exportador:config', 'session');
```