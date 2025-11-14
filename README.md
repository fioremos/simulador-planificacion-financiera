# 🌐 Simulador de Planificación Financiera

---

## 📖 Descripción
El proyecto consiste en el desarrollo de una aplicación web interactiva que permita a los usuarios **gestionar su economía personal**, registrar ingresos y gastos, establecer metas de ahorro, controlar inversiones y recibir sugerencias personalizadas para mejorar sus hábitos financieros.  
Este simulador busca ser una herramienta práctica y educativa para mejorar la planificación financiera diaria.

---

## 🎯 Objetivos del Proyecto
- Proporcionar un simulador accesible para la **organización financiera personal**.  
- Permitir a los usuarios **visualizar su situación económica** mediante reportes y estadísticas.  
- Incentivar la **cultura del ahorro** y la toma de decisiones financieras responsables.  
- Desarrollar una plataforma modular, escalable y fácil de usar.  

## 📚 Funcionalidades previstas
1. **Autenticación de usuarios** (registro, inicio y cierre de sesión, posibilidad de autenticación externa con Google).  
2. **Gestión de ingresos y gastos** con categorías, fecha, monto y notas.  
3. **Metas de ahorro** con indicadores visuales de progreso.  
4. **Gestión de inversiones** (registro, rendimiento esperado, ganancias/pérdidas).  
5. **Perfil de usuario y configuración** (datos personales, moneda preferida, categorías personalizadas).  
6. **Recomendaciones personalizadas** basadas en hábitos financieros.  
7. **Guardado automático** de cambios (evaluar también botón de guardar manual).  
8. **Visualización de reportes y estadísticas** con gráficos y filtros por fechas/categorías.  
9. **Historial y auditoría** de movimientos.  
10. **Accesibilidad y multiplataforma** (PC, tablet, móvil).  
11. **Exportación de datos** en formatos estándar (CSV, PDF).

## 🧩 Diseño y Prototipo Visual
El producto final que se planea obtener es una aplicación web con un diseño claro y responsivo, centrado en la **planificación financiera personal**.  

Visualmente, el sistema deberá contar con:  
- **Pantalla de inicio de sesión / registro** para autenticación de usuarios.  
- **Dashboard principal** con resumen del saldo disponible, evolución de ingresos/gastos y accesos rápidos a metas e inversiones.  
- **Secciones específicas** para:  
  - Registro y gestión de ingresos/egresos.  
  - Visualización y actualización de metas de ahorro.  
  - Control de inversiones con indicadores de rendimiento.  
  - Perfil de usuario y configuraciones.  
- **Gráficos e indicadores visuales** que faciliten la interpretación de datos financieros.  
- **Diseño responsivo** pensado para PC, tablet y móvil, con tipografías legibles y contraste adecuado.  

Esta maqueta refleja el **qué** queremos lograr en términos visuales, sin definir aún el **cómo** se implementará técnicamente.

---

