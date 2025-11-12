class Exportador {

    /**
    * Exporta los datos según la configuración recibida.
    * @param {Array<Object>} datos - Datos a exportar.
    * @param {Object} config - Configuración: { tipo, formato, nombreArchivo, rutaDestino }.
    * @returns {boolean} - true si la exportación fue exitosa.
    * @throws {Error} - Si la configuración o el formato es invalido.
    */
   
    // Método para exportar
    exportar(datos, config) {
        if (!Array.isArray(datos) || datos.length === 0){
            console.warn("No hay datos para exportar.");
            return false;
        }
        if (!this.validarConfiguracion(config)) {
            throw new Error('Configuración de exportación inválida');
        }
        const { tipo, formato, nombreArchivo, rutaDestino } = config;
        const formatoMayus = formato.toUpperCase();
        
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
                throw new Error(`Formato no soportado: ${formato}`);
            }
        
        // Simulación de exportación (por ahora solo loguea)
        console.log(`Exportando ${tipo} en formato ${formatoMayus}`);
        console.log(`Archivo: ${rutaDestino}/${nombreArchivo}.${formatoMayus.toLowerCase()}`);
        console.log('Contenido generado:', contenido);

        //// Crear un Blob con el contenido generado
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });

        // Crear un enlace temporal para descarga
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = `${nombreArchivo}.${formatoMayus.toLowerCase()}`;
        enlace.click();

        // Liberar la URL temporal
        URL.revokeObjectURL(enlace.href);

        console.log(`Archivo ${nombreArchivo}.${formatoMayus.toLowerCase()} descargado correctamente.`);
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
}