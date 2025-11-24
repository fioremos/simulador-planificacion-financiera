import { AlertUtils } from '../utils/alerts.js';

describe("AlertUtils (Wrapper de SweetAlert2)", function() {

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

        spyOn(window.Swal, 'fire').and.returnValue(Promise.resolve({ 
            isConfirmed: true, 
            isDenied: false, 
            isDismissed: false 
        }));
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

        expect(window.Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
            title: titulo,
            text: mensaje,
            icon: 'success',
            timer: 2000 
        }));
    });

    // TEST 3: Alerta de Error (Error)
    it("el método .error() debe llamar a Swal con el icono 'error'", function() {
        AlertUtils.error("Fallo Crítico", "Error 500");

        expect(window.Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
            icon: 'error',
            title: "Fallo Crítico"
        }));
    });

    // TEST 4: Alerta de Advertencia (Warning)
    it("el método .warning() debe llamar a Swal con el icono 'warning'", function() {
        AlertUtils.warning("Cuidado", "Esta acción no se puede deshacer");

        expect(window.Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
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

        expect(window.Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
            confirmButtonColor: '#0d6efd', 
            cancelButtonColor: '#6c757d',  
            allowOutsideClick: false
        }));
    });
    // TEST 7: Indicador de Carga (Loading)
    it("el método .loading() debe mostrar una alerta sin botón de cierre y con título", function() {
        AlertUtils.loading("Cargando datos...", "Espere");

        expect(window.Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
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
});