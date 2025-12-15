# Anexo Técnico: Frameworks & NodeJS - Plan de Escalabilidad de FinGrow

## Introducción: De SPA a Full Stack

Actualmente, FinGrow es una **Single Page Application (SPA)** implementada en Vanilla JavaScript (con módulos ES6) y persistencia en el navegador (`localStorage`/`sessionStorage` a través de `StorageUtil`). La aplicación cumple con su rol de simulador interactivo.

Sin embargo, para escalar a un entorno de producción real, se requiere migrar la persistencia de datos a un servidor central. Esta migración implica pasar a una arquitectura **Full Stack**, donde el Front-end (la UI de FinGrow) se comunica con un Back-end (una API) para gestionar la lógica de negocio y la base de datos.

## Stacks Tecnológicos Basados en JavaScript

Los siguientes stacks representan un conjunto de tecnologías basadas en JavaScript que permiten desarrollar aplicaciones Full Stack de manera unificada:

### A. Stack MERN
* **M (MongoDB):** Base de datos NoSQL flexible.
* **E (Express.js):** Framework minimalista para construir el Back-end (API REST) en Node.js.
* **R (React):** Librería para construir el Front-end (Interfaz de Usuario).
* **N (Node.js):** Entorno de ejecución de JavaScript para el Back-end.

### B. Stack MEAN
* **M (MongoDB):** Base de datos NoSQL.
* **E (Express.js):** Back-end.
* **A (Angular):** Framework robusto para construir el Front-end.
* **N (Node.js):** Entorno de ejecución.

### C. Stack MEVN
* **M (MongoDB):** Base de datos NoSQL.
* **E (Express.js):** Back-end.
* **V (Vue.js):** Framework progresivo para construir el Front-end.
* **N (Node.js):** Entorno de ejecución.

---


## MERN vs. MEAN: Diferencias Clave

Ambos stacks comparten la base de datos (MongoDB), el framework de Back-end (Express.js) y el entorno de servidor (Node.js), diferenciándose principalmente en la tecnología de Front-end:

| Característica | Stack MERN | Stack MEAN |
| :--- | :--- | :--- |
| **Front-end UI** | **React.js** (Librería) | **Angular** (Framework) |
| **Enfoque** | Basado en componentes, declarativo, ideal para desarrollo rápido y flexible. | Basado en módulos, inyección de dependencias, ideal para aplicaciones empresariales grandes y estructuradas. |
| **Curva de Aprendizaje**| Generalmente más baja que Angular. | Generalmente más alta debido a la complejidad del framework y TypeScript. |
| **Lenguaje** | JavaScript (o TypeScript con configuración). | TypeScript (lenguaje principal). |
| **Ruta de FinGrow** | MERN es la ruta propuesta en este anexo, dada la base simple de FinGrow en JS. | MEAN es una alternativa más compleja y estructurada, ideal si la aplicación escalara a un sistema financiero masivo. |

---

## Frameworks Seleccionados para el Análisis de Escalabilidad

Para este análisis, se han seleccionado dos frameworks críticos para la migración a un stack moderno, centrándonos en el **Stack MERN** como ejemplo de ruta de evolución:

| Categoría | Framework | Propósito en la Arquitectura | Archivo de Análisis |
| :--- | :--- | :--- | :--- |
| **Front-end / UI** | **React** | Migrar la manipulación manual del DOM por un modelo de componentes reactivos y basado en estado. | [framework-react.md](./framework-react.md) |
| **Back-end / API** | **Express.js** | Crear una capa de API REST para gestionar la persistencia de datos y la lógica de negocio en el servidor. | [framework-express.md](./framework-express.md) |
