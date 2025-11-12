/**
 * Clase para planificar y gestionar movimientos financieros y metas de ahorro.
 * Permite agregar movimientos, metas de ahorro, generar reportes y exportar datos.
 */
class Planificador {
    #movimientos;
    #metasAhorro;
    #exportador;

    /**
     * Inicializa un nuevo planificador.
     */
    constructor() {
        this.#movimientos = [];
        this.#metasAhorro = [];
        this.#exportador = new Exportador();
    }

    /* ======== Gestión de Movimientos ======== */
     /**
     * Agrega un nuevo movimiento financiero.
     * @param {Object} datos - Datos del movimiento: { fecha, tipo, categoria, monto }.
     * @returns {Movimiento} - Instancia del movimiento agregado.
     * @throws {Error} - Si los datos son inválidos o falla la creación del movimiento.
     */
    agregarMovimiento(datos) {
        try {
            const movimiento = new Movimiento(
                datos.fecha,
                datos.tipo,
                datos.categoria,
                datos.monto
            );  
            this.#movimientos.push(movimiento);
            console.log('Movimiento agregado:', movimiento.toJSON());
            return movimiento;
        } catch (error) {
            throw new Error('Error al agregar movimiento: ' + error.message);
        }
    }

    /* ======== Gestión de Metas ======== */
     /**
     * Agrega una nueva meta de ahorro.
     * @param {Object} datos - Datos de la meta: { nombre, montoObjetivo, fechaObjetivo }.
     * @returns {MetaAhorro} - Instancia de la meta agregada.
     * @throws {Error} - Si los datos son inválidos o falla la creación de la meta.
     */
    agregarMetaAhorro(datos) {
        try {
            const meta = new MetaAhorro(
                datos.nombre,
                datos.montoObjetivo,
                datos.fechaObjetivo
            );
            this.#metasAhorro.push(meta);
            console.log('Meta agregada:', meta.toJSON());
            return meta;
        } catch (error) {
            throw new Error('Error al agregar meta de ahorro: ' + error.message);
        }
    }

    /* ======== Reportes ======== */
    /**
     * Genera un reporte de movimientos según los filtros recibidos.
     * @param {Object} filtros - Filtros: { fechaDesde, fechaHasta, categoria }.
     * @returns {Object} - Reporte con los datos filtrados e indicadores calculados.
     *                     {
     *                         filtros,
     *                         totalMovimientos,
     *                         ingresos,
     *                         gastos,
     *                         ahorro,
     *                         saldo,
     *                         porcentajeAhorro
     *                     }
     */
    generarReporte(filtros) {
        const datosFiltrados = this.#filtrarDatos(filtros);
        const indicadores = this.#calcularIndicadores(datosFiltrados);

        return {
        filtros,
        totalMovimientos: datosFiltrados.length,
        ...indicadores
        };
    }

    /**
     * Filtra los movimientos según un rango de fechas y categoría.
     * @private
     * @param {Object} filtros - Filtros: { fechaDesde, fechaHasta, categoria }.
     * @returns {Array<Movimiento>} - Movimientos que cumplen los filtros.
     */
    #filtrarDatos(filtros) {
        const desde = new Date(filtros.fechaDesde);
        const hasta = new Date(filtros.fechaHasta);

        return this.#movimientos.filter(mov => {
            const fecha = new Date(mov.fecha);
            const enRango = fecha >= desde && fecha <= hasta;
            const categoriaCoincide = filtros.categoria === 'Todas' || mov.categoria === filtros.categoria;
            return enRango && categoriaCoincide;
        });
    }
    
    /**
     * Calcula indicadores financieros a partir de un conjunto de movimientos.
     * @private
     * @param {Array<Movimiento>} datos - Movimientos a procesar.
     * @returns {Object} - Indicadores calculados: { ingresos, gastos, ahorro, saldo, porcentajeAhorro }.
     */
    #calcularIndicadores(datos) {
        const ingresos = datos.filter(d => d.tipo === 'ingreso').reduce((acc, cur) => acc + cur.monto, 0);
        const gastos = datos.filter(d => d.tipo === 'gasto').reduce((acc, cur) => acc + cur.monto, 0);
        const ahorro = datos.filter(d => d.tipo === 'ahorro').reduce((acc, cur) => acc + cur.monto, 0);
        const saldo = ingresos - gastos;
        const porcentajeAhorro = ingresos > 0 ? (ahorro / ingresos) * 100 : 0;

        return {
            ingresos,
            gastos,
            ahorro,
            saldo,
            porcentajeAhorro: porcentajeAhorro.toFixed(2)
       };
    }

    /* ======== Exportación ======== */
    /**
     * Exporta los movimientos o metas de ahorro a un formato y archivo específico.
     * @param {Array<string>} tipo - Tipo de datos a exportar: ['resumen-cuenta'] o ['metas'].
     * @param {string} formato - Formato de exportación: 'CSV', 'JSON', 'PDF', 'XLSX'.
     * @param {string} nombreArchivo - Nombre del archivo a generar.
     * @param {string} rutaDestino - Ruta o ubicación para guardar el archivo.
     */
    exportarDatos(tipo, formato, nombreArchivo, rutaDestino) {
        const datos =
        tipo.length === 1 && tipo[0] === 'resumen-cuenta'
        ? this.#movimientos.map(m => m.toJSON())
        : this.#metasAhorro.map(m => m.toJSON());
        
    const config = { tipo, formato, nombreArchivo, rutaDestino };

    try {
        this.#exportador.exportar(datos, config);
        console.log('Exportación exitosa.');
    } catch (error) {
        console.error('Error al exportar:', error.message);
        }
    }

    /* ======== Serialización ======== */
    /**
     * Serializa el planificador a un objeto JSON.
     * @returns {Object} - Objeto JSON con movimientos y metas de ahorro.
     */
    toJSON() {
        return {
            movimientos: this.#movimientos.map(m => m.toJSON()),
            metasAhorro: this.#metasAhorro.map(m => m.toJSON())
        };
    }

    /**
     * Crea una instancia de Planificador desde un objeto JSON.
     * @param {Object} json - Objeto JSON con estructuras de movimientos y metas.
     * @returns {Planificador} - Instancia reconstruida del planificador.
     */
    static fromJSON(json) {
        const planificador = new Planificador();
        planificador.#movimientos = json.movimientos.map(m => Movimiento.fromJSON(m));
        planificador.#metasAhorro = json.metasAhorro.map(m => MetaAhorro.fromJSON(m));
        return planificador;
    }

    /* ======== Accesores ======== */
    /** @returns {Array<Movimiento>} - Lista de todos los movimientos del planificador. */
    get movimientos() {
        return this.#movimientos;
    }

    /** @returns {Array<MetaAhorro>} - Lista de todas las metas de ahorro del planificador. */
    get metasAhorro() {
        return this.#metasAhorro;
    }
}
