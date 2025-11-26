export class Exportador {
    #filtrosExportacion;

    /**
     * Inicializa un nuevo Exportador.
     */
    constructor() {
        this.#filtrosExportacion = { 
            tipo: [],
            formato: "",
            nombreArchivo: "",
            rutaDestino: "" 
        };
    }
    
    /* ======== Exportación ======== */

    /**
     * Exporta los movimientos o metas de ahorro a un formato y archivo específicos.
     * @param {Array<string>} tipo - Tipos de datos a exportar. Ej.: ['resumen-cuenta'] o ['metas'].
     * @param {string} formato - Formato de exportación: 'CSV', 'JSON', 'PDF' o 'XLSX'.
     * @param {string} nombreArchivo - Nombre del archivo a generar (sin extensión).
     * @param {string} rutaDestino - Ruta o carpeta donde guardar el archivo.
     * @param {Object} planificador - Instancia del planificador que contiene movimientos y metas.
     */
    exportarDatos(tipo, formato, nombreArchivo, rutaDestino, planificador) {
        const datos =
            tipo.length === 1 && tipo[0] === 'resumen-cuenta'
            ? planificador.movimientos.map(m => m.toJSON())
            : planificador.metasAhorro.map(m => m.toJSON());

        const config = { tipo, formato, nombreArchivo, rutaDestino };
        if (datos.length === 0) {return ["Warning", "No hay datos para exportar"];}
        try {
            
            this.#exportar(datos, config);
            console.log('Exportación exitosa.');
            return ['Éxito', 'Proceso de exportación finalizado con éxito'];
        } catch (error) {
            throw new Error('Valide los datos se produjo un error al intentar exportar: '+ error.message);
        }
    }

    /**
     * Exporta los datos según la configuración recibida.
     * @param {Array<Object>} datos - Datos listos para exportación.
     * @param {Object} config - Configuración de exportación.
     *          {Array<string>} config.tipo - Tipo de contenido exportado.
     *          {string} config.formato - Formato de archivo.
     *          {string} config.nombreArchivo - Nombre del archivo.
     *          {string} config.rutaDestino - Ruta donde se guardará el archivo.
     * @returns {boolean} true si la exportación fue exitosa.
     * @throws {Error} Si la configuración es inválida o el formato no es soportado.
     */
    #exportar(datos, config) {
        if (!Array.isArray(datos) || datos.length === 0){
            console.log("No hay datos para exportar.");
            throw new Error('No hay datos para exportar.');
        }
        if (!this.validarConfiguracion(config)) {
            throw new Error('Configuración de exportación inválida');
        }
        this.filtrosExportacion = config;
        const formatoMayus = this.filtrosExportacion.formato.toUpperCase();
        
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
            case 'XLSX':
                contenido = this.toXLSX(datos);
                break;
            default:
                throw new Error(`Formato no soportado: ${this.filtrosExportacion.formato}`);
        }
        
        // Simulación de exportación
        console.log(`Exportando ${this.filtrosExportacion.tipo} en formato ${formatoMayus}`);
        console.log(`Archivo: ${this.filtrosExportacion.rutaDestino}/${this.filtrosExportacion.nombreArchivo}.${formatoMayus.toLowerCase()}`);
        console.log('Contenido generado:', contenido);

        // Exportación
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = `${this.filtrosExportacion.nombreArchivo}.${formatoMayus.toLowerCase()}`;
        enlace.click();
        URL.revokeObjectURL(enlace.href);

        console.log(`Archivo ${this.filtrosExportacion.nombreArchivo}.${formatoMayus.toLowerCase()} descargado correctamente.`);
        return true;
    }

    /**
     * Valida la configuración de exportación recibida.
     * @param {Object} config - Configuración de exportación.
     * @returns {boolean} true si es válida.
     */
    validarConfiguracion(config) {
        const { tipo, formato, nombreArchivo, rutaDestino } = config;
        if (!Exportador.hayDatosSeleccionados(tipo)) return false;
        if (!Exportador.esFormatoValido(formato)) return false;
        if (!Exportador.sonNombreYRutaValidos(nombreArchivo, rutaDestino)) return false;
        return true;
    }

    /**
     * Genera contenido XLSX simulado como texto plano tabulado.
     * @param {Array<Object>} datos - Datos a exportar.
     * @returns {string} Contenido XLSX simulado.
     */
    toXLSX(datos) {
        if (!Array.isArray(datos) || datos.length === 0) return '';

        const encabezados = Object.keys(datos[0]);
        const filas = datos.map(obj =>
            encabezados.map(k => obj[k] ?? '').join('\t')
        );

        const contenido = [encabezados.join('\t'), ...filas].join('\n');

        return `--- XLSX SIMULADO ---\n${contenido}\n--- FIN XLSX ---`;
    }

    /**
     * Genera contenido CSV.
     * @param {Array<Object>} datos - Datos a exportar.
     * @returns {string} Cadena CSV.
     */
    toCSV(datos) {
        if (!Array.isArray(datos) || datos.length === 0) return '';
        const encabezados = Object.keys(datos[0]);
        const filas = datos.map(obj => encabezados.map(k => JSON.stringify(obj[k])).join(','));
        return [encabezados.join(','), ...filas].join('\n');
    }

    /**
     * Genera contenido JSON.
     * @param {Array<Object>} datos - Datos a exportar.
     * @returns {string} JSON formateado.
     */
    toJSON(datos) {
        return JSON.stringify(datos, null, 2);
    }

    /**
     * Simula la generación de un PDF (devuelve texto plano).
     * @param {Array<Object>} datos - Datos a exportar.
     * @returns {string} Contenido simulando un PDF.
     */
    toPDF(datos) {
        return `REPORTE FINANCIERO\n--------------------\n${JSON.stringify(datos, null, 2)}`;
    }

    /* ===== Métodos estáticos de validación ===== */

    /**
     * Verifica si hay datos seleccionados para exportar.
     * @param {Array<string>} tipo - Tipos de datos seleccionados.
     * @returns {boolean} true si hay datos seleccionados.
     */
    static hayDatosSeleccionados(tipo) {
        const tiposDisponibles = ['transacciones', 'inversiones', 'performance', 'contribuciones', 'asignaciones', 'balances', 'flujo-fondos', 'descripcion-general', 'resumen-cuenta'];
        return Array.isArray(tipo) && tipo.length > 0 && tipo.every(t => tiposDisponibles.includes(t));
    }
    
    /**
     * Verifica si el formato recibido es válido.
     * @param {string} formato - Formato a validar.
     * @returns {boolean} true si es válido.
     */
    static esFormatoValido(formato) {
        const formatos = ['CSV', 'JSON', 'PDF', 'XLSX'];
        return formatos.includes(String(formato).trim().toUpperCase());
    }

    /**
     * Verifica que el nombre del archivo y la ruta sean válidos.
     * @param {string} nombre - Nombre del archivo sin extensión.
     * @param {string} ruta - Ruta o directorio.
     * @returns {boolean} true si ambos son válidos.
     */
    static sonNombreYRutaValidos(nombre, ruta) {
        return nombre && ruta && !nombre.includes('.') && nombre.trim() !== '' && ruta.trim() !== '';
    }

    /* ======== Serialización de sesión ======== */

    /**
     * Serializa los filtros del exportador.
     * @returns {Object} Objeto JSON con los filtros usados.
     */
    sessionToJSON() {
        return {
            filtrosExportador: JSON.stringify(this.filtrosExportacion)
        };
    }
    
    /**
     * Carga los filtros del exportador desde un objeto JSON.
     * @param {Object} jsonFiltrosExp - Filtros cargados desde sesión.
     */
    sessionExpFromJSON(jsonFiltrosExp) {
        if (jsonFiltrosExp)
            this.filtrosExportacion = jsonFiltrosExp;
    }

    /* ======== Accesores ======== */

    /** @returns {Object} Filtros actuales de exportación. */
    get filtrosExportacion() {
        return this.#filtrosExportacion;
    }
    
    /**
     * Establece nuevos filtros de exportación.
     * @param {Object} nuevosFiltros - Filtros a asignar.
     */
    set filtrosExportacion(nuevosFiltros) {
        this.#filtrosExportacion = nuevosFiltros;
    }

}
