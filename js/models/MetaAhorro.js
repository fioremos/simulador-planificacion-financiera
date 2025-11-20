/**
 * Representa una meta de ahorro con seguimiento de monto y fecha objetivo.
 */
export class MetaAhorro {
    #id;
    #nombre;
    #montoObjetivo;
    #fechaObjetivo;
    #montoActual;

    /**
     * Crea una nueva meta de ahorro.
     * @param {string} nombre - Nombre de la meta (mínimo 2 caracteres).
     * @param {number} montoObjetivo - Monto objetivo de la meta (no puede ser 0).
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

    /* --- Getters --- */

    /** @returns {string} ID único de la meta. */
    get id() { return this.#id; }

    /** @returns {string} Nombre de la meta. */
    get nombre() { return this.#nombre; }

    /** @returns {number} Monto objetivo establecido. */
    get montoObjetivo() { return this.#montoObjetivo; }

    /** @returns {Date|null} Fecha objetivo o null si no tiene. */
    get fechaObjetivo() { return this.#fechaObjetivo; }

    /** @returns {number} Monto actual acumulado. */
    get montoActual() { return this.#montoActual; }

    /* --- Métodos funcionales --- */

    /**
     * Actualiza el monto actual de la meta sumando el valor recibido.
     * Si excede el objetivo, se ajusta al máximo permitido.
     * También se evita que el monto baje de 0.
     * @param {number} monto - Monto a sumar (puede ser negativo).
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
        
        if(this.#montoActual < 0){
            this.#montoActual = 0;
        }
    }

    /* --- Validaciones estáticas --- */

    /**
     * Genera un ID único.
     * @returns {string} UUID generado.
     */
    static generarId(){
        return crypto.randomUUID();
    }

    /**
     * Valida un conjunto de datos para crear una meta de ahorro.
     * @param {Object} datos - Datos a validar.
     * @param {string} datos.nombre - Nombre de la meta.
     * @param {number} datos.montoObjetivo - Monto objetivo.
     * @param {string|null} datos.fechaObjetivo - Fecha objetivo.
     * @returns {boolean} true si los datos son válidos.
     */
    static validar({ nombre, montoObjetivo, fechaObjetivo }){
        if (!MetaAhorro.esNombreValido(nombre)) return false;
        if (!MetaAhorro.esMontoValido(montoObjetivo) || montoObjetivo < 0) return false;
        if (!MetaAhorro.esFechaFuturaValida(fechaObjetivo)) return false;
        return true;
    }

    /**
     * Verifica que un nombre sea válido.
     * @param {string} nombre - Nombre a validar.
     * @returns {boolean} true si es válido.
     */
    static esNombreValido(nombre) {
        return typeof nombre === 'string' && nombre.trim().length >= 2;
    }

    /**
     * Verifica que un monto sea válido (no puede ser 0 y debe ser numérico).
     * @param {number} monto - Monto a validar.
     * @returns {boolean} true si es válido.
     */
    static esMontoValido(monto){
        const num = Number(monto);
        return !isNaN(num) && monto != 0;
    }

    /**
     * Verifica que una fecha, si existe, tenga formato válido (YYYY-MM-DD) y sea futura.
     * @param {string|null} fechaStr - Fecha a validar.
     * @returns {boolean} true si es válida.
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

    /**
     * Devuelve un porcentaje alcanzado de la meta.
     * @returns {number} porcentaje alcanxzado de la meta.
     */
    getPorcentaje() {
        return Math.round((this.#montoActual / this.#montoObjetivo) * 100);
    }
    /* ===== Serialización ===== */

    /**
     * Devuelve un objeto JSON representando la meta.
     * @returns {Object} Representación serializable de la meta.
     */
    toJSON() {
        return {
            id: this.#id,
            nombre: this.#nombre,
            montoObjetivo: this.#montoObjetivo,
            fechaObjetivo: this.#fechaObjetivo ? this.#fechaObjetivo.toISOString().split('T')[0] : null,
            montoActual: this.#montoActual
        };
    }

    /**
     * Crea una instancia de MetaAhorro a partir de un objeto JSON.
     * @param {Object} json - Objeto con los datos de la meta.
     * @param {string} json.nombre - Nombre de la meta.
     * @param {number} json.montoObjetivo - Monto objetivo.
     * @param {string|null} json.fechaObjetivo - Fecha objetivo.
     * @param {string} [json.id] - ID opcional.
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
     * Devuelve un resumen legible de la meta.
     * @returns {string} Resumen de la meta.
     */
    getResumen() {
        const fecha = this.#fechaObjetivo ? this.#fechaObjetivo.toISOString().split('T')[0] : 'Sin fecha';
        return `${this.#nombre} — Objetivo: $${this.#montoObjetivo} — Progreso: $${this.#montoActual} — Fecha: ${fecha}`;
    }
}
