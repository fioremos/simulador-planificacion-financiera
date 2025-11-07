export default class Movimiento {
    #id;
    #fecha;
    #tipo;
    #categoria;
    #monto;

    constructor(fecha, tipo, categoria, monto){
        const datos = { fecha, tipo, categoria, monto };
        if(Movimiento.validar(datos)){
            throw new Error ("Datos de movimiento invalidos");
        }
        this.#id = Movimiento.generarId();
        this.#fecha = (fecha instanceof Date) ? fecha : new Date(fecha);
        this.#tipo = Movimiento.normalizarTipo(tipo);
        this.#categoria = Movimiento.normalizarCategoria(categoria);
        this.#monto = Number(monto);
    }

    /* --- getters --- */
    
    get id() { return this.#id; }
    get fecha() { return this.#fecha; }
    get tipo() { return this.#tipo; }
    get categoria() { return this.#categoria; }
    get monto() { return this.#monto; }

    /* --- validaciones --- */

    static generarId(){
        return Date.now() + Math.floor(Math.random() * 1000);
    }
    static normalizarTipo(tipo){
        return String(tipo).trim().toLowerCase();
    }
    static normalizarCategoria(categoria){
        return String(categoria).trim().toLowerCase();
    }
    static validar({ fecha, tipo, categoria, monto}){
        if(!Movimiento.esFechaValida(fecha)) return false;
        if(!Movimiento.esTipoValido(tipo)) return false;
        if(!Movimiento.esCategoriaValida(categoria)) return false;
        if(isNaN(Number(monto)) || Number(monto) <= 0) return false;
        return true;
    }

    static esFechaValida(fechaInput) {
        if (!fechaInput) return false;
        const fechaStr = (fechaInput instanceof Date) ? fechaInput.toISOString().split('T')[0] : String(fechaInput).trim();
        const regexFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regexFecha.test(fechaStr)) return false;
        const fecha = new Date(fechaStr);
        const hoy = new Date();
        fecha.setHours(0,0,0,0);
        hoy.setHours(0,0,0,0);
        return fecha <= hoy;
    }    
    static esTipoValido(tipo) {
        if (!tipo) return false;
        const tiposValidos = ['ingreso', 'ahorro', 'inversión', 'inversion', 'gasto'];
        return tiposValidos.includes(String(tipo).trim().toLowerCase());
    }
    static esCategoriaValida(categoria) {
        if (!categoria) return false;
        const categoriasValidas = ['hogar', 'ocio', 'salud', 'sueldo', 'objetivos', 'otros', 'freelance'];
        return categoriasValidas.includes(String(categoria).trim().toLowerCase());
    }

    /* --- serialización --- */

    toJSON(){
        return {
            id: this.#id,
            fecha: this.#fecha.toISOString().split('T')[0],
            tipo: this.#tipo,
            categoria: this.#categoria,
            monto: this.#monto
        };
    }
    static fromJSON(json) {
        const instancia = new Movimiento(json.fecha, json.tipo, json.categoria, json.monto);
        if (json.id) instancia.#id = json.id;
        return instancia;
    }
    getResumen() {
        return `${this.fecha.toISOString().split('T')[0]} - ${this.tipo} - ${this.categoria} - $${this.monto}`;
    }
}