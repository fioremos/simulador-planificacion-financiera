# Framework Express.js

Express.js es un framework minimalista para Node.js que facilita el desarrollo de aplicaciones web y APIs REST utilizando JavaScript del lado del servidor. Su principal objetivo es simplificar la creación de servidores HTTP, proporcionando una capa de abstracción sobre Node.js que permite manejar rutas, peticiones, respuestas y middlewares de manera clara y estructurada.

### Características principales

- Framework liviano y flexible.
- Manejo sencillo de rutas HTTP (GET, POST, PUT, DELETE).
- Soporte para middlewares.
- Integración con bases de datos y otros servicios.
- Ideal para el desarrollo de APIs REST.

---

### Motivación y justificación

El uso de Express.js permite organizar el backend de forma más ordenada y mantenible. En lugar de manejar manualmente las peticiones HTTP con Node.js puro, Express facilita la separación de responsabilidades mediante rutas y controladores. Esto resulta especialmente útil en este proyecto que maneja autenticación, formularios y persistencia de datos.

Además, Express se integra naturalmente con otras tecnologías del ecosistema JavaScript, como bases de datos NoSQL o SQL, y es ampliamente utilizado en entornos profesionales.

---

### Nivel de dificultad de adaptación

El nivel de dificultad para aprender Express.js es bajo a medio. El framework utiliza JavaScript estándar y conceptos básicos del protocolo HTTP, por lo que puede ser adoptado fácilmente por desarrolladores con conocimientos previos de JavaScript y Node.js. Su curva de aprendizaje es progresiva y cuenta con una amplia documentación y comunidad.

---

### Ejemplo de código – Antes y después

#### Node.js sin Express

```js
agregarMetaAhorro(datos) {
        try {
            const existe = this.#metasAhorro.some(meta => meta.nombre.toLowerCase() === datos.nombre.toLowerCase() );
            if (!existe) {
                const meta = new MetaAhorro(
                    datos.nombre,
                    datos.montoObjetivo,
                    datos.fechaObjetivo
                );
                this.#metasAhorro.push(meta);
                console.log('Meta agregada:', meta.toJSON());
                return meta;
            } else {
                throw new Error('Meta de ahorro ya existente');
            }
        } catch (error) {
            throw new Error('Error al agregar meta de ahorro: ' + error.message);
        }
    }
```

#### Node.js con Express

```js
const express = require("express");
const router = express.Router();
const MetaAhorro = require("../models/MetaAhorro");

// Simulación de almacenamiento (en memoria)
const metasAhorro = [];

router.post("/", (req, res) => {
  try {
    const { nombre, montoObjetivo, fechaObjetivo } = req.body;

    // Validación básica
    if (!nombre || !montoObjetivo || !fechaObjetivo) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios"
      });
    }

    const existe = metasAhorro.some(
      meta => meta.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
      return res.status(409).json({
        error: "Meta de ahorro ya existente"
      });
    }

    const meta = new MetaAhorro(nombre, montoObjetivo, fechaObjetivo);
    metasAhorro.push(meta);

    console.log("Meta agregada:", meta.toJSON());

    return res.status(201).json(meta.toJSON());

  } catch (error) {
    return res.status(500).json({
      error: "Error al agregar meta de ahorro",
      detalle: error.message
    });
  }
});

module.exports = router;
```