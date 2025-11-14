/**
 * Clase para planificar y gestionar movimientos financieros y metas de ahorro.
 * Permite agregar movimientos, metas de ahorro, generar reportes.
 */
class Planificador {
    #movimientos;
    #metasAhorro;
    #filtros;

    /**
     * Inicializa un nuevo planificador.
     */
    constructor() {
        this.#movimientos = [];
        this.#metasAhorro = [];
        this.#filtros = {   fechaAscii: "",
                            fechaDesde: "",
                            fechaHasta: "",
                            categoria: "Todas",
                            moneda: "ARS"};
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
            let meta=null;
            if(datos.objetivo){
                meta = this.#metasAhorro.filter(obj => obj.id === datos.objetivo);
                if(!meta){
                    console.log('Meta de ahorro invalida');
                    return null;
                }
                meta[0].actualizarMontoActual(datos.monto);
            }
            
            const movimiento = new Movimiento(
                datos.fecha,
                datos.tipo,
                datos.categoria,
                datos.monto,
                datos.objetivo
            );
            this.#movimientos.push(movimiento);
            console.log('Movimiento agregado:', movimiento.toJSON());
            return movimiento;
        } catch (error) {
            throw new Error('Error al agregar movimiento: ' + error.message);
        }
    }

    eliminarMovimiento(idAEliminar) {
        try {
            const indice = this.#movimientos.findIndex(m => m.id === idAEliminar);
            const movimiento = this.#movimientos[indice];
            let meta=null;
            if(movimiento.idObjetivo){
                meta = this.#metasAhorro.filter(obj => obj.id === movimiento.idObjetivo)[0];
                meta.actualizarMontoActual(-movimiento.monto);    
            }

            if (indice !== -1) {
                this.#movimientos.splice(indice, 1);
                return true; // Eliminado con éxito
            }

            return false; // No se encontró
        } catch(error) {
            throw new Error('Error al eliminar movimiento: ' + error.message);
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
     * @param {Object} filtrosNuevos - Filtros: { fechaDesde, fechaHasta, categoria }.
     * @param {String} - Fecha en formato ASCII.
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
    generarReporte(filtrosNuevos, fechaAscii) {
        const datosFiltrados = this.#filtrarDatos(filtrosNuevos);
        const indicadores = this.#calcularIndicadores(datosFiltrados);
        const { fechaDesde, fechaHasta, categoria, moneda } = filtrosNuevos;

        this.filtros.fechaAscii = fechaAscii;
        this.filtros.categoria = categoria;
        this.filtros.moneda = moneda;
        this.filtros.fechaHasta = fechaHasta;
        this.filtros.fechaDesde = fechaDesde;

        return {
            filtrosNuevos,
            datosFiltrados,
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
        // Asegurar que siempre trabajamos con Date
        const fechaDesde = new Date(filtros.fechaDesde);
        const fechaHasta = new Date(filtros.fechaHasta);

        // Normalizar eliminando hora/milisegundos
        const desde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate());
        const hasta = new Date(fechaHasta.getFullYear(), fechaHasta.getMonth(), fechaHasta.getDate());

        return this.#movimientos.filter(mov => {
            // Asegurar que siempre trabajamos con Date
            const fechaMov = new Date(mov.fecha);
            // Normalizar eliminando hora/milisegundos
            const fecha = new Date(fechaMov.getFullYear(), fechaMov.getMonth(), fechaMov.getDate());

            const enRango = fecha >= desde && fecha <= hasta;
            const categoriaCoincide =
                filtros.categoria === 'Todas' ||
                mov.categoria.toLowerCase() === filtros.categoria.toLowerCase() ||
                (mov.categoria.toLowerCase() === "sueldo" && mov.tipo.toLowerCase() === "ingreso");

            return enRango && categoriaCoincide;
        });
    }

    /**
     * Calcula indicadores financieros a partir de un conjunto de movimientos.
     * @private
     * @param {Array<Movimiento>} datos - Movimientos a procesar.
     * @returns {Object} - Indicadores calculados:   total: { ingresos, gastos, ahorro, saldo, porcentajeAhorro }, categorias.
     */
    #calcularIndicadores(datos) {
    const categorias = {};

    datos.forEach(d => {
        if (!categorias[d.categoria]) {
            // Inicializamos los totales de cada categoría
            categorias[d.categoria] = { ingreso: 0, gasto: 0, ahorro: 0 };
        }

        // Sumamos el monto según el tipo
        if (d.tipo === 'ingreso') {
            categorias[d.categoria].ingreso += d.monto;
        } else if (d.tipo === 'gasto') {
            categorias[d.categoria].gasto += d.monto;
        } else if (d.tipo === 'ahorro') {
            categorias[d.categoria].ahorro += d.monto;
        }
    });


    // Totales generales
    const ingresos = datos.filter(d => d.tipo === 'ingreso').reduce((acc, cur) => acc + cur.monto, 0);
    const gastos = datos.filter(d => d.tipo === 'gasto').reduce((acc, cur) => acc + cur.monto, 0);
    const ahorro = datos.filter(d => d.tipo === 'ahorro').reduce((acc, cur) => acc + cur.monto, 0);
    const saldo = ingresos - gastos;
    const porcentajeAhorro = ingresos > 0 ? (ahorro / ingresos) * 100 : 0;

    return {
        total: { ingresos, gastos, ahorro, saldo, porcentajeAhorro: porcentajeAhorro.toFixed(2) },
        categorias
        };
    }


    /* ======== Serialización ======== */
    /**
     * Serializa el planificador a un objeto JSON.
     * @returns {Object} - Objeto JSON con movimientos y metas de ahorro.
     */
    localToJSON() {
        return {
            movimientos: this.movimientos.map(m => m.toJSON()),
            metasAhorro: this.metasAhorro.map(m => m.toJSON())
        };
    }   

    /**
     * Serializa el planificador a un objeto JSON.
     * @returns {Object} - Objeto JSON con movimientos y metas de ahorro.
     */
    sessionToJSON() {
        return {
            filtros: JSON.stringify(this.filtros)
        };
    }

    /**
     * Crea una instancia de Planificador desde un objeto JSON.
     * @param {Object} json - Objeto JSON con estructuras de movimientos y metas.
     * @returns {Planificador} - Instancia reconstruida del planificador.
     */
    static localFromJSON(json) {
        const planificador = new Planificador();

        if (json){
            planificador.movimientos = json.movimientos.map(m => Movimiento.fromJSON(m));
            planificador.metasAhorro = json.metasAhorro.map(m => MetaAhorro.fromJSON(m));
        }    

        return planificador;
    }

    /**
     * Crarga la instancia de Planificador desde un objeto JSON.
     * @param {Object} jsonFiltros - Objeto JSON con estructuras de filtros.
     */
    static sessionRepFromJSON(jsonFiltros) {
        if (jsonFiltros)
            this.filtros = jsonFiltros;
    }


    /* ======== Accesores ======== */
    /* ======== Setters ======== */
    set filtros(nuevosFiltros) {
        if (nuevosFiltros && typeof nuevosFiltros === 'object')
        this.#filtros = nuevosFiltros;
    }

    set metasAhorro(nuevasMetas) {
        if ( nuevasMetas && Array.isArray(nuevasMetas))
            this.#metasAhorro = nuevasMetas;
    }
    
    set movimientos(nuevosMovimientos) {
        if ( nuevosMovimientos && Array.isArray(nuevosMovimientos))
            this.#movimientos = nuevosMovimientos;
    }

    /* ======== Getters ======== */
    get filtros() {
        return this.#filtros;
    }
    get metasAhorro() {
        return this.#metasAhorro;
    }
    get movimientos() {
        return this.#movimientos;
    }
}
