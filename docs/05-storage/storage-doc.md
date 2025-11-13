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

```js
// Supongamos que tenemos una lista de instancias de Movimiento
const movimientos = [
  new Movimiento('2025-11-01', 'ingreso', 'sueldo', 150000),
  new Movimiento('2025-11-02', 'gasto', 'hogar', 25000)
];

// Guardar en localStorage usando la función auxiliar
StorageUtil.guardarColeccion('app:movimientos', movimientos);
```

###  Recuperar los movimientos desde el almacenamiento
```js
// Cargar la lista y reconstruir las instancias originales
const movimientosGuardados = StorageUtil.cargarColeccion('app:movimientos', Movimiento);

console.log(movimientosGuardados[0] instanceof Movimiento); // true
console.log(movimientosGuardados[0].tipo); // "ingreso"
```

###  Guardar metas de ahorro
```js
const metas = [
  new MetaAhorro('Auto nuevo', 3000000, '2026-06-01'),
  new MetaAhorro('Emergencias', 500000)
];

StorageUtil.guardarColeccion('app:metas', metas);
```

###  Recuperar metas guardadas
```js
const metasGuardadas = StorageUtil.cargarColeccion('app:metas', MetaAhorro);
console.log(metasGuardadas[0].nombre()); // "Auto nuevo"
```

###  Guardar el estado temporal del planificador
```js
const filtrosActivos = {
  fechaDesde: '2025-10-01',
  fechaHasta: '2025-10-31',
  categoria: 'Todas',
  moneda: 'ARS'
};

StorageUtil.guardar('app:planificador:filtros', filtrosActivos, 'session');
```

### Cargar estado del planificador
```js
const filtros = StorageUtil.obtener('app:planificador:filtros', 'session');
console.log(filtros.categoria); // "Todas"
```

### Guardar configuración de exportación
```js
const configActivo = {
  tipo: ["movimientos"],
  formato: "CSV",
  nombreArchivo: "resumen_financiero",
  rutaDestino: "/exportaciones"
}
StorageUtil.guardar('app:exportador:config', configActivo, 'session');
```

### Cargar configuración de exportación
```js
const config = StorageUtil.obtener('app:exportador:config', 'session');
console.log(config.formato); // "CSV"
```

### Limpieza general del almacenamiento
```js
// Limpia datos persistentes
StorageUtil.limpiar('local');

// Limpia datos de sesión
StorageUtil.limpiar('session');
```