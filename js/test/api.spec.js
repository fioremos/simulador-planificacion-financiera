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

        // Test 5: Error 500
        it("debe manejar correctamente un Error 500", async function() {
            const mockResponse = new Response(null, { status: 500, statusText: 'Internal Server Error' });
            window.fetch.and.returnValue(Promise.resolve(mockResponse));

            try {
                await ApiService.fetchData('/api/500'); 
                fail("Debería haber fallado por error 500");
            } catch (error) {
                expect(error.message).toContain('Error HTTP: 500 - Internal Server Error');
            }
            // Verifica que el EventBus emitió el error
            expect(EventBus.emit).toHaveBeenCalledWith('api:error', jasmine.stringMatching(/500/));
        });

        // Test 6: Reintentos agotados
        it("debe fallar y lanzar el error final después de agotar maxRetries (3 intentos, 3 fallos)", async function() {
            window.fetch.and.returnValues(
                Promise.reject(new Error("Timeout 1")), 
                Promise.reject(new Error("Timeout 2")), 
                Promise.reject(new Error("Timeout 3")) 
            );
            
            const maxRetries = 3;
            const endpoint = '/api/max-fail';

            try {
                await ApiService.fetchData(endpoint, maxRetries);
                fail("Debería haber fallado después de 3 intentos.");
            } catch (error) {
                expect(error.message).toContain(`La carga de ${endpoint} falló después de ${maxRetries} intentos. Timeout 3`);
            }
            
            expect(EventBus.emit).toHaveBeenCalledWith('api:error', jasmine.stringMatching(/Fallo en el intento 1/));
            expect(EventBus.emit).toHaveBeenCalledWith('api:error', jasmine.stringMatching(/Fallo en el intento 2/));
            expect(EventBus.emit).toHaveBeenCalledWith('api:error', jasmine.stringMatching(/falló después de 3 intentos/));
        });

        // Test 7:  Datos nulos
        it("debe lanzar error si los datos recibidos son 'null'", async function() {
            const mockResponse = new Response(JSON.stringify(null), { status: 200 });
            window.fetch.and.returnValue(Promise.resolve(mockResponse));

            try {
                await ApiService.fetchData('/api/null-data');
                fail("Debería haber fallado por datos nulos");
            } catch (error) {
                expect(error.message).toContain('Formato de datos de API inválido. Se esperaba un array');
            }
        });

        // Test 8: Datos indefinidos
         it("debe lanzar error si la respuesta .json() es 'undefined' (simulando malformación)", async function() {
            const mockResponse = { 
                ok: true,
                status: 200,
                json: () => Promise.resolve(undefined)
            };
            window.fetch.and.returnValue(Promise.resolve(mockResponse));

            try {
                await ApiService.fetchData('/api/undefined-data');
                fail("Debería haber fallado por datos undefined");
            } catch (error) {
                expect(error.message).toContain('Formato de datos de API inválido. Se esperaba un array');
            }
        });

        //Test 9: Respuesta vacía
         it("debe retornar un array vacío si el endpoint es válido pero sin datos", async function() {
            const mockData = [];
            const mockResponse = new Response(JSON.stringify(mockData), { status: 200 });
            window.fetch.and.returnValue(Promise.resolve(mockResponse));

            const data = await ApiService.fetchData('/api/empty');

            expect(data).toEqual([]);
            expect(EventBus.emit).toHaveBeenCalledWith('api:loading', false);
        });


        //Test 10:  Funciones de estado
        describe("Funciones de estado (showLoading, hideLoading, showError)", function() {
            it("showLoading debe emitir 'api:loading' con 'true'", function() {
                ApiService.showLoading();
                expect(EventBus.emit).toHaveBeenCalledWith('api:loading', true);
            });

            it("hideLoading debe emitir 'api:loading' con 'false'", function() {
                ApiService.hideLoading();
                expect(EventBus.emit).toHaveBeenCalledWith('api:loading', false);
            });

            it("showError debe emitir 'api:error' con el mensaje provisto", function() {
                const mensaje = 'Test de error';
                ApiService.showError(mensaje);
                expect(EventBus.emit).toHaveBeenCalledWith('api:error', mensaje);
            });
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

        it("debe llamar a ApiService.fetchData con el endpoint '/categorias'", async function() {
           ApiService.fetchData.and.returnValue(Promise.resolve([])); 
            
            await planificador.obtenerCategorias();
            
            expect(ApiService.fetchData).toHaveBeenCalledWith('./api/categorias.json', jasmine.any(Number));
        });
    
        it("debe manejar la excepción si fetchData lanza algo que no es un objeto Error", async function() {
            const nonError = 'Un error no Error';
            ApiService.fetchData.and.rejectWith(nonError);

            const resultado = await planificador.obtenerCategorias();

            expect(resultado).toEqual([]);
            expect(console.error).toHaveBeenCalled();
        });
    });
});