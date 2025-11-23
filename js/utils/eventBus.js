/**
 * EventBus: Patrón Observador para la Arquitectura Modular
 * * PROPÓSITO:
 * * Este módulo actúa como un canal centralizado de comunicación (un 'Event Bus') para desacoplar
 * la lógica de la API de la capa de Interfaz de Usuario (UI).
 * * PROBLEMA RESUELTO:
 * * La consigna del parcial exige que la clase 'ApiService' implemente métodos de control de estado de UI
 * (como showLoading(), hideLoading(), y showError()). Sin embargo, permitir que 'ApiService'
 * manipule directamente el DOM o la función 'setFeedback' de 'script.js' violaría el 
 * Principio de Responsabilidad Única (SRP) y el principio de Separación de Responsabilidades.
 * * SOLUCIÓN:
 * * 1.  **ApiService (Publicador):** En lugar de tocar el DOM, 'ApiService' utiliza este 'EventBus'
 * para *emitir* eventos con nombres semánticos (ej., 'api:loading', 'api:error') cuando
 * su estado interno cambia.
 * 2.  **script.js (Observador):** El script principal de la UI se *suscribe* a estos
 * eventos a través de este bus, utilizando las funciones 'handleApiLoading' y 'handleApiError'.
 * 3.  **Resultado:** Se logra cumplir con la estructura requerida (ApiService tiene los métodos)
 * mientras se mantiene una arquitectura limpia y modular: la lógica de la UI permanece
 * estrictamente encapsulada en 'script.js'.
 */

export const EventBus = {
    // Objeto para almacenar las funciones suscritas a cada evento.
    listeners: {},

    /**
     * Suscribe una función a un evento específico.
     * @param {string} event - Nombre del evento (ej: 'loading', 'error').
     * @param {Function} callback - Función a ejecutar cuando se emite el evento.
     */
    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    },

    /**
     * Emite un evento, ejecutando todas las funciones suscritas.
     * @param {string} event - Nombre del evento.
     * @param {any} data - Datos opcionales a pasar a las funciones suscritas.
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`Error al ejecutar listener para ${event}:`, e);
                }
            });
        }
    }
};