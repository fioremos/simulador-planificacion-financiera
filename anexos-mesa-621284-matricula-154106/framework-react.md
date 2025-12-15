# Framework - React

React es una librería de JavaScript de código abierto, desarrollada por Facebook (Meta), utilizada para construir **interfaces de usuario (UI)**. Su principal propósito es permitir la creación de componentes de UI reusables que gestionan su propio estado de manera eficiente y declarativa.

### Características Destacadas:
* **Modelo Basado en Componentes:** La UI se divide en piezas independientes y reutilizables.
* **Renderizado Declarativo:** Describe cómo debe verse la UI en un momento dado, y React se encarga de actualizar el DOM cuando los datos cambian.
* **Virtual DOM (VDOM):** Utiliza una representación ligera del DOM real en memoria. Esto permite a React optimizar las actualizaciones, aplicando solo los cambios necesarios, mejorando la performance.
* **JSX:** Una extensión de sintaxis que permite escribir código HTML dentro de JavaScript.

##  Motivación y Justificación para FinGrow

Elegí React para FinGrow porque resuelve directamente los desafíos de la **manipulación del DOM a gran escala y la gestión del estado de la interfaz** presentes en la implementación actual en Vanilla JS.

### Beneficios Clave:
* **Mejor Gestión de la UI (Vista):** Actualmente, la UI se actualiza manualmente a través de funciones como `crearFilaMovimiento` y `actualizarMetaCard`. React permite que la interfaz se "refleje" automáticamente cuando el estado del `Planificador` cambia (ejemplo, al agregar un movimiento), eliminando la necesidad de manipulación imperativa del DOM.
* **Componentes Reutilizables:** Elementos como el **Botón de Eliminar** o la **Fila de Movimiento** se convertirían en componentes React independientes, simplificando el mantenimiento y el desarrollo futuro.
* **Escalabilidad del Front-end:** La arquitectura basada en componentes facilita que la aplicación crezca sin generar "código espagueti" en la capa del controlador (`script.js`).

## Nivel de Dificultad de Adaptación

La adaptación de FinGrow a React sería un esfuerzo **Medio-Alto**.

### Curva de Aprendizaje:
* La curva es **Moderada**. El equipo tendría que dominar JSX, el concepto de Virtual DOM, la gestión de estado (Hooks como `useState` y `useEffect`) y el flujo de datos unidireccional de React.

### Cambios Requeridos:
* **Reescritura de la Capa de Vista:** Toda la lógica de manipulación del DOM en `script.js` (ej., `crearFilaMovimiento`, `listarMovimientos`, `actualizarMetaCard`) tendría que ser eliminada y reescrita en componentes React.
* **Integración con Modelos (Planificador):** La clase `Planificador` pasaría a ser el *Store* central. Sus métodos se llamarían desde los componentes, y los datos se inyectarían en el árbol de componentes mediante *Props* o un sistema de gestión de estado más avanzado (como Redux o Context API).
* **Configuración del Entorno:** Se requeriría configurar herramientas como Node.js, npm, Webpack o Vite para transpilar JSX y empaquetar la aplicación.

## Ejemplo de Código - "Antes y Después"

### Antes (Vanilla JavaScript / `script.js`)

La creación imperativa de un elemento de tabla se realiza manualmente en la función `crearFilaMovimiento`:

```javascript
// Fragmento de script.js:
function crearFilaMovimiento(datos, movimiento) {
    const tablaCuerpo = document.querySelector('.movimientos-table tbody');
    const fila = document.createElement('tr');

    // Crea el botón de eliminación y le añade un listener
    const boton = document.createElement('button');
    boton.addEventListener('click', () => {
        planificador.eliminarMovimiento(movimiento.id);
        fila.remove();
    });

    // Crea la celda del monto y añade la clase 'negative' si es un gasto
    const tdMonto = document.createElement('td');
    tdMonto.textContent = `$${datos.monto.toLocaleString()}`;
    if (datos.tipo.toLowerCase() === 'gasto') {
        tdMonto.classList.add('negative');
    }

    fila.append(tdBoton, tdFecha, tdCategoria, tdMonto, tdTipo);
    tablaCuerpo.appendChild(fila);
}
```

### Después (Implementación con React)

El componente se define declarativamente. React se encarga de crear el botón, aplicar la clase condicionalmente y de la eliminación a través de la gestión de estado:

```javascript
// Componente React: MovimientoFila.jsx
function MovimientoFila({ movimiento, onEliminar }) {
    const esGasto = movimiento.tipo.toLowerCase() === 'gasto';
    const montoClase = esGasto ? 'negative' : '';

    return (
        <tr data-id={movimiento.id}>
            <td>
                {/* El onClick llama a una función superior (onEliminar) que actualiza el estado del Planificador */}
                <button className="btn small" onClick={() => onEliminar(movimiento.id)}>
                    {/* Renderiza el icono de basura */}
                </button>
            </td>
            <td>{movimiento.fecha}</td>
            <td>{movimiento.categoriaNombres}</td>
            <td className={montoClase}>
                ${movimiento.monto.toLocaleString()}
            </td>
            <td>{movimiento.tipo}</td>
        </tr>
    );
}

// Fragmento de App.jsx (donde se usa el componente)
function MovimientosLista({ movimientos, planificador }) {
    const handleEliminar = (id) => {
        planificador.eliminarMovimiento(id);
        // React fuerza la re-renderización de la lista aquí
    };

    return (
        <tbody>
            {movimientos.map(mov => (
                <MovimientoFila 
                    key={mov.id} 
                    movimiento={mov} 
                    onEliminar={handleEliminar} 
                />
            ))}
        </tbody>
    );
}
```