### 🔗 Acceso al mockup
El diseño preliminar de la aplicación se encuentra disponible en Figma en el siguiente enlace: 
- [Ver mockup en Figma](https://www.figma.com/design/hbgGq77CAkDgbxAwc45AII/Simulador-de-planificaci%C3%B3n-financiera?node-id=0-1&t=ZH1SSly6d7Zphetx-1)

---

## ✅ Objetivos de la primer entrega (5/9/2025)
Esta entrega tiene como propósito presentar la primera versión del proyecto, estableciendo una base sólida sobre la cual se desarrollará el simulador de planificación financiera. 
Esta versión inicial establece la base técnica, visual y documental para el desarrollo futuro.

En esta etapa se busca:
- Definir y estructurar el repositorio inicial del proyecto.
- Desarrollar una primera versión de la página web utilizando HTML5.
- Documentar el proyecto en un archivo `README.md`, incluyendo una descripción general, objetivos, tecnologías utilizadas y funcionalidades previstas.
- Diseñar un mockup preliminar que represente la visión visual del producto final, ubicado en `docs/01-mockup/mockup.png` y referenciado en el README.
- Documentar al menos cinco prompts de inteligencia artificial utilizados durante esta fase, almacenados en `docs/02-prompts/`.

El resultado esperado es un repositorio bien organizado en GitHub, con una estructura clara de ramas, una página inicial funcional, un diseño visual representativo del producto y documentación completa del proceso y las herramientas utilizadas.

---

## ✅ Objetivos de la segunda entrega (26/9/2025)  
Esta segunda entrega tiene como propósito mejorar el diseño visual y estructural de la página web, estableciendo las bases de estilos CSS y diseño responsive que servirán como punto de partida para futuras funcionalidades.

En esta etapa se busca: 
- Implementar hojas de estilo en cascada (CSS3) para mejorar la legibilidad, la estética y la organización del contenido.  
- Aplicar selectores, herencia y box model para estructurar el diseño con buenas prácticas.  
- Diseñar layouts responsive mediante flexbox, grid y media queries, asegurando la correcta visualización en dispositivos móviles, tablets y escritorio.  
- Actualizar y documentar los mockups que reflejan los cambios aplicados al diseño.  
- Implementar un plan de testing cross-browser y responsive, utilizando herramientas profesionales y documentando los resultados en la carpeta `/docs/03-testing/`.  
- Mantener actualizado el `README.md`, el `changelog.md` y la estructura del repositorio en GitHub.  

El resultado esperado es un repositorio organizado, con estilos aplicados al diseño base, documentación técnica clara y pruebas que validen la correcta visualización en múltiples dispositivos y navegadores.

---

## ✅ Objetivos del primer parcial (6/10/2025)
Esta entrega tiene como propósito presentar la versión integrada y funcional del proyecto, aplicando conceptos de HTML5, CSS3 y Bootstrap, y consolidando el flujo de trabajo en equipo con GitHub.

En esta etapa se busca:
- Migrar la aplicación a Bootstrap, utilizando componentes y utilidades para mejorar la responsividad y accesibilidad.

- Implementar componentes avanzados de HTML5 y Bootstrap (ej.: sidebar, modales, formularios enriquecidos, tablas responsivas).

- Mantener y organizar el repositorio bajo buenas prácticas de DevOps, incluyendo ramas (master, develop, release/primer-parcial) y gestión de PRs.

- Documentar el proyecto en un archivo `README.md`, con descripción general, roles asignados, tecnologías utilizadas, estructura de carpetas y enlaces a los mockups actualizados.

- Mantener actualizado el archivo changelog.md con las contribuciones de cada miembro y versiones del proyecto.

- Incorporar mockups actualizados en Bootstrap, almacenados en `docs/01-mockup/disenio-bootstrap.png`.

- Documentar los procesos de testing y validación, en `docs/03-testing/testing-doc.md`.

- Gestionar tareas mediante Issues y GitHub Projects (Kanban), asegurando trazabilidad y asignación de responsabilidades.

- Generar una release formal en GitHub, con tag de versión, changelog y enlaces relevantes.

El resultado esperado es un repositorio unificado y limpio, con una versión navegable del simulador en GitHub Pages, incluyendo diseño adaptativo, componentes de Bootstrap aplicados, documentación completa y gestión de equipo transparente.

---

## ✅ Objetivos de la tercera entrega (24/10/2025)
Esta tercera entrega tiene como propósito integrar la lógica de negocio fundamental del proyecto mediante el uso de JavaScript, aplicando estructuras de control, funciones, arrays y objetos para simular el comportamiento del sistema. Además, se incorpora el testing automatizado con Jasmine y la documentación de diagramas de actividades en PlantUML, consolidando así la fase de programación funcional antes de la manipulación del DOM.

En esta etapa se busca:
- Implementar la lógica central del simulador o aplicación, utilizando algoritmos condicionales (`if`, `else if`, `switch`) y estructuras de repetición (for, while) para procesar datos y tomar decisiones.
- Desarrollar funciones modulares, reutilizables y testeables, aplicando principios de responsabilidad única, parámetros y valores de retorno.
- Integrar arrays y objetos para representar datos y comportamientos relevantes al contexto del proyecto.
- Implementar cuatro flujos de trabajo principales, cada uno con estructura: **entrada → proceso → salida**, ejecutables desde un menú principal mediante `prompt()`.
- Garantizar la validez y coherencia de las entradas del usuario, mostrando los resultados con `alert()` y/o `console.log()`.
- Documentar y representar los flujos desarrollados mediante diagramas de actividades en **PlantUML**, incluyendo decisiones, ciclos y particiones de responsabilidad (usuario/sistema).
- Incorporar una suite de testing automatizado con **Jasmine**, validando la funcionalidad de los flujos principales mediante casos de prueba de éxito, casos borde, validaciones de error y operaciones con arrays y objetos.
- Documentar el proceso de testing en `js/test/testing-doc.md`, detallando la ejecución de pruebas, cobertura y resultados.
- Mantener actualizado el repositorio con ramas organizadas por feature, commits individuales por rol, y gestión de tareas mediante Issues.
- Asegurar la integración controlada de ramas hacia develop y la publicación de una release formal `(v1.1-tercera-entrega)` en GitHub con `changelog` y enlaces relevantes.
- Actualizar el `README.md` con la descripción de la entrega, las tecnologías utilizadas y los enlaces a la documentación generada (diagramas, testing y mockups).

El resultado esperado es un proyecto funcional y estructurado, con la lógica de negocio completamente implementada en `JavaScript`, respaldada por diagramas, pruebas automatizadas y documentación técnica coherente con las buenas prácticas de desarrollo colaborativo.

---

## ✅ Objetivos de la cuarta entrega (14/11/2025)
La cuarta entrega tiene como objetivo transformar el simulador basado en prompt() y alert() en una aplicación web completamente interactiva, utilizando manipulación del DOM, eventos del usuario, Programación Orientada a Objetos y almacenamiento persistente mediante la Storage API. Esta etapa marca el paso desde la programación funcional hacia una arquitectura orientada a objetos, modular y escalable, consolidando además las bases técnicas necesarias para el Segundo Parcial Integrador.

En esta fase se desarrolla una interfaz web moderna que reemplaza todas las entradas y salidas por elementos HTML, integrando formularios, botones y componentes visuales que reaccionan mediante listeners de eventos. La lógica del proyecto se reorganiza en clases dentro de js/models/, mientras que el archivo js/script.js actúa como controlador, gestionando la comunicación entre la interfaz y el modelo. Se implementan validaciones en tiempo real y retroalimentación visual para mejorar la experiencia del usuario.

Además, se incorpora persistencia mediante localStorage y sessionStorage, permitiendo almacenar y recuperar datos del usuario con operaciones CRUD encapsuladas en js/utils/storage.js. La arquitectura se reorganiza en módulos separados para mejorar la responsabilidad, mantenibilidad y escalabilidad del código.

La entrega incluye también la actualización del sistema de testing automatizado con Jasmine, validando las nuevas clases, operaciones de almacenamiento y flujos principales controlados por DOM. Se actualizan los diagramas en PlantUML, incluyendo el diagrama de clases que representa la nueva estructura orientada a objetos.

El repositorio se mantiene organizado con ramas por feature, commits documentados y releases versionadas, integrando además documentación actualizada en el README.md sobre la arquitectura, las tecnologías utilizadas y los recursos generados.

El resultado final es una aplicación web interactiva, modular, persistente y testeada, con una arquitectura más sólida y profesional que da continuidad al desarrollo iniciado en las entregas anteriores.

---


## 👨‍💻 Tecnologías Utilizadas
- **HTML5** (estructura inicial).  
- **CSS3** (maquetación principal, estilos de componentes y diseño responsive).  
- **Bootstrap** (framework para diseño responsive y componentes reutilizables).
- **JavaScript (ES6+)** implementación de la lógica de negocio mediante:    
  - Algoritmos condicionales y estructuras de control (`if`, `else if`, `switch`, `for`, `while`).
  - Funciones modulares con parámetros y valores de retorno.
  - Simulación de flujos de trabajo interactivos mediante prompt(), alert() y console.log().
  - Visualización de datos con Chart.js.
  - Manipulación completa del DOM (creación/actualización/eliminación de elementos).
  - Manejo de eventos: click, submit, input, change, etc.
  - Programación Orientada a Objetos (POO): Clases de dominio. Encapsulamiento, métodos internos y relaciones entre clases.
  - Controlador principal: Manejo de eventos. Coordinación entre vista (DOM) y lógica de negocio.
  - Storage API (localStorage / sessionStorage): Persistencia de datos con operaciones CRUD. Serialización mediante JSON.
- **PlantUML** (creación de diagramas de actividades que documentan los flujos principales del sistema).  
- **Git / GitHub** (control de versiones).  
- **Herramientas de Testing**  
  - **BrowserStack** (compatibilidad cross-browser y mobile).  
  - **Lighthouse / PageSpeed Insights** (performance y accesibilidad).  
  - **WAVE / axe DevTools** (testing de accesibilidad).  
  - **LambdaTest / CSS Validator / HTML Validator** (validación multiplataforma y de estándares). 
  - **Jasmine** (framework de testing automatizado en navegador, utilizado para validar funciones, cálculos y operaciones con datos). 
- **Slack** (comunicación y notificación de entregas).  
- (Opcional futuras integraciones) OAuth (Google), bibliotecas de gráficos (Chart.js o Recharts).

---

## 📁 Documentación
- 🖼️ [Mockup diseño inicial](docs/01-mockup/diseño-inicial.png)
- 🖼️ [Mockup diseño con css](docs/01-mockup/disenio-con-css.png)
- 🖼️ [Mockup diseño con bootstrap](docs/01-mockup/disenio-bootstrap.png)
- 🖼️ [Mockup diseño con bootstrap mobile](docs/01-mockup/disenio-bootstrap-mb.png)
- 🗂️ [Índice de Prompts](docs/02-prompts/prompts.md)
- 🧪 [Índice de Test Cases](docs/03-testing/testing-doc.md)
- 📊 [Índice de Diagramas de Actividades](docs/04-diagramas/diagramas-doc.md)
- 📊 [Índice de Diagramas de Clase](docs/04-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md)
- 🧪 [Índice de Test Cases(Jasmine)](js/test/testing-doc.md)
- 📜 [Changelog](changelog.md)

---

## 👥 Integrantes del Grupo
|     Nombre completo    | N° de Matrícula | Usuario GitHub |         Rol en esta entrega                           |
|------------------------|-----------------|----------------|-------------------------------------------------------|
|    Sol Ailen Kalpuj    |      154106     |   @skalapuj    |      Coordinador / DevOps + Tester QA                 | 
|     Fiorella Mosca     |      154108     |   @fioremos    |      Desarrollador JS Eventos + DOM                   | 
| Matías Nicolás Escobar |      151251     |   @MNEscobar   |      Desarrollador JS POO (Lógica de Negocio)         |  
|     Ulises Capriles    |      146291     |   @UlisesC11   |       Desarrollador JS Local y Session Storage        |  

<pre>
🎓 Datos Académicos
<b>Carrera</b>: Tecnicatura Universitaria en Programación de Sistemas
<b>Materia</b>: Programación Web I
<b>Docente</b>: Velasquez Rojas, Matias Alejandro 
</pre>  

---