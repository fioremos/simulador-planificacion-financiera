# Frameworks React

React es una biblioteca de JavaScript desarrollada por Facebook para la construcción de interfaces de usuario. Está basada en componentes reutilizables y en un modelo de renderizado eficiente mediante un Virtual DOM.  
Su principal objetivo es facilitar la creación de interfaces dinámicas, escalables y fáciles de mantener.

### Características destacadas
- Arquitectura basada en componentes.
- Uso del Virtual DOM para mejorar el rendimiento.
- Flujo de datos unidireccional.
- Amplio ecosistema y comunidad.

---

### Motivación y justificación

La elección de React se fundamenta en la necesidad de mejorar la estructura del frontend del proyecto. Actualmente, el manejo de la interfaz con JavaScript puro puede volverse complejo a medida que la aplicación crece.  
React permitiría:
- Separar claramente la lógica de la interfaz en componentes.
- Reutilizar código de forma eficiente.
- Facilitar el mantenimiento y la evolución del sistema.
- Mejorar la experiencia del usuario mediante una interfaz más dinámica.

---

### Nivel de dificultad de adaptación

El nivel de dificultad de adaptación es **medio**.  
Si bien React introduce nuevos conceptos (JSX, componentes, hooks, estado), su curva de aprendizaje es progresiva y bien documentada.

Cambios requeridos:
- Reestructuración del frontend en componentes.
- Incorporación de un entorno de desarrollo (NodeJS + npm).
- Separación clara entre frontend y backend.

---

### Ejemplo de código – Antes y después

#### Antes (Vanilla JavaScript)
[extracto](../index.html#440)
```html
<div class="form-actions">
  <button type="submit" class="btn btn-inverse btn-blue">
    Agregar movimiento
  </button>
</div>
```
[extracto](../js/script.js#187)
```js
document
  .querySelector("#form-dashboard-modal")
  .addEventListener("submit", manejarMovimientoSubmit);
```

#### Despues (React)
```jsx
import { useState } from "react";

function FormMovimiento() {
  const [monto, setMonto] = useState("");

  const manejarMovimientoSubmit = (event) => {
    event.preventDefault();
    console.log("Monto:", monto);
  };

  return (
    <form onSubmit={manejarMovimientoSubmit}>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="Monto"
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-inverse btn-blue">
          Agregar movimiento
        </button>
      </div>
    </form>
  );
}

export default FormMovimiento;
```
