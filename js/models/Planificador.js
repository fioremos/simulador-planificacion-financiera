import Movimiento from './Movimiento.js';
import MetaAhorro from './MetaAhorro.js';
import Exportador from './Exportador.js';

export default class Planificador {
    #movimientos;
    #metasAhorro;
    #exportador;
    
    constructor() {
        this.#movimientos = [];
        this.#metasAhorro = [];
        this.#exportador = new Exportador();
  }

    /* ======== Gestión de Movimientos ======== */
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
    generarReporte(filtros) {
        const datosFiltrados = this.#filtrarDatos(filtros);
        const indicadores = this.#calcularIndicadores(datosFiltrados);

    return {
        filtros,
        totalMovimientos: datosFiltrados.length,
        ...indicadores
        };
    }

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
    exportarDatos(tipo, formato, nombreArchivo, rutaDestino) {
        const datos =
        tipo === 'movimientos'
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
    toJSON() {
        return {
            movimientos: this.#movimientos.map(m => m.toJSON()),
            metasAhorro: this.#metasAhorro.map(m => m.toJSON())
        };
    }

    static fromJSON(json) {
        const planificador = new Planificador();
        planificador.#movimientos = json.movimientos.map(m => Movimiento.fromJSON(m));
        planificador.#metasAhorro = json.metasAhorro.map(m => MetaAhorro.fromJSON(m));
        return planificador;
    }

    /* ======== Accesores ======== */
    get movimientos() {
        return this.#movimientos;
    }

    get metasAhorro() {
        return this.#metasAhorro;
    }
}
