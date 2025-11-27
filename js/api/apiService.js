import { EventBus } from '../utils/eventBus.js'; 

/**
 * Servicio para consumo de API externa.
 * Implementa métodos de estado de UI que EMITEN EVENTOS en lugar de manipular el DOM.
 */
export const ApiService = {    
    async fetchData(endpoint, maxRetries = 1) {
        let attemptCount = 0;

        while (attemptCount < maxRetries) {
            attemptCount++;
            
            try {
                this.showLoading(); 

                // Simulamos una latencia de red
                await new Promise(resolve => setTimeout(resolve, 500)); 

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText || 'Respuesta no exitosa'}`);
                }

                const data = await response.json();
                
                if (!data || !Array.isArray(data)) {
                     throw new Error('Formato de datos de API inválido. Se esperaba un array.');
                }
                
                this.hideLoading(); 
                attemptCount = 0;
                return data;

            } catch (error) {
                this.hideLoading(); 
                
                if (attemptCount < maxRetries) {
                    this.showError(`Fallo en el intento ${attemptCount}. Reintentando en 1s...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    const finalError = new Error(`La carga de ${endpoint} falló después de ${maxRetries} intentos. ${error.message}`);
                    this.showError(finalError.message); 
                    attemptCount = 0;
                    throw finalError; 
                }
            }
        }
    },
    showLoading() {
        console.log('[ApiService] Emitiendo: loading');
        EventBus.emit('api:loading', true);
    },

    hideLoading() {
        console.log('[ApiService]  Emitiendo: loaded');
        EventBus.emit('api:loading', false);
    },

    showError(message) {
        console.error('[ApiService] Emitiendo: error con mensaje:', message);
        EventBus.emit('api:error', message); 
    },
};