export default class Movimiento {
    #formato;
    #tipoDatos;

    constructor(formato, tipoDatos){
        this.#formato = ['CSV', 'JSON', 'PDF'];
        this.#tipoDatos = ['movimientos', 'metas', 'presupuesto', 'historial', 'reporte'];
    }
    /**
    * Exporta los datos según la configuración recibida.
    * @param {Array<Object>} datos - Datos a exportar.
    * @param {Object} config - Configuración: { tipo, formato, nombreArchivo, rutaDestino }.
    * @returns {boolean} - true si la exportación fue exitosa.
    */
   
    exportar(datos, config) {
        if (!this.validarConfiguracion(config)) {
            throw new Error('Configuración de exportación inválida');
        }
        const { tipo, formato, nombreArchivo, rutaDestino } = config;
        const formatoMayus = formato.toUpperCase();
        if (!this.#tipoDatos.includes(tipo)) {
            throw new Error(`Tipo de datos no permitido: ${tipo}`);
        }
        
        let contenido;
        switch (formatoMayus) {
            case 'CSV':
                contenido = this.toCSV(datos);
                break;
            case 'JSON':
                contenido = this.toJSON(datos);
                break;
            case 'PDF':
                contenido = this.toPDF(datos);
                break;
            default:
                throw new Error(`Formato no soportado: ${formato}`);
            }
        
    // Simulación de exportación (por ahora solo loguea)
    console.log(`Exportando ${tipo} en formato ${formatoMayus}`);
    console.log(`Archivo: ${rutaDestino}/${nombreArchivo}.${formatoMayus.toLowerCase()}`);
    console.log('Contenido generado:', contenido);
    return true;
}  

    /**
    * Valida la configuración de exportación.
    * @param {Object} config
    * @returns {boolean}
    */
    validarConfiguracion(config) {
        const { formato, nombreArchivo, rutaDestino } = config;
        if (!Exportador.esFormatoValido(formato)) return false;
        if (!Exportador.sonNombreYRutaValidos(nombreArchivo, rutaDestino)) return false;
        return true;
    }

    /**
    * Genera el contenido CSV.
    */
    toCSV(datos) {
        if (!Array.isArray(datos) || datos.length === 0) return '';
        const encabezados = Object.keys(datos[0]);
        const filas = datos.map(obj => encabezados.map(k => obj[k]).join(','));
        return [encabezados.join(','), ...filas].join('\n');
    }

    /**
    * Genera el contenido JSON.
    */
    toJSON(datos) {
        return JSON.stringify(datos, null, 2);
    }

    /**
    * Simula la generación de PDF (por ahora devuelve texto plano).
    */
    toPDF(datos) {
        return `REPORTE FINANCIERO\n--------------------\n${JSON.stringify(datos, null, 2)}`;
    }

    /* ===== Métodos estáticos de validación ===== */

    static esFormatoValido(formato) {
        const formatos = ['CSV', 'JSON', 'PDF'];
        return formatos.includes(String(formato).trim().toUpperCase());
    }

    static sonNombreYRutaValidos(nombre, ruta) {
        return nombre && ruta && !nombre.includes('.') && nombre.trim() !== '' && ruta.trim() !== '';
    }
}