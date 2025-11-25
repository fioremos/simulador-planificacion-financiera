import { ApiService } from '../api/apiService.js';
import { EventBus } from '../utils/eventBus.js';
import { Planificador } from '../models/Planificador.js'; 

describe("Suite Asíncrona: ApiService y Planificador", function() {

    // PARTE 1: Tests para ApiService 
    describe("1. ApiService.fetchData (Consumo de API)", function() {

        beforeEach(function() {
            spyOn(EventBus, 'emit');
            spyOn(window, 'fetch');

            spyOn(window, 'setTimeout').and.callFake((callback) => {
                if (typeof callback === 'function') callback();
                return 0; 
            });
        });

        // Test 1: Éxito
        it("debe obtener datos exitosamente y emitir eventos de carga", async function() {
            const mockData = [{ id: 1, categoria: 'Sueldo' }];
            const mockResponse = new Response(JSON.stringify(mockData), { status: 200 });

            window.fetch.and.returnValue(Promise.resolve(mockResponse));

            const data = await ApiService.fetchData('/api/categorias');

            expect(data).toEqual(mockData);
            expect(EventBus.emit).toHaveBeenCalledWith('api:loading', true);
            expect(EventBus.emit).toHaveBeenCalledWith('api:loading', false);
        });

        // Test 2: Error 404
        it("debe lanzar error y emitir 'api:error' ante fallo HTTP (404)", async function() {
            const mockResponse = new Response(null, { status: 404, statusText: 'Not Found' });
            window.fetch.and.returnValue(Promise.resolve(mockResponse));

            try {
                await ApiService.fetchData('/api/error', 1);
                fail("Debería haber fallado por error 404");
            } catch (error) {
                expect(error.message).toContain('404');
            }

            expect(EventBus.emit).toHaveBeenCalledWith('api:error', jasmine.stringMatching(/404/));
        });

        // Test 3: Reintento exitoso
        it("debe reintentar la petición tras un fallo y tener éxito en el segundo intento", async function() {

            window.fetch.and.returnValues(
                Promise.reject(new Error("Fallo de red")), 
                Promise.resolve(new Response(JSON.stringify([]), { status: 200 })) 
            );

            const data = await ApiService.fetchData('/api/retry', 2);
            
            expect(data).toEqual([]); 
            expect(window.fetch).toHaveBeenCalledTimes(2);
        });

        // Test 4: Formato incorrecto
        it("debe lanzar error si los datos recibidos no son un array", async function() {
            const datosInvalidos = { error: "Objeto no array" };
            const mockResponse = new Response(JSON.stringify(datosInvalidos), { status: 200 });
            window.fetch.and.returnValue(Promise.resolve(mockResponse));

            try {
                await ApiService.fetchData('/api/bad-format');
                fail("Debería haber fallado por formato inválido");
            } catch (error) {
                expect(error.message).toContain('Se esperaba un array');
            }
            
            expect(EventBus.emit).toHaveBeenCalledWith('api:error', jasmine.stringMatching(/array/));
        });
    });

    // PARTE 2: Tests para Planificador (Delegación)
    describe("2. Planificador.obtenerCategorias (Delegación)", function() {
        let planificador;

        beforeEach(function() {
            planificador = new Planificador();

            spyOn(ApiService, 'fetchData');
            spyOn(console, 'error'); 
        });

        it("debe delegar en ApiService y retornar los datos obtenidos", async function() {
            const mockCategorias = ['Comida', 'Transporte'];
            
            ApiService.fetchData.and.returnValue(Promise.resolve(mockCategorias));

            const resultado = await planificador.obtenerCategorias();

            expect(ApiService.fetchData).toHaveBeenCalled();
            expect(resultado).toEqual(mockCategorias);
        });

        it("debe manejar errores devolviendo un array vacío y registrando el error", async function() {
            ApiService.fetchData.and.rejectWith(new Error("API Down"));

            const resultado = await planificador.obtenerCategorias();

            expect(resultado).toEqual([]);
            expect(console.error).toHaveBeenCalled();
        });
    });
});