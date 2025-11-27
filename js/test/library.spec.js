import { AlertUtils } from '../utils/alerts.js';

describe("AlertUtils (Wrapper de SweetAlert2)", function() {
    let swalFireSpy;
    let swalCloseSpy;
    let swalShowLoadingSpy;

    beforeEach(function() {
        if (typeof AlertUtils === 'undefined') {
            fail("El módulo AlertUtils no se pudo importar. Verifica que la ruta sea correcta.");
        }

        if (!window.Swal) {
            window.Swal = { 
                fire: function() {},
                close: function() {},
                showLoading: function() {}
                };
        }

        swalFireSpy = spyOn(window.Swal, 'fire').and.returnValue(Promise.resolve({ 
            isConfirmed: true, 
            isDenied: false, 
            isDismissed: false 
        }));

        
        swalCloseSpy = spyOn(window.Swal, 'close');
    });

    // TEST 1: Inicialización
    it("el módulo AlertUtils debe estar definido e importar correctamente", function() {
        expect(AlertUtils).toBeDefined();
        expect(typeof AlertUtils.success).toBe('function');
        expect(typeof AlertUtils.error).toBe('function');
    });

    // TEST 2: Alerta de Éxito (Success)
    it("el método .success() debe llamar a Swal con el icono 'success' y timer", function() {
        const titulo = "Operación Exitosa";
        const mensaje = "Los datos se guardaron bien";

        AlertUtils.success(titulo, mensaje);

        expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            title: titulo,
            text: mensaje,
            icon: 'success',
            timer: 2000 
        }));
    });

    // TEST 3: Alerta de Error (Error)
    it("el método .error() debe llamar a Swal con el icono 'error'", function() {
        AlertUtils.error("Fallo Crítico", "Error 500");

        expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            icon: 'error',
            title: "Fallo Crítico"
        }));
    });

    // TEST 4: Alerta de Advertencia (Warning)
    it("el método .warning() debe llamar a Swal con el icono 'warning'", function() {
        AlertUtils.warning("Cuidado", "Esta acción no se puede deshacer");

        expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            icon: 'warning'
        }));
    });

    // TEST 5: Ejecución de Callbacks (Lógica Asíncrona)
    it("debe ejecutar la función callback cuando el usuario confirma la alerta", async function() {
        const miCallback = jasmine.createSpy("callbackDePrueba");

        await AlertUtils.success("Test Callback", "Probando...", miCallback);

        expect(miCallback).toHaveBeenCalled();
    });
    
    // TEST 6: Configuración por defecto
    it("debe respetar la configuración visual por defecto (colores y z-index)", function() {
        AlertUtils.info("Info", "Test config");

        expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            confirmButtonColor: '#0d6efd', 
            cancelButtonColor: '#6c757d',  
            allowOutsideClick: false
        }));
    });
    // TEST 7: Indicador de Carga (Loading)
    it("el método .loading() debe mostrar una alerta sin botón de cierre y con título", function() {
        AlertUtils.loading("Cargando datos...", "Espere");

        expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            title: "Cargando datos...",
            text: "Espere",
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: jasmine.any(Function) 
        }));
    });

    // TEST 8: Cierre de Carga (Close Loading)
    it("el método .closeLoading() debe cerrar la alerta actual", function() {
        window.Swal.close = jasmine.createSpy("close");

        AlertUtils.closeLoading();

        expect(window.Swal.close).toHaveBeenCalled();
    });

    
    // TEST 9: Alerta de Éxito con mensaje vacío (Success)
    it("el método .success() debe llamar a Swal con el icono 'success', timer y manejar mensaje vacío", function() {
        const titulo = "Operación Exitosa";
        AlertUtils.success(titulo); 

        expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            title: titulo,
            text: '', 
            icon: 'success',
            timer: 2000 
        }));
    });
     
    // TEST 10: No ejecución de Callback al descartar la alerta
    it("NO debe ejecutar la función callback cuando el usuario descarta/cierra la alerta (isConfirmed: false)", async function() {
        const miCallback = jasmine.createSpy("callbackDePrueba");
        
        // Configura el spy para simular que la alerta se cierra sin confirmación (p. ej., por tiempo o Dismiss)
        const swalResponse = {
            isConfirmed: false,
            isDenied: false,
            isDismissed: false
        };
        
       swalFireSpy.and.returnValue(Promise.resolve(swalResponse));

        await AlertUtils.success("Test Dismissed", "Probando el no-callback...", miCallback);

        expect(miCallback).not.toHaveBeenCalled();
    });
    
    // TEST 11: Alerta de Carga con mensaje vacío
    it("el método .loading() debe manejar mensaje vacío correctamente", function() {
        AlertUtils.loading("Cargando..."); 

        expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
            title: "Cargando...",
            text: ''
        }));
    });
    
    // TEST 12: Cierre de Carga sin callback
    it("el método .closeLoading() debe cerrar la alerta actual incluso sin un callback", function() {
        AlertUtils.closeLoading();

        expect(swalCloseSpy).toHaveBeenCalledTimes(1);
    });

    describe('AlertUtils.setFeedback', () => {
        it('debe llamar a error() y pasar el mensaje y callback correctamente para "Error"', () => {
            const mensaje = 'Error de validación.';
            
            AlertUtils.setFeedback(mensaje, 'Error');

            expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                icon: 'error',
                title: 'Error',
                text: "Error de validación."
            }));
        });

        it('debe llamar a success() para el tipo "Éxito" sin callback', () => {
            const tipoAlerta = 'Éxito'; // Este es el valor que activa el switch case Y es el título
            const cuerpoMensaje = 'Operación exitosa.';

            AlertUtils.setFeedback(cuerpoMensaje, tipoAlerta); 
            
            expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                title: tipoAlerta,
                text: cuerpoMensaje,
                icon: 'success',
                timer: 2000 
            }));
        });

        it('debe extraer el mensaje de un objeto Error para el caso "Error"', () => {
            const errorObject = new Error('Falló la API.');
            
            AlertUtils.setFeedback(errorObject, 'Error');
            
            expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                icon: 'error',
                title: 'Error',
                text: "Falló la API."
            }));
        });

        it('debe llamar a loading() pasando solo el título y el mensaje', () => {
            AlertUtils.setFeedback('Cargando datos...', 'Loading');

            expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                text: "Cargando datos...",
                title: "Loading",
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: jasmine.any(Function) 
            }));
        });

        it('debe llamar a console.warn para un tipo de mensaje no reconocido', () => {
            const consoleWarnSpy = spyOn(console, 'warn');
            AlertUtils.setFeedback('Advertencia', 'TipoInvalido');
            
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                'Tipo de mensaje desconocido para setFeedback:', 
                'TipoInvalido'
            );
        });
        
        it('debe llamar a warning() para el tipo "Warning"', () => {
            AlertUtils.setFeedback('Verifique sus datos', 'Warning');
            
            expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                icon: 'warning',
                title: 'Warning',
                text: 'Verifique sus datos'
            }));
        });
        
        it('debe llamar a info() para el tipo "Info"', () => {
            AlertUtils.setFeedback('Información importante', 'Info');
            
            expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                icon: 'info',
                title: 'Info',
                text: 'Información importante'
            }));
        });

         it('debe llamar a closeLoading() para el tipo "closeLoading"', () => {
            AlertUtils.setFeedback(null, 'closeLoading'); 
            expect(swalCloseSpy).toHaveBeenCalledTimes(1);
            expect(swalFireSpy).not.toHaveBeenCalled(); 
        });


        it('debe convertir mensajes no-string (como números) a string para setFeedback', () => {
            AlertUtils.setFeedback(12345, 'Éxito');
            
            expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
                text: "12345",
                icon: 'success'
            }));
        });
    });
});