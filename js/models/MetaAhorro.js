export default class MetaAhorro {
    #id;
    #nombre;
    #montoObjetivo;
    #fechaObjetivo;
    #montoActual;

    constructor(nombre, montoObjetivo, fechaObjetivo = null ){
        const datos = { nombre, montoObjetivo, fechaObjetivo };
        if(!MetaAhorro.validar(datos)){
            throw new Error ("Datos de meta de ahorro invalidos");
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

    /* --- Metodos funcionales --- */
    actualizarMontoActual(monto){
        if(!MetaAhorro.esMontoValido(monto)){
            throw new Error ("Monto invalido");
        }
        this.#montoActual += Number(monto);
        if(this.#montoActual > this.#montoObjetivo){
            this.#montoActual = this.#montoObjetivo;
        }
    }
    /* --- validaciones --- */

    static generarId(){
        return Date.now() + Math.floor(Math.random() * 1000);
    }
    static validar({ nombre, montoObjetivo, fechaObjetivo }){
        if (!MetaAhorro.esNombreValido(nombre)) return false;
        if (!MetaAhorro.esMontoValido(montoObjetivo)) return false;
        if (!MetaAhorro.esFechaFuturaValida(fechaObjetivo)) return false;
        return true;
    }
    static esNombreValido(nombre) {
        return typeof nombre === 'string' && nombre.trim().length >= 2;
    }
    static esMontoValido(monto){
        const num = Number(monto);
        return !isNaN(num) && num > 0;
    }
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

      toJSON() {
        return {id: this.#id,
            nombre: this.#nombre,
            montoObjetivo: this.#montoObjetivo,
            fechaObjetivo: this.#fechaObjetivo ? this.#fechaObjetivo.toISOString().split('T')[0] : null,
            montoActual: this.#montoActual
        };
    }
    static fromJSON(json) {
        const instancia = new MetaAhorro(json.nombre, json.montoObjetivo, json.fechaObjetivo);
        instancia.#id = json.id || MetaAhorro.generarId();
        instancia.#montoActual = json.montoActual ?? 0;
        return instancia;
    }
    getResumen() {
        const fecha = this.#fechaObjetivo ? this.#fechaObjetivo.toISOString().split('T')[0] : 'Sin fecha';
        return `${this.#nombre} — Objetivo: $${this.#montoObjetivo} — Progreso: $${this.#montoActual} — Fecha: ${fecha}`;
    }
}