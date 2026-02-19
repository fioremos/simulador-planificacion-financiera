# Anexo - "Frameworks y Node JS"

## Ecosistema de Frameworks y Herramientas JavaScript

El desarrollo web moderno con JavaScript se apoya en una variedad de herramientas y marcos de trabajo (frameworks) diseñados para resolver problemas comunes, estandarizar la arquitectura del código y mejorar la eficiencia del desarrollo. Estas tecnologías se pueden categorizar según su función dentro de la arquitectura de software:

### Frameworks y Librerías de Frontend (Cliente)

Su objetivo principal es la construcción de interfaces de usuario interactivas y reactivas. Permiten desarrollar Single Page Applications (SPAs) donde la experiencia de usuario es fluida.
 * **React:** Una librería focalizada en la creación de interfaces mediante componentes reutilizables y la gestión eficiente del estado de la aplicación.
 * **Vue.js:** Un framework progresivo que permite una adopción incremental, destacando por su facilidad de integración y curva de aprendizaje moderada.
 * **Angular:** Una plataforma completa que ofrece una solución robusta y estructurada (MVC), ideal para aplicaciones empresariales escalables.

### Frameworks de Backend (Servidor)

Permiten ejecutar JavaScript en el servidor (gracias a Node.js), gestionando la lógica de negocio, las conexiones a bases de datos y la creación de APIs RESTful.
* **Express.js:** El estándar de facto para Node.js. Es un framework minimalista y flexible que proporciona las herramientas fundamentales para servidores web sin imponer una arquitectura rígida.
* **NestJS:** Un framework progresivo para Node.js que utiliza TypeScript y está fuertemente inspirado en la arquitectura de Angular (módulos, controladores, inyección de dependencias), favoreciendo la escalabilidad y el mantenimiento. 

---

## Stacks Tecnológicos: MERN y MEAN

La combinación de estas herramientas da lugar a "Stacks" estandarizados que cubren todo el ciclo de desarrollo. En el ecosistema actual de JavaScript, los más populares para aplicaciones Full Stack son:

### MERN Stack: 

   Compuesto por **MongoDB** (Base de datos), **Express.js** (Backend), **React** (Frontend) y **Node.js.**(Entorno de ejecución)   
   - **Características:** Se destaca por el uso de React, lo que otorga una gran flexibilidad en el desarrollo de la interfaz. El flujo de datos es unidireccional y utiliza un Virtual DOM para optimizar el rendimiento. Es ideal para aplicaciones que 
   requieren una alta interactividad y actualizaciones constantes en la UI.   

### MEAN Stack: 

   Compuesto por **MongoDB**, **Express.js**, **Angular** y **Node.js**.    
   - **Características:** A diferencia de MERN, utiliza **Angular** en el frontend. Esto implica una estructura más estricta y completa que incluye enrutamiento, validaciones y cliente HTTP nativos. Es preferido en entornos corporativos donde se busca una arquitectura homogénea y tipado estricto con TypeScript.  

---

## MERN vs MEAN

| Característica | MERN Stack | MEAN Stack |
| :--- | :--- | :--- |
| **Frontend** | Librería (React): Flexible y centrada en la UI. | Framework (Angular): Estructura completa MVC. |
| **Lenguaje** | JavaScript / JSX. | TypeScript (Estándar obligatorio). |
| **Curva de Aprendizaje** | Moderada: Requiere aprender JSX y el ciclo de vida de componentes. | Alta: Requiere aprender muchos conceptos nuevos. |
| **Flujo de Datos** | Unidireccional. | Bidireccional. |
| **Estructura** | Libre: Tú eliges las librerías adicionales. | Opinada: Trae todo incluido (Router, HTTP, etc). |
| **Rendimiento** | Utiliza el Virtual DOM, actualizando solo los cambios necesarios en el DOM real. | Utiliza el DOM real, optimizado mediante detección de cambios incremental. | 
| **Uso Ideal** | Aplicaciones ágiles, SPAs, Startups. | Aplicaciones corporativas grandes y estrictas. |

---

### Estado Actual del Desarrollo

Desde un análisis técnico, la versión actual de **FinGrow** opera bajo una arquitectura de **Single Page Application (SPA)**, desarrollada íntegramente en **Vanilla JavaScript** y adherida a los estándares de ES6.    
La capa de persistencia de datos se resuelve actualmente en el lado del cliente, utilizando las APIs de almacenamiento web gestionadas a través de la clase auxiliar `StorageUtil`.    
Si bien esta arquitectura satisface los requisitos funcionales de un entorno de simulación local, presenta limitaciones en cuanto a portabilidad y seguridad de la información. Por eso para escalar el proyecto hacia un entorno de producción distribuido y multiusuario, resulta imperativo migrar la estrategia de persistencia hacia un servidor centralizado. Esta evolución implica la transición hacia una **arquitectura Full Stack**, donde se desacoplan las responsabilidades:

1.  **Front-end:** Encargado de la interfaz de usuario (UI) y la experiencia interactiva.
2.  **Back-end:** Encargado de la lógica de negocio, autenticación y gestión de base de datos a través de una API.

---

### FrameWork elegidos
Para potenciar el **Simulador de Planificación Financiera** y evolucionarlo hacia una arquitectura más escalable y moderna, se han seleccionado los siguientes frameworks del ecosistema JavaScript:

* **Frontend:** [React](framework-react.md)
* **Backend:** [Express.js](framework-express.md)

---
*Mesa N° 630303 - N° Matricula 151251 - Tecnicatura Universitaria en Programación de Sistemas*