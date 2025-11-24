/**
 * Módulo centralizado para manejar alertas con SweetAlert2.
 * Proporciona métodos reutilizables para éxito, error, advertencia, confirmación e información.
 */
export const AlertUtils = (() => {
    /**
     * Configuración por defecto para todas las alertas.
     * @type {Object}
     */
    const defaultConfig = {
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        didOpen: (modal) => {
            modal.style.zIndex = '9999';
        }
    };

    /**
     * Muestra una alerta de éxito.
     * @param {string} title - Título del mensaje.
     * @param {string} [message=''] - Mensaje detallado (opcional).
     * @param {Function} [callback=null] - Función a ejecutar después de cerrar (opcional).
     * @returns {Promise} Promesa de SweetAlert2.
     */
    const success = (title, message = '', callback = null) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'success',
            title: title,
            text: message,
            confirmButtonText: 'Aceptar',
            timer: 2000,
            timerProgressBar: true
        }).then((result) => {
            if (callback && result.isConfirmed) callback();
            return result;
        });
    };

    /**
     * Muestra una alerta de error.
     * @param {string} title - Título del mensaje.
     * @param {string} [message=''] - Mensaje detallado (opcional).
     * @param {Function} [callback=null] - Función a ejecutar después de cerrar (opcional).
     * @returns {Promise} Promesa de SweetAlert2.
     */
    const error = (title, message = '', callback = null) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (callback && result.isConfirmed) callback();
            return result;
        });
    };

    /**
     * Muestra una alerta de advertencia.
     * @param {string} title - Título del mensaje.
     * @param {string} [message=''] - Mensaje detallado (opcional).
     * @param {Function} [callback=null] - Función a ejecutar después de cerrar (opcional).
     * @returns {Promise} Promesa de SweetAlert2.
     */
    const warning = (title, message = '', callback = null) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'warning',
            title: title,
            text: message,
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (callback && result.isConfirmed) callback();
            return result;
        });
    };

    /**
     * Muestra una alerta de información.
     * @param {string} title - Título del mensaje.
     * @param {string} [message=''] - Mensaje detallado (opcional).
     * @param {Function} [callback=null] - Función a ejecutar después de cerrar (opcional).
     * @returns {Promise} Promesa de SweetAlert2.
     */
    const info = (title, message = '', callback = null) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'info',
            title: title,
            text: message,
            confirmButtonText: 'Aceptar',
            timer: 2500,
            timerProgressBar: true
        }).then((result) => {
            if (callback && result.isConfirmed) callback();
            return result;
        });
    };

    /**
     * Muestra una alerta de carga (loading).
     * @param {string} title - Título del mensaje.
     * @param {string} [message=''] - Mensaje detallado (opcional).
     */
    const loading = (title, message = '') => {
        Swal.fire({
            ...defaultConfig,
            showConfirmButton: false,
            title: title,
            text: message,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    };
    
    /**
     * Cierra la alerta de carga (loading).
     */
    const closeLoading = (callback = null) => {
        Swal.close();
        if (callback) callback();
    };

    // Retornar interfaz pública
    return {
        success,
        error,
        warning,
        info,
        loading,
        closeLoading
    };
})();