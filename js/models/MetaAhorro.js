/**
 * Representa una meta de ahorro con seguimiento de monto y fecha objetivo.
 */
class MetaAhorro {
    #id;
    #nombre;
    #montoObjetivo;
    #fechaObjetivo;
    #montoActual;

    /**
     * Crea una nueva meta de ahorro.
     * @param {string} nombre - Nombre de la meta (mínimo 2 caracteres).
     * @param {number} montoObjetivo - Monto objetivo de la meta (mayor que 0).
     * @param {string|null} [fechaObjetivo=null] - Fecha objetivo en formato 'YYYY-MM-DD'. Opcional.
     * @throws {Error} Si los datos son inválidos.
     */
    constructor(nombre, montoObjetivo, fechaObjetivo = null ){
        const datos = { nombre, montoObjetivo, fechaObjetivo };
        if(!MetaAhorro.validar(datos)){
            throw new Error ("Datos de meta de ahorro inválidos");
        }
        this.#id = MetaAhorro.generarId();
        this.#nombre = String(nombre).trim();
        this.#montoObjetivo = Number(montoObjetivo);
        this.#fechaObjetivo = fechaObjetivo ? new Date(fechaObjetivo) : null;
        this.#montoActual = 0;
    }

    /* --- getters --- */

    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get montoObjetivo() { return this.#montoObjetivo; }
    get fechaObjetivo() { return this.#fechaObjetivo; }
    get montoActual() { return this.#montoActual; }

    /* --- Métodos funcionales --- */

    /**
     * Actualiza el monto actual de la meta, sumando el valor recibido.
     * Si el monto supera el objetivo, se ajusta al monto objetivo.
     * @param {number} monto - Monto a sumar.
     * @throws {Error} Si el monto es inválido.
     */
    actualizarMontoActual(monto){
        if(!MetaAhorro.esMontoValido(monto)){
            throw new Error ("Monto invalido");
        }
        this.#montoActual += Number(monto);
        if(this.#montoActual > this.#montoObjetivo){
            this.#montoActual = this.#montoObjetivo;
        }
    }

    /* --- Validaciones estáticas --- */

    /** @returns {number} Genera un ID único basado en la fecha y un número aleatorio. */
    static generarId(){
        return crypto.randomUUID();
    }

    /**
     * Valida un conjunto de datos para crear una meta de ahorro.
     * @param {Object} datos
     * @param {string} datos.nombre
     * @param {number} datos.montoObjetivo
     * @param {string|null} datos.fechaObjetivo
     * @returns {boolean} true si los datos son válidos.
     */
    static validar({ nombre, montoObjetivo, fechaObjetivo }){
        if (!MetaAhorro.esNombreValido(nombre)) return false;
        if (!MetaAhorro.esMontoValido(montoObjetivo)) return false;
        if (!MetaAhorro.esFechaFuturaValida(fechaObjetivo)) return false;
        return true;
    }

    /**
     * Verifica que un nombre sea válido.
     * @param {string} nombre
     * @returns {boolean}
     */
    static esNombreValido(nombre) {
        return typeof nombre === 'string' && nombre.trim().length >= 2;
    }

    /**
     * Verifica que un monto sea válido (>0).
     * @param {number} monto
     * @returns {boolean}
     */
    static esMontoValido(monto){
        const num = Number(monto);
        return !isNaN(num) && num > 0;
    }

    /**
     * Verifica que una fecha, si existe, sea futura y tenga formato YYYY-MM-DD.
     * @param {string|null} fechaStr
     * @returns {boolean}
     */
    static esFechaFuturaValida(fechaStr) {
        if (!fechaStr) return true;
        const regexFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regexFecha.test(fechaStr)) return false;
        const fecha = new Date(fechaStr);
        const hoy = new Date();
        fecha.setHours(0, 0, 0, 0);
        hoy.setHours(0, 0, 0, 0);
        return fecha > hoy;
  }
    /* ===== Serialización ===== */
    /**
     * Devuelve un objeto JSON representando la meta.
     * @returns {Object} Representación serializable de la meta.
     */
    toJSON() {
    return {id: this.#id,
        nombre: this.#nombre,
        montoObjetivo: this.#montoObjetivo,
        fechaObjetivo: this.#fechaObjetivo ? this.#fechaObjetivo.toISOString().split('T')[0] : null,
        montoActual: this.#montoActual
        };
    }

    /**
     * Crea una instancia de MetaAhorro a partir de un objeto JSON.
     * @param {Object} json - Objeto JSON con los campos de la meta.
     * @param {string} json.nombre
     * @param {number} json.montoObjetivo
     * @param {string|null} json.fechaObjetivo
     * @param {number} [json.id] - ID opcional.
     * @param {number} [json.montoActual] - Monto actual opcional.
     * @returns {MetaAhorro} Nueva instancia de MetaAhorro.
     */
    static fromJSON(json) {
        const instancia = new MetaAhorro(json.nombre, json.montoObjetivo, json.fechaObjetivo);
        instancia.#id = json.id || MetaAhorro.generarId();
        instancia.#montoActual = json.montoActual ?? 0;
        return instancia;
    }

     /**
     * Devuelve un resumen legible de la meta, incluyendo nombre, objetivo, progreso y fecha.
     * @returns {string} Resumen de la meta.
     */
    getResumen() {
        const fecha = this.#fechaObjetivo ? this.#fechaObjetivo.toISOString().split('T')[0] : 'Sin fecha';
        return `${this.#nombre} — Objetivo: $${this.#montoObjetivo} — Progreso: $${this.#montoActual} — Fecha: ${fecha}`;
    }
}