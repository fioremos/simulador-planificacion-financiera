# Documentación Diagrama de Clases

Este diagrama define la arquitectura de lógica de negocio (POO) para el simulador de planificación financiera. Separa las responsabilidades en dos tipos de clases: modelos de dominio y un gestor central.

## Clases Identificadas

### 1. Movimiento
* **Responsabilidad:** Representa una única transacción financiera (ej. un ingreso o un gasto).
* **Propiedades:** Almacena los datos de la transacción (`fecha`, `tipo`, `categoria`, `monto`).
* **Métodos Clave:**
    * `validar(datos)`: Método estático para validar datos *antes* de crear una instancia. Mueve la lógica de `esFechaValida`, `esTipoValido`, etc.
    * `toJSON() / fromJSON()`: Métodos para la serialización (guardado/carga) con el Storage.

### 2. MetaAhorro
* **Responsabilidad:** Representa un único objetivo de ahorro.
* **Propiedades:** Almacena los datos del objetivo (`nombre`, `montoObjetivo`, `montoActual`).
* **Métodos Clave:**
    * `validar(datos)`: Método estático para validar datos *antes* de crear la instancia. Mueve la lógica de `esNombreValido`, `esFechaFuturaValida`, etc.
    * `toJSON() / fromJSON()`: Métodos para la serialización.

### 3. Exportador
- **Responsabilidad:** Gestiona el proceso de exportación de datos financieros desde el planificador hacia distintos formatos.  
  Se encarga de validar los formatos, rutas y nombres de archivos, y de simular la generación del archivo correspondiente.  
- **Propiedades:**
  - `formato: string[]`: Lista de formatos permitidos para exportación, por ejmeplo `docx`, `PDF`, `JSON`.  
- **Métodos Clave:**
  - `exportar(datos, formato, nombreArchivo, rutaDestino)`: Método principal que valida los parámetros y ejecuta la exportación.  
  - `validarFormato(formato)`: Comprueba que el formato esté dentro de los permitidos.  
  - `validarRuta(nombre, ruta)`: Verifica que el nombre de archivo y la ruta sean válidos.  
  - `procesarExportacion(datos, formato)`: Simula la generación del archivo y la comunicación con el backend. 

### 4. Planificador
* **Responsabilidad:** Es la clase principal y el "cerebro" de la aplicación. Orquesta la lógica de negocio y gestiona las listas de movimientos y metas.
* **Propiedades:**
    * `movimientos: Movimiento[]`: Lista que contiene todas las instancias de `Movimiento`.
    * `metas: MetaAhorro[]`: Lista que contiene todas las instancias de `MetaAhorro`.
    * `exportador: Exportador`: Componente interno encargado de gestionar la exportación de datos.
* **Métodos Públicos (Interfaz):**
    * `agregarMovimiento(datos)`: Valida datos, crea un `Movimiento` y lo añade a la lista.
    * `agregarMetaAhorro(datos)`: Valida datos, crea una `MetaAhorro` y la añade a la lista.
    * `generarReporte(filtros)`: Procesa la lista de movimientos y devuelve un objeto con los resultados.
    * `exportarDatos(config)`: Procesa los datos de la app para exportación.
* **Métodos Privados (Lógica Interna):**
    * `filtrarDatos(...)`: Lógica migrada de la función global `filtrarDatos`.
    * `calcularIndicadores(...)`: Lógica migrada de la función global `calcularIndicadores`.

## Relaciones

* **Planificador `*--` Movimiento (Composición):** El `Planificador` "posee" una colección de 0 o más (`0..*`) `Movimientos`. Esta relación es de composición porque los movimientos son parte integral del estado del planificador.
* **Planificador `*--` MetaAhorro (Composición):** El `Planificador` también "posee" una colección de 0 o más (`0..*`) `MetasAhorro`.
* **Planificador `*--` Exportador (Composición):** El `Planificador` incorpora internamente un objeto `Exportador`, al cual delega la responsabilidad de gestionar la exportación de datos. Esta relación refuerza el principio de responsabilidad única y desacopla la lógica de negocio del manejo de archivos.