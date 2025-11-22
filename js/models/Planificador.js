/**
 * Importación de clases del dominio (módulos ES6)
 */
import { MetaAhorro } from './MetaAhorro.js';
import { Movimiento } from './Movimiento.js';
import { StorageUtil }  from '../utils/storage.js';

/**
 * Clase para planificar y gestionar movimientos financieros y metas de ahorro.
 * Permite agregar movimientos, metas de ahorro y generar reportes.
 */
export class Planificador {
    #movimientos;
    #metasAhorro;
    #filtros;

    /**
     * Inicializa un nuevo planificador con listas vacías y filtros por defecto.
     */
    constructor() {
        this.#movimientos = [];
        this.#metasAhorro = [];
        this.#filtros = {   
            fechaAscii: "",
            fechaDesde: "",
            fechaHasta: "",
            categoria: "Todas",
            moneda: "ARS"
        };
    }
    
    /* ======== Gestión de Movimientos ======== */

    /**
     * Agrega un nuevo movimiento financiero.
     * Si el movimiento está asociado a una meta de ahorro, actualiza su progreso.
     * @param {Object} datos - Datos del movimiento: { fecha, tipo, categoria, monto, objetivo }.
     * @returns {Movimiento|null} Instancia agregada o null si falla la validación de meta.
     * @throws {Error} Si los datos son inválidos o falla la creación del movimiento.
     */
    agregarMovimiento(datos) {
        try {
            let meta = null;

            if (datos.objetivo) {
                meta = this.#metasAhorro.filter(obj => obj.id === datos.objetivo);

                if (!meta) {
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

    /**
     * Elimina un movimiento por su ID.
     * Si el movimiento estaba asociado a una meta, ajusta su monto actual.
     * @param {string} idAEliminar - ID del movimiento a eliminar.
     * @returns {boolean} true si fue eliminado, false si no se encontró.
     * @throws {Error} Si ocurre un error al eliminar.
     */
    eliminarMovimiento(idAEliminar) {
        try {
            const indice = this.#movimientos.findIndex(m => m.id === idAEliminar);
            let meta = null;
            let movimiento;

            if (indice !== -1) {
                movimiento = this.#movimientos[indice];
            
                if (movimiento.idObjetivo) {
                    meta = this.#metasAhorro.filter(obj => obj.id === movimiento.idObjetivo)[0];
                    meta.actualizarMontoActual(-movimiento.monto);    
                }
                
                this.#movimientos.splice(indice, 1);
                return true;
            }

            return false;

        } catch(error) {
            throw new Error('Error al eliminar movimiento: ' + error.message);
        }
    }

    /**
     * Indica como son la relaciones entre categorias y tipos
     * @returns {Object} diccionario de relaciones.
     */
    getOpcionesPorTipo() {
        return {
            ingreso: ["sueldo"],
            ahorro: ["objetivos"],
            inversion: ["inversiones"],
            gasto: ["hogar", "ocio", "salud"]
        };
    }

    /* ======== Gestión de Metas ======== */

    /**
     * Agrega una nueva meta de ahorro.
     * @param {Object} datos - Datos de la meta: { nombre, montoObjetivo, fechaObjetivo }.
     * @returns {MetaAhorro} Instancia de la meta agregada.
     * @throws {Error} Si los datos son inválidos o falla su creación.
     */
    agregarMetaAhorro(datos) {
        try {
            const existe = this.#metasAhorro.some(meta => meta.nombre.toLowerCase() === datos.nombre.toLowerCase() );
            if (!existe) {
                const meta = new MetaAhorro(
                    datos.nombre,
                    datos.montoObjetivo,
                    datos.fechaObjetivo
                );
                this.#metasAhorro.push(meta);
                console.log('Meta agregada:', meta.toJSON());
                return meta;
            } else {
                throw new Error('Meta de ahorro ya existente');
            }
        } catch (error) {
            throw new Error('Error al agregar meta de ahorro: ' + error.message);
        }
    }

    /**
     * Obtiene una meta del arerglo Metasde ahorro por nombre.
     * @param {string} metaName - Nombre de la meta.
     * @returns {MetaAhorro|null} Instancia de la meta agregada.
     */
    getMetaByName(metaName) {
        return this.#metasAhorro.filter( meta => meta.nombre === metaName )[0];
    }

    /**
     * Devuelve un porcentaje acanzado de la meta.
     * @param {MetaAhorro} meta - nombre ed la meta.
     * @returns {number} porcentaje alcanxzado de la meta.
     */
    getPorcentajeMeta(meta) {
        return meta.getPorcentaje();
    }

    /* ======== Reportes ======== */

    /**
     * Genera un reporte de movimientos según los filtros recibidos.
     * @param {Object} filtrosNuevos - Filtros: { fechaDesde, fechaHasta, categoria, moneda }.
     * @param {string} fechaAscii - Fecha en formato ASCII.
     * @returns {Object} Reporte con datos filtrados e indicadores:
     * {
     *   filtrosNuevos,
     *   datosFiltrados,
     *   totalMovimientos,
     *   total: { ingresos, gastos, ahorro, saldo, porcentajeAhorro },
     *   categorias
     * }
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
     * @returns {Array<Movimiento>} Movimientos filtrados.
     */
    #filtrarDatos(filtros) {
        const fechaDesde = new Date(filtros.fechaDesde);
        const fechaHasta = new Date(filtros.fechaHasta);

        const desde = new Date(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate());
        const hasta = new Date(fechaHasta.getFullYear(), fechaHasta.getMonth(), fechaHasta.getDate());

        return this.#movimientos.filter(mov => {
            const fechaMov = new Date(mov.fecha);
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
     * @returns {Object} Indicadores calculados: 
     *   {
     *     total: { ingresos, gastos, ahorro, saldo, porcentajeAhorro },
     *     categorias
     *   }
     */
    #calcularIndicadores(datos) {
        const categorias = {};

        datos.forEach(d => {
            if (!categorias[d.categoria]) {
                categorias[d.categoria] = { ingreso: 0, gasto: 0, ahorro: 0 };
            }

            if (d.tipo === 'ingreso') {
                categorias[d.categoria].ingreso += d.monto;
            } else if (d.tipo === 'gasto') {
                categorias[d.categoria].gasto += d.monto;
            } else if (d.tipo === 'ahorro') {
                categorias[d.categoria].ahorro += d.monto;
            }
        });

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
     * Serializa movimientos y metas al formato JSON.
     * @returns {Object} Objeto JSON con movimientos y metas de ahorro.
     */
    localToJSON() {
        return {
            movimientos: this.movimientos.map(m => m.toJSON()),
            metasAhorro: this.metasAhorro.map(m => m.toJSON())
        };
    }   

    /**
     * Serializa los filtros de reporte.
     * @returns {Object} Objeto JSON con los filtros del planificador.
     */
    sessionToJSON() {
        return {
            filtros: JSON.stringify(this.filtros)
        };
    }

    /**
     * Crea una instancia de Planificador desde datos almacenados localmente.
     * @param {Object} json - Objeto con movimientos y metas serializadas.
     * @returns {Planificador} Instancia reconstruida.
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
     * Carga filtros de sesión en el planificador.
     * @param {Object} jsonFiltros - Objeto con filtros guardados.
     */
    static sessionRepFromJSON(jsonFiltros) {
        if (jsonFiltros)
            this.filtros = jsonFiltros;
    }

    /* ======= Storage Util ====== */

    /**
     * Carga las variables si existen.
     * @param {string} modulo - modulo del que se quiere obtener variables.
     * @param {string} tipo - tipo de variable (local/session)
     * @returns {Object} JSON de variables
     */
    obtenerVariables(modulo, tipo) {
        return StorageUtil.obtener('app:'+ modulo, tipo);
    }
    
    /**
     * Actualiza las variables locales existentes.
     * @param {string} tipo - tipo de modulo que lo requiere
     * @param {string} modulo - modulo del que se quiere obtener variables.
     * @param {Object} objeto - bjetoque debe actualizar variables.
     * @returns {Object} JSON de variables
     */
    actualizarLocalVariables(tipo, modulo, objeto) {
        switch (tipo) {
            case 'planificador':
                return StorageUtil.actualizar('app:' + modulo, this.localToJSON(), 'local');
            case 'exportador':
                return StorageUtil.actualizar('app:' + modulo, objeto.localToJSON(), 'local');
            default:
                return null;                
        }
    }

    /**
     * Actualiza las variables de sesion existentes.
     * @param {string} tipo - tipo de modulo que lo requiere
     * @param {string} modulo - modulo del que se quiere obtener variables.
     * @param {Object} objeto - bjetoque debe actualizar variables.
     * @returns {Object} JSON de variables
     */
    actualizarSessionVariables(tipo, modulo, objeto) {
        switch (tipo) {
            case 'planificador':
                return StorageUtil.actualizar('app:' + modulo, this.sessionToJSON(), 'session');
            case 'exportador':
                return StorageUtil.actualizar('app:' + modulo, objeto.sessionToJSON(), 'session');
            default:
                return null;                
        }
    }

    /**
     * Elimina las variables existentes.
     * @param {string} modulo - modulo del que se quiere obtener variables.
     * @param {string} tipo - tipo de variable (local/session)
     * @returns {Object} JSON de variables
     */
    eliminarVariables(modulo, tipo) {
        StorageUtil.eliminar('app:' + modulo, tipo);
    }

    /* ======== Accesores ======== */

    /** @param {Object} nuevosFiltros - Nuevos filtros de reporte. */
    set filtros(nuevosFiltros) {
        if (nuevosFiltros && typeof nuevosFiltros === 'object')
            this.#filtros = nuevosFiltros;
    }

    /** @param {Array<MetaAhorro>} nuevasMetas - Lista de metas. */
    set metasAhorro(nuevasMetas) {
        if (nuevasMetas && Array.isArray(nuevasMetas))
            this.#metasAhorro = nuevasMetas;
    }
    
    /** @param {Array<Movimiento>} nuevosMovimientos - Lista de movimientos. */
    set movimientos(nuevosMovimientos) {
        if (nuevosMovimientos && Array.isArray(nuevosMovimientos))
            this.#movimientos = nuevosMovimientos;
    }

    /** @returns {Object} Filtros activos del planificador. */
    get filtros() {
        return this.#filtros;
    }

    /** @returns {Array<MetaAhorro>} Metas de ahorro actuales. */
    get metasAhorro() {
        return this.#metasAhorro;
    }

    /** @returns {Array<Movimiento>} Movimientos actuales. */
    get movimientos() {
        return this.#movimientos;
    }
}
