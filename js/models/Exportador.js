class Exportador {
    #filtrosExportacion;

    /**
     * Inicializa un nuevo Exportador.
     */
    constructor() {
        this.#filtrosExportacion = { tipo: [],
                                    formato: "",
                                    nombreArchivo: "",
                                    rutaDestino: "" };
    }
    
     /* ======== Exportación ======== */
    /**
     * Exporta los movimientos o metas de ahorro a un formato y archivo específico.
     * @param {Array<string>} tipo - Tipo de datos a exportar: ['resumen-cuenta'] o ['metas'].
     * @param {string} formato - Formato de exportación: 'CSV', 'JSON', 'PDF', 'XLSX'.
     * @param {string} nombreArchivo - Nombre del archivo a generar.
     * @param {string} rutaDestino - Ruta o ubicación para guardar el archivo.
     * @param {planificador} planificador - Contexto de ejecución del planificador
     */
    exportarDatos(tipo, formato, nombreArchivo, rutaDestino, planificador) {
        const datos =
            tipo.length === 1 && tipo[0] === 'resumen-cuenta'
            ? planificador.movimientos.map(m => m.toJSON())
            : planificador.metasAhorro.map(m => m.toJSON());

        const config = { tipo, formato, nombreArchivo, rutaDestino };

        try {
            this.#exportar(datos, config);
            console.log('Exportación exitosa.');
        } catch (error) {
            console.log('Error al exportar:', error.message);
        }
    }

    /**
    * Exporta los datos según la configuración recibida.
    * @param {Array<Object>} datos - Datos a exportar.
    * @param {Object} config - Configuración: { tipo, formato, nombreArchivo, rutaDestino }.
    * @returns {boolean} - true si la exportación fue exitosa.
    * @throws {Error} - Si la configuración o el formato es invalido.
    */
   
    // Método para exportar
    #exportar(datos, config) {
        if (!Array.isArray(datos) || datos.length === 0){
            console.log("No hay datos para exportar.");
            return false;
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
        
        // Simulación de exportación (por ahora solo loguea)
        console.log(`Exportando ${this.filtrosExportacion.tipo} en formato ${formatoMayus}`);
        console.log(`Archivo: ${this.filtrosExportacion.rutaDestino}/${this.filtrosExportacion.nombreArchivo}.${formatoMayus.toLowerCase()}`);
        console.log('Contenido generado:', contenido);

        //// Crear un Blob con el contenido generado
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });

        // Crear un enlace temporal para descarga
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = `${this.filtrosExportacion.nombreArchivo}.${formatoMayus.toLowerCase()}`;
        enlace.click();

        // Liberar la URL temporal
        URL.revokeObjectURL(enlace.href);

        console.log(`Archivo ${this.filtrosExportacion.nombreArchivo}.${formatoMayus.toLowerCase()} descargado correctamente.`);
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
     * Genera el contenido XLSX simulado (texto plano tabulado).
     * Devuelve una cadena representando el contenido del archivo Excel.
     */
    toXLSX(datos) {
        if (!Array.isArray(datos) || datos.length === 0) return '';

        // Obtener encabezados desde la primera fila
        const encabezados = Object.keys(datos[0]);

        // Construir filas con tabuladores para simular celdas
        const filas = datos.map(obj =>
            encabezados.map(k => obj[k] ?? '').join('\t')
        );

        // Unir encabezados y filas
        const contenido = [encabezados.join('\t'), ...filas].join('\n');

        // Simular estructura típica de archivo Excel
        return `--- XLSX SIMULADO ---\n${contenido}\n--- FIN XLSX ---`;
    }

    /**
    * Genera el contenido CSV.
    */
    toCSV(datos) {
        if (!Array.isArray(datos) || datos.length === 0) return '';
        const encabezados = Object.keys(datos[0]);
        const filas = datos.map(obj => encabezados.map(k => JSON.stringify(obj[k])).join(','));
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
        const formatos = ['CSV', 'JSON', 'PDF', 'XLSX'];
        return formatos.includes(String(formato).trim().toUpperCase());
    }

    static sonNombreYRutaValidos(nombre, ruta) {
        return nombre && ruta && !nombre.includes('.') && nombre.trim() !== '' && ruta.trim() !== '';
    }


    /* ======== Serialización ======== */
       /**
     * Serializa el planificador a un objeto JSON.
     * @returns {Object} - Objeto JSON con movimientos y metas de ahorro.
     */
    sessionToJSON() {
        return {
            filtrosExportador: JSON.stringify(this.filtrosExportacion)
        };
    }
    
    /**
     * Crarga una instancia de Planificador desde un objeto JSON.
     * @param {Object} jsonFiltrosExp - Objeto JSON con estructuras de filtros de exportación.
     */
    sessionExpFromJSON(jsonFiltrosExp) {
        if (jsonFiltrosExp)
            this.filtrosExportacion = jsonFiltrosExp;
    }

    
    /* ======== Accesores ======== */
    /* ======== Getters ======== */
    get filtrosExportacion() {
        return this.#filtrosExportacion;
    }
    
    /* ======== Setters ======== */ 
    set filtrosExportacion(nuevosFiltros) {
            this.#filtrosExportacion = nuevosFiltros;
    }

}
