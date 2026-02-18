# Framework - Express.js

## Descripción General
**Express.js** es un framework de desarrollo web minimalista y flexible para **Node.js**. Es considerado el estándar en backend para la construcción de aplicaciones web y APIs en el ecosistema JavaScript.

A diferencia de frameworks "opinados" (que imponen una estructura rígida), Express proporciona una capa delgada de funcionalidades básicas para manejar peticiones HTTP, enrutamiento y **Middleware**, permitiendo al desarrollador estructurar la arquitectura del servidor según las necesidades específicas del proyecto.

### Características Destacadas:
* **Arquitectura de Middleware:** Permite interceptar y procesar peticiones en cadena (ej: validación -> autenticación -> manejo de errores).
* **Enrutamiento Robusto:** Sistema intuitivo para definir endpoints (rutas) basados en métodos HTTP (GET, POST, PUT, DELETE) y URLs.
* **Alto Rendimiento:** Al ejecutarse sobre Node.js, aprovecha su modelo de I/O no bloqueante orientado a eventos.

## Motivación y Justificación
La incorporación de Express.js es el paso fundamental para transformar **FinGrow** de una herramienta de simulación local a una plataforma web completa y persistente.

1.  **Centralización de la Lógica de Negocio:** Actualmente, cálculos críticos y validaciones residen en el navegador del cliente, lo cual es inseguro y difícil de mantener. `Express.js` permite mover esta lógica a un entorno controlado en el servidor.
2.  **Persistencia Real:** Permite reemplazar el almacenamiento volátil (`localStorage`) por una conexión a una base de datos real (como MongoDB o SQL), garantizando que los datos del usuario no se pierdan al borrar caché o cambiar de dispositivo.
3.  **Seguridad y Autenticación:** Facilita la implementación de sesiones de usuario seguras, protegiendo la información financiera mediante tokens o cookies, algo imposible de asegurar solo con Frontend.

## Nivel de Dificultad de Adaptación
**Nivel: Medio**

La migración implica dividir la aplicación monolítica actual en dos entidades separadas:
* **Desarrollo de API REST:** Se deben definir "endpoints" (puntos de acceso) para que el Frontend pueda pedir y enviar datos (ej: `GET /api/movimientos`, `POST /api/movimientos`).
* **Configuración del Servidor:** Requiere instalar Node.js, configurar el servidor, manejar puertos y gestionar errores de red reales (CORS, Timeouts).
* **Curva de Aprendizaje:** Requiere comprender el protocolo HTTP, los códigos de estado (200, 404, 500) y el manejo de asincronía en el servidor.

## Ejemplo de código - "Antes y después"

Para demostrar el impacto en la arquitectura de datos, se analiza el método encargado de registrar un nuevo movimiento financiero.

### Versión Actual (Persistencia Local - Planificador.js)
En la arquitectura actual, la clase `Planificador` gestiona el estado en memoria (`this.#movimientos`) y depende de `StorageUtil` para persistir los datos en el navegador del usuario. La lógica de negocio y el almacenamiento están acoplados en el cliente.

```javascript
// Fragmento de Planificador.js
/* ======== Gestión de Movimientos ======== */

    /**
     * Agrega un nuevo movimiento financiero.
     * Si el movimiento está asociado a una meta de ahorro, actualiza su progreso.
     * @param {Object} datos - Datos del movimiento: { fecha, tipo, categoria, monto, objetivo }.
     * @returns {Movimiento|null} Instancia agregada o null si falla la validación de meta.
     * @throws {Error} Si los datos son inválidos o falla la creación del movimiento.
     */
    agregarMovimiento(datos) {
        try {
            let meta = null;

            if (datos.objetivo) {
                meta = this.#metasAhorro.filter(obj => obj.id === datos.objetivo);

                if (!meta) {
                    console.log('Meta de ahorro invalida');
                    return null;
                }

                meta[0].actualizarMontoActual(datos.monto);
            }
            
            const movimiento = new Movimiento( // Creación del objeto en memoria
                datos.fecha,
                datos.tipo,
                datos.categoria,
                datos.nombre,
                datos.monto,
                datos.objetivo,
                this.diccCategorias.map(cat => cat.categoria).map(op => op.toLowerCase().replace(/\s/g, '')),
                this.diccCategorias.flatMap(cat => cat.opciones).map(op => op.toLowerCase().replace(/\s/g, ''))
            );

            this.#movimientos.push(movimiento); // Persistencia en Array local y LocalStorage
            console.log('Movimiento agregado:', movimiento.toJSON());
            return movimiento;

        } catch (error) {
            throw new Error('Error al agregar movimiento: ' + error.message);
        }
    }
```

### Versión Propuesta (Persistencia en Servidor - Express Controller)
Con Express.js, la responsabilidad de crear y guardar el movimiento se traslada al servidor. El cliente solo envía los datos. El servidor recibe la petición, valida y guarda en la base de datos de forma segura.

```javascript
/* Ubicación: backend/controllers/movimientosController.js */
const Movimiento = require('../models/Movimiento'); // Modelo de Base de Datos

// Endpoint: POST /api/movimientos
exports.agregarMovimiento = async (req, res) => {
    try {
        const datos = req.body;

        // 1. Validación de reglas de negocio en el servidor
        if (datos.objetivo) {
            // Buscamos la meta en la Base de Datos real
            const meta = await MetaAhorro.findById(datos.objetivo);
            if (!meta) {
                return res.status(404).json({ error: 'Meta de ahorro inválida' });
            }
            // Actualizamos la meta atómicamente
            meta.montoActual += datos.monto;
            await meta.save();
        }

        // 2. Creación y Persistencia directa en Base de Datos
        const nuevoMovimiento = new Movimiento(datos);
        await nuevoMovimiento.save(); // Se guarda en MongoDB/SQL, no en memoria RAM

        // 3. Respuesta al cliente
        res.status(201).json(nuevoMovimiento);

    } catch (error) {
        res.status(500).json({ error: 'Error interno al procesar movimiento' });
    }
};
```