# Framework - React

**React** es una biblioteca de JavaScript de código abierto desarrollada por Facebook (Meta) para construir interfaces de usuario. Su arquitectura se basa en **componentes**: piezas de código encapsuladas y reutilizables que gestionan su propio estado y se combinan para crear interfaces complejas.

A diferencia de la manipulación tradicional del DOM, React utiliza un **DOM Virtual**. Cuando el estado de un componente cambia, React actualiza primero este DOM virtual, lo compara con la versión anterior (proceso de *Reconciliation*) y actualiza el DOM real de la manera más eficiente posible, modificando solo los nodos necesarios.

### Características Destacadas:
* **JSX (JavaScript XML):** Una extensión de sintaxis que permite escribir estructuras tipo HTML dentro de JavaScript.
* **Unidirectional Data Flow:** El flujo de datos es descendente (de padres a hijos), lo que hace que el código sea predecible y fácil de depurar.
* **Ecosistema:** Cuenta con la comunidad más grande del mercado y herramientas maduras como *React DevTools*.

## Motivación y Justificación
La elección de React para el proyecto **FinGrow** se fundamenta en la naturaleza interactiva del simulador.

1.  **Gestión de Estado Complejo:** Actualmente, FinGrow debe sincronizar manualmente los inputs del usuario, los cálculos matemáticos y la actualización visual de los resultados. React automatiza esto: al cambiar una variable de estado (ej: `ingresos`), la interfaz se repinta automáticamente sin necesidad de selectores manuales.
2.  **Modularidad:** El simulador se puede descomponer en componentes claros: `<IngresosForm />`, `<GastosList />`, `<ResultadoCard />` y `<Graficos />`. Esto facilita el mantenimiento y la escalabilidad del código.
3.  **Experiencia de Usuario (UX):** La actualización instantánea del DOM Virtual ofrece una sensación de fluidez superior a la manipulación manual del DOM.

## Nivel de Dificultad de Adaptación
**Nivel: Medio**

La migración de FinGrow a React implica un cambio de paradigma significativo:
* **Curva de Aprendizaje:** Se debe dejar de pensar en "seleccionar elementos y cambiarlos" (Imperativo) para pensar en "cómo se ve la interfaz según el estado" (Declarativo). Además, requiere aprender JSX y Hooks (`useState`, `useEffect`).
* **Esfuerzo de Refactorización:** La lógica de negocio (cálculos financieros) es reutilizable, pero toda la capa de presentación (HTML y manipulación del DOM) debe reescribirse como componentes JSX.
* **Tooling:** Requiere configurar un entorno de compilación (como Vite o Webpack) para procesar JSX, a diferencia del archivo HTML/JS estático actual.

## Ejemplo de código - "Antes y después"

Se toma como caso de estudio la función encargada de generar dinámicamente el reporte visual de gastos. A continuación, se contrasta cómo se actualiza la interfaz en la versión actual (Vanilla JS) frente a la implementación propuesta en React.

### Versión Actual: (Vanilla JS - Imperativo)
En la implementación actual, se utiliza manipulación directa del DOM. El desarrollador es responsable de crear los nodos, asignar clases, configurar estilos y limpiar el contenedor manualmente.

```javascript
// Fragmento de script.js

/**
 * Actualiza la sección visual del reporte de gastos.
 * 
 * @param {{total: Object, categorias: Object}} resultados - Resultados del reporte.
 */
function actualizarReporteGastos(resultados) {
    const { total, categorias } = resultados;
    const listaContenedor = document.getElementById('gastos-lista');
    const saldoElem = document.querySelector('#reportes .saldo-promedio strong');
    const ahorroElem = document.querySelector('#reportes .porcentaje-ahorro strong');

    listaContenedor.innerHTML = '';

    Object.entries(categorias).forEach(([categoria, valores]) => {
        if (valores.gasto <= 0) return;

        const row = document.createElement('div');
        row.classList.add('row', 'justify-content-center', 'gasto-item');

        const colNombre = document.createElement('div');
        colNombre.classList.add('col', 'gastos-list');
        const h4 = document.createElement('h4');
        h4.textContent = capitalizar(categoria);
        colNombre.appendChild(h4);

        const colBar = document.createElement('div');
        colBar.classList.add('col', 'gastos-bars');
        const bar = document.createElement('div');
        const porcentaje = total.ingresos > 0 ? (valores.gasto / total.ingresos) * 100 : 0;
        bar.style.width = `${porcentaje}%`;
        bar.classList.add('bar');
        colBar.appendChild(bar);

        row.append(colNombre, colBar);
        listaContenedor.appendChild(row);
    });

    saldoElem.textContent = `$${total.saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    ahorroElem.textContent = `${total.porcentajeAhorro}%`;
}
```
### Versión Propuesta (React - Declarativo)
Con React, la lógica de construcción de la interfaz se integra directamente en el HTML mediante JSX. No es necesario crear nodos ni manipular el DOM manualmente; React sincroniza la vista basándose en los datos recibidos.

```javascript
/**
 * Componente ReporteGastos
 * Recibe los datos como "props" y renderiza la lista automáticamente.
 */
const ReporteGastos = ({ resultados }) => {
  const { total, categorias } = resultados;

  return (
    <div id="gastos-lista">
      {Object.entries(categorias).map(([categoria, valores]) => {
        // Lógica de filtrado: Si el gasto es 0 o menor, no renderizamos nada (null)
        if (valores.gasto <= 0) return null;

        // Lógica matemática para el ancho de la barra
        const porcentaje = total.ingresos > 0 
          ? (valores.gasto / total.ingresos) * 100 
          : 0;

        // Retorno de la estructura visual (JSX)
        return (
          <div key={categoria} className="row justify-content-center gasto-item">
            {/* Nombre de Categoría */}
            <div className="col gastos-list">
              <h4>{categoria}</h4>
            </div>

            {/* Barra de Progreso */}
            <div className="col gastos-bars">
              <div 
                className="bar" 
                style={{ width: `${porcentaje}%` }} // Estilo dinámico simple
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
```