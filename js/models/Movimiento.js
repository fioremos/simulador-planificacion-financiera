/**
 * Clase que representa un movimiento financiero.
 * Permite crear movimientos de tipo ingreso, gasto, ahorro o inversión,
 * validar los datos, serializar y generar un resumen.
 */
class Movimiento {
    #id;
    #fecha;
    #tipo;
    #categoria;
    #monto;
    #idObjetivo;

    /**
     * Crea un nuevo movimiento financiero.
     * @param {string|Date} fecha - Fecha del movimiento (YYYY-MM-DD o Date).
     * @param {string} tipo - Tipo de movimiento: 'ingreso', 'gasto', 'ahorro', 'inversión'.
     * @param {string} categoria - Categoría del movimiento: 'hogar', 'ocio', 'salud', 'sueldo', 'objetivos', 'otros'.
     * @param {number} monto - Monto del movimiento (positivo).
     * @throws {Error} - Si los datos no son válidos.
     */
    constructor(fecha, tipo, categoria, monto, idObjetivo=null){
        const datos = { fecha, tipo, categoria, monto };
        if(!Movimiento.validar(datos)){
            throw new Error ("Datos de movimiento inválidos");
        }
        this.#id = Movimiento.generarId();
        this.#fecha = (fecha instanceof Date) ? fecha : new Date(fecha);
        this.#tipo = Movimiento.normalizarTipo(tipo);
        this.#categoria = Movimiento.normalizarCategoria(categoria);
        this.#monto = Number(monto);
        this.#idObjetivo = idObjetivo;
    }

    /* --- getters --- */
    
    get id() { return this.#id; }
    get fecha() { return this.#fecha; }
    get tipo() { return this.#tipo; }
    get categoria() { return this.#categoria; }
    get monto() { return this.#monto; }
    get idObjetivo() { return this.#idObjetivo; }

    /* --- validaciones --- */

    /**
     * Genera un ID único para el movimiento.
     * @returns {number} - ID único basado en timestamp + número aleatorio.
     */
    static generarId(){
        return crypto.randomUUID();
    }
    
    /**
     * Normaliza el tipo a minúsculas y elimina espacios.
     * @param {string} tipo
     * @returns {string}
     */
    static normalizarTipo(tipo){
        return String(tipo).trim().toLowerCase();
    }

    /**
     * Normaliza la categoría a minúsculas y elimina espacios.
     * @param {string} categoria
     * @returns {string}
     */
    static normalizarCategoria(categoria){
        return String(categoria).trim().toLowerCase();
    }

    /**
     * Valida todos los datos de un movimiento.
     * @param {Object} datos - { fecha, tipo, categoria, monto }
     * @returns {boolean} - true si todos los datos son válidos.
     */
    static validar({ fecha, tipo, categoria, monto}){
        if(!Movimiento.esFechaValida(fecha)) return false;
        if(!Movimiento.esTipoValido(tipo)) return false;
        if(!Movimiento.esCategoriaValida(categoria)) return false;
        if(isNaN(Number(monto)) || Number(monto) <= 0) return false;
        return true;
    }

    /**
     * Valida que la fecha sea válida y no futura.
     * @param {string|Date} fechaInput
     * @returns {boolean}
     */
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

    /**
     * Valida que el tipo esté dentro de los permitidos.
     * @param {string} tipo
     * @returns {boolean}
     */
    static esTipoValido(tipo) {
        if (!tipo) return false;
        const tiposValidos = ['ingreso', 'ahorro', 'inversión', 'inversion', 'gasto'];
        return tiposValidos.includes(String(tipo).trim().toLowerCase());
    }

    /**
     * Valida que la categoría esté dentro de las permitidas.
     * @param {string} categoria
     * @returns {boolean}
     */
    static esCategoriaValida(categoria) {
        if (!categoria) return false;
        const categoriasValidas = ['hogar', 'ocio', 'salud', 'sueldo', 'objetivos', 'otros'];
        return categoriasValidas.includes(String(categoria).trim().toLowerCase());
    }

    /* --- serialización --- */

    /**
     * Serializa el movimiento a un objeto JSON.
     * @returns {Object} - { id, fecha, tipo, categoria, monto }
     */
    toJSON(){
        return {
            id: this.#id,
            fecha: this.#fecha.toISOString().split('T')[0],
            tipo: this.#tipo,
            categoria: this.#categoria,
            monto: this.#monto,
            idObjetivo: this.#idObjetivo
        };
    }

    /**
     * Crea una instancia de Movimiento desde un objeto JSON.
     * @param {Object} json - Objeto con los datos del movimiento.
     * @returns {Movimiento} - Instancia reconstruida.
     */
    static fromJSON(json) {
        const instancia = new Movimiento(json.fecha, json.tipo, json.categoria, json.monto, json.idObjetivo);
        if (json.id) instancia.#id = json.id;
        return instancia;
    }

    /**
     * Genera un resumen legible del movimiento.
     * @returns {string} - Formato: 'YYYY-MM-DD - tipo - categoria - $monto'
     */
    getResumen() {
        return `${this.fecha.toISOString().split('T')[0]} - ${this.tipo} - ${this.categoria} - $${this.monto}`;
    }
}