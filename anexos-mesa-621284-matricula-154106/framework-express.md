# Framework - Express.js

Express.js es un framework minimalista y flexible de Node.js que proporciona un conjunto robusto de características para desarrollar **aplicaciones web y API REST** de manera rápida y sencilla. Es el estándar de facto para el *Back-end* del stack MERN/MEAN/MEVN.

### Características Destacadas:
* **Manejo de Rutas (Routing):** Define las URL que la aplicación debe escuchar (`/movimientos`, `/metas`, `/reportes`) y cómo responder a los diferentes métodos HTTP (GET, POST, PUT, DELETE).
* **Middleware:** Permite ejecutar funciones en la mitad del ciclo de solicitud-respuesta (ejemplo, para autenticación, validación de datos o registro).
* **Minimalista:** No impone una estructura rígida, dejando la libertad de diseño al desarrollador.
* **Gran Ecosistema:** Se beneficia de la gran cantidad de módulos disponibles en npm para Node.js.

## Motivación y Justificación para FinGrow

Elegí Express.js para FinGrow porque es la herramienta más eficiente para **migrar la persistencia y la lógica de negocio a un servidor centralizado**, transformando la aplicación de un simulador local a un servicio real.

### Beneficios Clave:
* **Persistencia Centralizada:** Reemplaza `StorageUtil` (que usa `localStorage`) por una base de datos real (como MongoDB), permitiendo a los usuarios acceder a sus datos desde cualquier dispositivo.
* **API RESTful:** Permite exponer los métodos de `Planificador` (como por ejemplo `agregarMovimiento`, `eliminarMovimiento`, `generarReporte`) como endpoints HTTP (`/api/movimientos`, `/api/metas`), consumibles por el Front-end de React.
* **Seguridad y Lógica de Negocio:** Permite validar y procesar datos sensibles en el servidor (ejemplo, la lógica de actualización de metas en `Planificador.agregarMovimiento`), protegiéndolos de manipulaciones directas en el cliente.
* **Integración con Node.js:** Aprovecha el entorno de ejecución asíncrono y de alto rendimiento de Node.js.

## Nivel de Dificultad de Adaptación

La adaptación de la persistencia de FinGrow a Express.js sería un esfuerzo **Alto**, ya que requiere desarrollar una capa de Back-end completamente nueva.

### Curva de Aprendizaje:
* La curva es **Moderada** para Express.js en sí, pero **Alta** si se incluye la integración con una Base de Datos (como Mongoose para MongoDB) y la implementación de la autenticación de usuarios (JWT).

### Cambios Requeridos:
* **Creación de Servidor:** Se debe crear una nueva estructura de carpetas (como `server/`) con archivos de configuración para Express.
* **Desacoplamiento de Modelos:** Los métodos de persistencia y la lógica de gestión de datos de `Planificador.js` y `StorageUtil.js` deben ser reescritos en el Back-end de Express como **Controladores** de la API y **Modelos de Base de Datos**.
* **Modificación del Front-end:** El `ApiService.fetchData` y las llamadas directas a `Planificador` deberán ser modificadas para enviar solicitudes `POST`, `PUT`, `GET` y `DELETE` a los nuevos *endpoints* de Express.

## Ejemplo de Código - "Antes y Después"

### Antes (Vanilla JavaScript / `Planificador.js` & `StorageUtil.js`)

La eliminación de un movimiento ocurre en el Front-end, modificando un array local y luego actualizando el almacenamiento del navegador:

```javascript
// Fragmento de Planificador.js:
eliminarMovimiento(id) {
    const indice = this.#movimientos.findIndex(m => m.id === id);
    if (indice !== -1) {
        this.#movimientos.splice(indice, 1);
        this.persistir(); // Llama a StorageUtil.guardar('app:movimientos', ...)
        return true;
    }
    return false;
}
```

### Después (Implementación con Express.js - Ruta DELETE)
El Front-end envía una solicitud HTTP, y Express.js maneja la eliminación en el servidor, que se conecta a la Base de Datos:

```javascript
// Archivo: server/routes/movimientos.js
const express = require('express');
const router = express.Router();
const MovimientoModel = require('../models/Movimiento'); // Modelo de DB

// Ruta DELETE para eliminar un movimiento específico
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const movimientoEliminado = await MovimientoModel.findByIdAndDelete(id);
        
        if (!movimientoEliminado) {
            return res.status(404).json({ error: 'Movimiento no encontrado' });
        }
        
        // **Actualizar también la meta si estaba asociada**

        // **Lógica de negocio para deshacer el avance de meta**

        // Respuesta exitosa
        return res.status(200).json({ mensaje: 'Movimiento eliminado con éxito' });
    } catch (error) {
        // Manejo de errores de servidor o DB
        return res.status(500).json({ error: 'Error al eliminar el movimiento', detalle: error.message });
    }
});

module.exports = router;
```

