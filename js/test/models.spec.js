import { MetaAhorro } from '../models/MetaAhorro.js';
import { Movimiento } from '../models/Movimiento.js';
import { Planificador } from '../models/Planificador.js';
import { Exportador }   from '../models/Exportador.js';
import { ApiService } from '../api/apiService.js';

describe("Model Movimiento", function () {

    describe("Constructor Movimientos", function () {
        it("debería crear un movimient correctamente", function () {
            let movimiento = { tipo: 'Ingreso', categoria: 'Salud', categoriaNombres: 'Salud', fecha: '2025-01-15', monto: 200 };
            
            const mov = new Movimiento(                
                movimiento.fecha,
                movimiento.tipo,
                movimiento.categoria,
                movimiento.categoriaNombres,
                movimiento.monto,
                movimiento.objetivo);

            expect(mov instanceof Movimiento).toBeTrue();
            expect(mov.categoria).toBe('salud');  
            expect(mov.tipo).toBe('ingreso');  
            expect(mov.fecha).toEqual(new Date('2025-01-15'));  
            expect(mov.monto).toBe(200);  
        });


        it("No debería crear un movimiento por tipo invalido", function () {
            let movimiento = { tipo: 'Ingresar', categoria: 'Salud', fecha: '2025-01-15', monto: 200 };
            
            expect(() => new Movimiento(                
                movimiento.fecha,
                movimiento.tipo,
                movimiento.categoria,
                movimiento.monto,
                movimiento.objetivo))
                .toThrowError(/Datos de movimiento inválidos/);
        });

        it("No debería crear un movimiento por categoria invalido", function () {
            let movimiento = { tipo: 'Ingreso', categoria: 'Salida', fecha: '2025-01-15', monto: 200 };
            
            expect(() => new Movimiento(                
                movimiento.fecha,
                movimiento.tipo,
                movimiento.categoria,
                movimiento.monto,
                movimiento.objetivo))
                .toThrowError(/Datos de movimiento inválidos/);
        });

        it("No debería crear un movimiento por fecha invalido", function () {
            let movimiento = { tipo: 'Ingreso', categoria: 'Salud', fecha: '2025-12-15', monto: 200 };
            
            expect(() => new Movimiento(                
                movimiento.fecha,
                movimiento.tipo,
                movimiento.categoria,
                movimiento.monto,
                movimiento.objetivo))
                .toThrowError(/Datos de movimiento inválidos/);
        });

        it("No debería crear un movimiento por monto invalido", function () {
            let movimiento = { tipo: 'Ingreso', categoria: 'Salud', fecha: '2025-01-15', monto: -300 };
            
            expect(() => new Movimiento(                
                movimiento.fecha,
                movimiento.tipo,
                movimiento.categoria,
                movimiento.monto,
                movimiento.objetivo))
                .toThrowError(/Datos de movimiento inválidos/);
        });
    });

     describe("Movimiento.esFechaValida()", function () {
        it("debería aceptar una fecha pasada", function () {
            const pasado = "2025-10-01";
            expect(Movimiento.esFechaValida(pasado)).toBeTrue();
        });
       it("debería aceptar la fecha de hoy", function () {
            const hoy = new Date().toISOString().slice(0, 10);
            expect(Movimiento.esFechaValida(hoy)).toBeTrue();
        });
        it("debería rechazar una fecha futura", function () {
            const futura = "2026-12-31";
            expect(Movimiento.esFechaValida(futura)).toBeFalse();
        });
        it("debería rechazar una cadena inválida", function () {
            expect(Movimiento.esFechaValida("asd")).toBeFalse();
        });
        it("debería rechazar una fecha con formato incorrecto", function () {
            expect(Movimiento.esFechaValida("01-10-2025")).toBeFalse();
        });
        it("debería rechazar una fecha vacía", function () {
            expect(Movimiento.esFechaValida("")).toBeFalse();
        });
    });

     describe("Movimiento.esTipoValido()", function () {
        it("debería aceptar 'tipos' esperados", function () {
            expect(Movimiento.esTipoValido("Ingreso")).toBeTrue();
        });
        it("debería aceptar 'tipos' con espacios alrededor", function () {
            expect(Movimiento.esTipoValido(" Ingreso ")).toBeTrue();
        });
        it("debería aceptar 'tipos' en mayúscula", function () {
            expect(Movimiento.esTipoValido("INGRESO")).toBeTrue();
        });
        it("debería aceptar 'tipos' en minúscula", function () {
            expect(Movimiento.esTipoValido("ingreso")).toBeTrue();
        });
        it("debería rechazar string vacío", function () {
            expect(Movimiento.esTipoValido("")).toBeFalse();
        });
        it("debería rechazar 'tipos' no esperados", function () {
            expect(Movimiento.esTipoValido("Otro")).toBeFalse();
        });
    });

    describe("Movimiento.esCategoriaValida()", function () {
        it("debería aceptar categorías esperadas", function () {
            expect(Movimiento.esCategoriaValida("Hogar")).toBeTrue();
        });
        it("debería aceptar categorías con espacios alrededor", function () {
            expect(Movimiento.esCategoriaValida(" Hogar ")).toBeTrue();
        });
        it("debería aceptar categorías en mayúscula", function () {
            expect(Movimiento.esCategoriaValida("HOGAR")).toBeTrue();
        });
        it("debería aceptar categorías en minúscula", function () {
            expect(Movimiento.esCategoriaValida("hogar")).toBeTrue();
        });
        it("debería rechazar string vacío", function () {
            expect(Movimiento.esCategoriaValida("")).toBeFalse();
        });
        it("debería rechazar categorías no esperadas", function () {
            expect(Movimiento.esCategoriaValida("Desconocida")).toBeFalse();
        });
    });

    describe("Validación de montos en Movimiento.validar()", function () {
        it("debería aceptar monto positivo", function () {
            const datos = { fecha: "2025-01-01", tipo: "ingreso", categoria: "sueldo", monto: 10000 };
            expect(Movimiento.validar(datos)).toBeTrue();
        });
        it("debería aceptar monto decimal positivo", function () {
            const datos = { fecha: "2025-01-01", tipo: "ingreso", categoria: "sueldo", monto: 10000.75 };
            expect(Movimiento.validar(datos)).toBeTrue();
        });
        it("debería aceptar monto muy grande", function () {
            const datos = { fecha: "2025-01-01", tipo: "ingreso", categoria: "sueldo", monto: 9999999999 };
            expect(Movimiento.validar(datos)).toBeTrue();
        });
        it("debería rechazar monto cero", function () {
            const datos = { fecha: "2025-01-01", tipo: "ingreso", categoria: "sueldo", monto: 0 };
            expect(Movimiento.validar(datos)).toBeFalse();
        });
        it("debería rechazar monto negativo", function () {
            const datos = { fecha: "2025-01-01", tipo: "ingreso", categoria: "sueldo", monto: -10000 };
            expect(Movimiento.validar(datos)).toBeFalse();
        });
        it("debería rechazar monto no numérico", function () {
            const datos = { fecha: "2025-01-01", tipo: "ingreso", categoria: "sueldo", monto: "abc" };
            expect(Movimiento.validar(datos)).toBeFalse();
        });
    });

    describe("serialización", function () {
        describe('Movimiento.toJSON()', () => {
            it('debería serializar correctamente el movimiento', function () {
                const fecha = new Date("2024-05-10");
                const mov = new Movimiento(fecha, "ingreso", "sueldo", "Sueldo", 5000, 12);

                const json = mov.toJSON();

                expect(json).toEqual({
                    id: mov.id,
                    fecha: "2024-05-10",
                    tipo: "ingreso",
                    categoria: "sueldo",
                    categoriaNombres: "Sueldo",
                    monto: 5000,
                    idObjetivo: 12
                });
            });

        });


        describe('Movimiento.fromJSON()', () => {
            it('debería reconstruir instancia desde JSON preservando datos', function () {
                const data = {
                    id: 10,
                    fecha: "2024-04-22",
                    tipo: "gasto",
                    categoria: "salud",
                    categoriaNombres: "Salud",
                    monto: 350,
                    idObjetivo: 5
                };

                const mov = Movimiento.fromJSON(data);

                expect(mov).toBeInstanceOf(Movimiento);
                expect(mov.toJSON()).toEqual(data);
            });

            it('debería asignar null a idObjetivo si no viene en el JSON', function () {
                const data = {
                    id: 10,
                    fecha: "2024-04-22",
                    tipo: "gasto",
                    categoria: "salud",
                    categoriaNombres: "Salud",
                    monto: 350,
                };

                const mov = Movimiento.fromJSON(data);

                const json = mov.toJSON();
                expect(json.idObjetivo).toBe(null);
            });

        });
    });
        
});

describe("Model Metas de Ahorro", function () {
    
    describe("Constructor Metas Ahorro", function () {
        it("debería crear un meta ahorro correctamente", function () {
            let mDeAhorro = { nombre: "Estudios", montoObjetivo: 10000, fechaObjetivo: "2026-05-01" };
            
            const mda = new MetaAhorro(                
                mDeAhorro.nombre,
                mDeAhorro.montoObjetivo,
                mDeAhorro.fechaObjetivo);

            expect(mda instanceof MetaAhorro).toBeTrue();
            expect(mda.nombre).toBe('Estudios');  
            expect(mda.montoObjetivo).toBe(10000);  
            expect(mda.fechaObjetivo).toEqual(new Date('2026-05-01'));  
        });


        it("No debería crear una meta por nombre invalido", function () {
            let mDeAhorro = { nombre: "E", montoObjetivo: 10000, fechaObjetivo: "2026-05-01" };

            
            expect(() => new MetaAhorro(                
                mDeAhorro.nombre,
                mDeAhorro.montoObjetivo,
                mDeAhorro.fechaObjetivo))
                .toThrowError(/Datos de meta de ahorro inválidos/);
        });

                it("No debería crear una meta por montoObjetivo invalido", function () {
            let mDeAhorro = { nombre: "Estudio", montoObjetivo: 0, fechaObjetivo: "2026-05-01" };

            
            expect(() => new MetaAhorro(                
                mDeAhorro.nombre,
                mDeAhorro.montoObjetivo,
                mDeAhorro.fechaObjetivo))
                .toThrowError(/Datos de meta de ahorro inválidos/);
        });

        it("No debería crear una meta por fecha invalido", function () {
            let mDeAhorro = { nombre: "Estudio", montoObjetivo: 10000, fechaObjetivo: "2025-05-01" };

            
            expect(() => new MetaAhorro(                
                mDeAhorro.nombre,
                mDeAhorro.montoObjetivo,
                mDeAhorro.fechaObjetivo))
                .toThrowError(/Datos de meta de ahorro inválidos/);
        });
    });

    describe("MetaAhorro.esNombreValido()", function () {
        it("debería aceptar nombres con 2 o más caracteres", function () {
            expect(MetaAhorro.esNombreValido("Vacaciones")).toBeTrue();
            expect(MetaAhorro.esNombreValido("A1")).toBeTrue();
        });

        it("debería aceptar nombres con espacios", function () {
            expect(MetaAhorro.esNombreValido("Mi Meta")).toBeTrue();
        });

        it("debería aceptar nombres con caracteres especiales", function () {
            expect(MetaAhorro.esNombreValido("#!%")).toBeTrue();
        });

        it("debería rechazar nombres con menos de 2 caracteres", function () {
            expect(MetaAhorro.esNombreValido("A")).toBeFalse();
        });

        it("debería rechazar nombres vacíos", function () {
            expect(MetaAhorro.esNombreValido("")).toBeFalse();
        });
    });

    describe("MetaAhorro.esMontoValido()", function () {
        it("debería aceptar monto positivo", function () {
            const datos = { nombre: "Meta1", montoObjetivo: 5000, fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeTrue();
        });

        it("debería aceptar monto decimal positivo", function () {
            const datos = { nombre: "Meta1", montoObjetivo: 7500.50, fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeTrue();
        });

        it("debería aceptar monto muy grande", function () {
            const datos = { nombre: "Meta1", montoObjetivo: 9999999999, fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeTrue();
        });

        it("debería rechazar monto cero", function () {
            const datos = { nombre: "Meta1", montoObjetivo: 0, fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeFalse();
        });

        it("debería aceptar monto negativo", function () {
            const datos = { nombre: "Meta1", montoObjetivo: -1000, fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeTrue();
        });

        it("debería rechazar monto vacío", function () {
            const datos = { nombre: "Meta1", montoObjetivo: "", fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeFalse();
        });

        it("debería rechazar monto no numérico", function () {
            const datos = { nombre: "Meta1", montoObjetivo: "abc", fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeFalse();
        });

        it("debería aceptar montos con espacios adelante y/o al final", function () {
            const datos = { nombre: "Meta1", montoObjetivo: " 5000 ", fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeTrue();
        });
    });

    describe("MetaAhorro.esFechaFuturaValida()", function () {
        it("debería aceptar fechas futuras", function () {
            const futura = "2026-01-01";
            expect(MetaAhorro.esFechaFuturaValida(futura)).toBeTrue();
        });

        it("debería aceptar fecha vacía", function () {
            expect(MetaAhorro.esFechaFuturaValida("")).toBeTrue();
        });

        it("debería rechazar fechas pasadas", function () {
            const pasada = "2025-01-01";
            expect(MetaAhorro.esFechaFuturaValida(pasada)).toBeFalse();
        });

        it("debería rechazar fechas con formato incorrecto", function () {
            const formatoIncorrecto = "01-01-2026";
            expect(MetaAhorro.esFechaFuturaValida(formatoIncorrecto)).toBeFalse();
        });
    });

    describe("serialización", function () {
        describe('MetaAhorro.toJSON()', () => {
            it('debería serializar correctamente la meta de ahorro', function () {
                const fecha = "2026-05-10";
                const mov = new MetaAhorro("Viaje", 5000, fecha);

                const json = mov.toJSON();

                expect(json).toEqual({
                    id: mov.id,
                    nombre: "Viaje",
                    montoObjetivo: 5000,
                    fechaObjetivo: "2026-05-10",
                    montoActual: 0
                });
            });

            it('debería serializar correctamente la meta de ahorro sin fecha', function () {
                const mov = new MetaAhorro("Viaje", 5000);

                const json = mov.toJSON();

                expect(json).toEqual({
                    id: mov.id,
                    nombre: "Viaje",
                    montoObjetivo: 5000,
                    fechaObjetivo: null,
                    montoActual: 0
                });
            });

        });

        describe('MetaAhorro.fromJSON()', () => {
            it('debería reconstruir instancia desde JSON preservando datos', function () {
                const data = {
                    id: 10,
                    nombre: "Auto nuevo",
                    montoObjetivo: 20000,
                    fechaObjetivo: "2026-03-15",
                    montoActual: 5000
                };

                const mov = MetaAhorro.fromJSON(data);

                expect(mov).toBeInstanceOf(MetaAhorro);
                expect(mov.toJSON()).toEqual(data);
            });

            it('debería genera un id automáticamente si no se envía uno', function () {
                const data = {
                    nombre: "Auto nuevo",
                    montoObjetivo: 20000,
                    fechaObjetivo: "2026-03-15",
                    montoActual: 5000
                };

                const mov = MetaAhorro.fromJSON(data);

                expect(mov).toBeInstanceOf(MetaAhorro);
                expect(mov.id).not.toBeNull();
            });

            it('asigna montoActual = 0 si no viene en el JSON', function () {
                const data = {
                    id: 10,
                    nombre: "Auto nuevo",
                    montoObjetivo: 20000,
                    fechaObjetivo: "2026-03-15",
                };

                const mov = MetaAhorro.fromJSON(data);

                expect(mov).toBeInstanceOf(MetaAhorro);
                expect(mov.montoActual).toBe(0);
            });

        });
    });

});

describe("Model Exportardor", function () {
    let exportador;

    beforeEach(function () {
        exportador = new Exportador();
    });

    describe("Constructor Exportador", function () {
        it("debería crear un exportador correctamente", function () {
            
            expect(exportador instanceof Exportador).toBeTrue();
            expect(exportador.filtrosExportacion).toEqual({ 
                tipo: [],
                formato: "",
                nombreArchivo: "",
                rutaDestino: "" 
            });  
        });
    });

    describe("Exportador.hayDatosSeleccionados()", function () {
        it("debería aceptar tipos de datos disponibles (resumen-cuenta)", function () {
            const seleccion = ['resumen-cuenta'];

            expect(exportador.validarConfiguracion({tipo: seleccion, formato:  "CSV", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería aceptar varios tipos de datos disponibles (Movimientos, Metas)", function () {
            const seleccion = ['resumen-cuenta' , 'inversiones'];

            expect(exportador.validarConfiguracion({tipo: seleccion, formato:  "CSV", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería rechazar tipos de datos incorrectos (movimientos)", function () {
            const seleccion = ['movimientos'];

            expect(exportador.validarConfiguracion({tipo: seleccion, formato:  "CSV", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });

        it("debería rechazar tipos de datos vacíos", function () {
            const seleccion = [];

            expect(exportador.validarConfiguracion({tipo: seleccion, formato:  "CSV", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });
    });

    describe("Exportador.esFormatoValido()", function () {
        it("debería aceptar formatos válidos (CSV, PDF, JSON, XLSX)", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "CSV", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "PDF", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})) .toBeTrue();
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato: "JSON", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato: "XLSX", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería aceptar formatos válidos en minúscula (csv, pdf, json, xlsx)", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "csv", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "pdf", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato: "json", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato: "xlsx", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería rechazar formatos inválidos (XML, TXT)", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "XML", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "TXT", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });

        it("debería rechazar formatos vacíos", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'],formato:  "", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });
    });

    describe("Exportador.sonNombreYRutaValidos()", function () {
        it("debería aceptar nombre y ruta válidos", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "CSV", nombreArchivo: "reporte", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería rechazar nombre vacío", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "CSV", nombreArchivo: "", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });

        it("debería rechazar ruta vacía", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "CSV", nombreArchivo: "reporte", rutaDestino:""})).toBeFalse();
        });

        it("debería rechazar nombre con extensión (reporte.pdf)", function () {
            expect(exportador.validarConfiguracion({tipo: ['resumen-cuenta'], formato:  "CSV", nombreArchivo: "reporte.pdf", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });
    });

    describe("serialización", function () {
        describe('Exportador.toJSON()', () => {
            it('serializa correctamente los filtros', function () {
                const exp = new Exportador();
                exp.filtrosExportacion = { a: 1, b: 2 };

                const json = exp.sessionToJSON();

                expect(json).toEqual({
                    filtrosExportador: JSON.stringify({ a: 1, b: 2 })
                });
            });
        });

        describe('Exportador.sessionExpFromJSON()', () => {
            it('carga correctamente los filtros cuando se pasa un objeto', function () {
                const exp = new Exportador();

                const filtros = { x: 10, y: 20 };
                exp.sessionExpFromJSON(filtros);

                expect(exp.filtrosExportacion).toEqual(filtros);
            });

            it('no cambia filtrosExportacion si se pasa null', function () {
                const exp = new Exportador();
                exp.filtrosExportacion = { inicial: true };

                exp.sessionExpFromJSON(null);

                expect(exp.filtrosExportacion).toEqual({ inicial: true });
            });
        });
    });

});

describe("Model Planificador", function () {
     let planificador;

    beforeEach(function () {
        spyOn(ApiService, 'fetchData').and.returnValue(Promise.resolve([]));
        planificador = new Planificador();  
    });

    describe("Constructor Planificador", function () {
        it("debería crear un planificador correctamente", function () {
            
            expect(planificador instanceof Planificador).toBeTrue();
            expect(planificador.movimientos).toEqual([]);  
            expect(planificador.metasAhorro).toEqual([]);  
            expect(planificador.filtros).toEqual({   
                fechaAscii: "",
                fechaDesde: "",
                fechaHasta: "",
                categoria: "Todas",
                moneda: "ARS"
            });  
        });
    });

    describe("Función agregarMovimiento()", function () {
        it("debería aceptar movimientos con categoría válida (salud)", function () {
            const movimiento = { tipo: 'Ingreso', categoria: 'Salud', fecha: '2025-01-01', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toBeTruthy();
        });

        it("debería aceptar categorías válidas en mayúscula (SALUD)", function () {
            const movimiento = { tipo: 'Ingreso', categoria: 'SALUD', fecha: '2025-01-01', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toBeTruthy();
        });

        it("debería aceptar categorías válidas en minúscula (salud)", function () {
            const movimiento = { tipo: 'Ingreso', categoria: 'salud', fecha: '2025-01-01', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toBeTruthy();
        });

        it("debería rechazar categorías con espacios (' ')", function () {
            const movimiento = { tipo: 'Ingreso', categoria: ' ', fecha: '2025-01-01', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toThrowError();
        });

        it("debería rechazar categorías inválidas (abc)", function () {
            const movimiento = { tipo: 'Ingreso', categoria: 'abc', fecha: '2025-01-01', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toThrowError();
        });

        it("debería rechazar fechas 'desde' futuras en formato correcto (YYYY-MM-DD)", function () {
            const movimiento = { tipo: 'Ingreso', categoria: 'Salud', fecha: '2026-01-01', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toThrowError();
        });

        it("debería rechazar fechas en formato incorrecto (DD-MM-YYYY)", function () {
            const movimiento = { tipo: 'Ingreso', categoria: 'Salud', fecha: '01-01-2025', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toThrowError();
        });

        it("debería rechazar fechas 'desde' no válidas", function () {
            const movimiento = { tipo: 'Ingreso', categoria: 'Salud', fecha: 'abc', monto: 1000 };
            expect(() => {
                planificador.agregarMovimiento(movimiento);
            }).toThrowError();
        });

    });

    
    describe("Función eliminarMovimiento()", function () {
        it("debería eliminar un movimiento correctamente", function () {
            let movimiento = { tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200 };
            
            movimiento = planificador.agregarMovimiento(movimiento);  // Primero agregamos el movimiento
            const movimientosPrevios = planificador.movimientos.length;

            planificador.eliminarMovimiento(movimiento.id);  // Ahora lo eliminamos
            expect(planificador.movimientos.length).toBe(movimientosPrevios - 1);  // Verificamos que la longitud disminuyó
        });


        it("debería no eliminar un movimiento que no existe", function () {
            const movimientoInexistente = { tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200 };
            const movimientosPrevios = planificador.movimientos.length;

            planificador.eliminarMovimiento(movimientoInexistente);  // Intentamos eliminar algo que no está
            expect(planificador.movimientos.length).toBe(movimientosPrevios);  // El tamaño no debería cambiar
        });

        it("debería eliminar un movimiento correctamente usando un identificador único", function () {
            let movimiento = { tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200 };
            
            movimiento = planificador.agregarMovimiento(movimiento);  // Primero lo agregamos
            const movimientosPrevios = planificador.movimientos.length;

            planificador.eliminarMovimiento(movimiento.id);  // Asumimos que eliminamos con la fecha como identificador único
            expect(planificador.movimientos.length).toBe(movimientosPrevios - 1);
        });
    });

    describe('Funcion categoriasPermitidasPorTipo()', function () {

        const mockCategorias = [
            { categoria: 'Ingreso', opciones: ['Sueldo', 'Intereses', 'Venta Activo'] },
            { categoria: 'Gasto', opciones: ['Alimentos', 'Transporte Público', 'Hipoteca'] },
            { categoria: 'Ahorro', opciones: [] },
            { categoria: 'Inversion', opciones: ['Fondo Común', 'Acciones Exterior'] }
        ];

        it('debe retornar las opciones para un tipo válido', function () {
            planificador.diccCategorias = mockCategorias;
            const tipo = 'Ingreso';
            
            const resultadoEsperado = ['sueldo', 'intereses', 'ventaactivo'];
            
            expect(planificador.categoriasPermitidasPorTipo(tipo)).toEqual(resultadoEsperado);
        });

        
        it('debe funcionar correctamente independientemente del case del tipo seleccionado', function () {
            planificador.diccCategorias = mockCategorias;
            const tipo = 'iNgReSo';
            
            const resultadoEsperado = ['sueldo', 'intereses', 'ventaactivo'];
            
            expect(planificador.categoriasPermitidasPorTipo(tipo)).toEqual(resultadoEsperado);
        });

        it('debe lanzar un error si this.diccCategorias está vacío', function () {
            planificador.diccCategorias = [];
            
            // Se espera que la llamada lance un Error con el mensaje específico
            expect(() => planificador.categoriasPermitidasPorTipo('Gasto')).toThrowError(/No se pudieron cargar las categorías./);
        });
        
        it('debe retornar null si el tipo seleccionado no se encuentra en las categorías', function () {
            planificador.diccCategorias = mockCategorias;
            const tipoInexistente = 'Transferencia';
            
            expect(planificador.categoriasPermitidasPorTipo(tipoInexistente)).toBeNull();
        });

        it('debe retornar null si la categoría existe pero su array de opciones está vacío', function ()  {
            planificador.diccCategorias = mockCategorias;
            const tipoVacio = 'Ahorro';
            
            // 'Ahorro' existe en mockCategorias, pero sus opciones están vacías []
            expect(planificador.categoriasPermitidasPorTipo(tipoVacio)).toBeNull();
        });

    });
    
    describe("Función agregarMetaAhorro()", function () {
        it("debería agregar una meta válida correctamente", function () {
            const datos = {
                nombre: "Viaje a Japón",
                montoObjetivo: 5000,
                fechaObjetivo: "2025-12-31"
            };
            
            const meta = planificador.agregarMetaAhorro(datos);
            const fechaMeta = new Date(meta.fechaObjetivo).toISOString().split('T')[0]; // 'YYYY-MM-DD'
            
            expect(meta.nombre).toBe("Viaje a Japón");
            expect(meta.montoObjetivo).toBe(5000);
            expect(fechaMeta).toBe("2025-12-31");
        });

        it("debería agregar la meta al arreglo interno #metasAhorro", function () {
            const datos = { nombre: "Auto nuevo", montoObjetivo: 20000, fechaObjetivo: "2025-12-10" };
            const metasPrevias = planificador.metasAhorro?.length || 0;  // asumiendo que hay getter público
            planificador.agregarMetaAhorro(datos);
            expect(planificador.metasAhorro.length).toBe(metasPrevias + 1);
        });

        it("debería lanzar error si el nombre está vacío", function () {
            const datos = { nombre: "", montoObjetivo: 1000, fechaObjetivo: "2025-12-31" };
            expect(() => planificador.agregarMetaAhorro(datos))
                .toThrowError(/Error al agregar meta de ahorro/);
        });

        it("debería lanzar error si el monto objetivo no es un número", function () {
            const datos = { nombre: "Ahorro de emergencia", montoObjetivo: "mil", fechaObjetivo: "2025-12-31" };
            expect(() => planificador.agregarMetaAhorro(datos))
                .toThrowError(/Error al agregar meta de ahorro/);
        });

        it("debería lanzar error si el monto objetivo es negativo", function () {
            const datos = { nombre: "Casa nueva", montoObjetivo: -50000, fechaObjetivo: "2025-12-31" };
            expect(() => planificador.agregarMetaAhorro(datos))
                .toThrowError(/Error al agregar meta de ahorro/);
        });

        it("debería lanzar error si la fecha está en formato incorrecto", function () {
            const datos = { nombre: "Viaje", montoObjetivo: 3000, fechaObjetivo: "31-12-2025" };
            expect(() => planificador.agregarMetaAhorro(datos))
                .toThrowError(/Error al agregar meta de ahorro/);
        });

        it("debería lanzar error si la fecha objetivo es pasada", function () {
            const datos = { nombre: "Reparación", montoObjetivo: 2000, fechaObjetivo: "2023-01-01" };
            expect(() => planificador.agregarMetaAhorro(datos))
                .toThrowError(/Error al agregar meta de ahorro/);
        });

        it("debería devolver un objeto MetaAhorro válido al agregarse", function () {
            const datos = { nombre: "Estudios", montoObjetivo: 10000, fechaObjetivo: "2026-05-01" };
            const meta = planificador.agregarMetaAhorro(datos);
            
            expect(meta instanceof MetaAhorro).toBeTrue();
            expect(meta.toJSON).toBeDefined();
        });
    });

    describe("serialización", function () {
        describe('MetaAhorro.toJSON()', function ()  {
            it('debería serializar correctamente la meta de ahorro', function () {
                const fecha = "2026-05-10";
                const mov = new MetaAhorro("Viaje", 5000, fecha);

                const json = mov.toJSON();

                expect(json).toEqual({
                    id: mov.id,
                    nombre: "Viaje",
                    montoObjetivo: 5000,
                    fechaObjetivo: "2026-05-10",
                    montoActual: 0
                });
            });

            it('debería serializar correctamente la meta de ahorro sin fecha', function () {
                const mov = new MetaAhorro("Viaje", 5000);

                const json = mov.toJSON();

                expect(json).toEqual({
                    id: mov.id,
                    nombre: "Viaje",
                    montoObjetivo: 5000,
                    fechaObjetivo: null,
                    montoActual: 0
                });
            });

        });

        describe('MetaAhorro.fromJSON()', function ()  {
            it('debería reconstruir instancia desde JSON preservando datos', function () {
                const data = {
                    id: 10,
                    nombre: "Auto nuevo",
                    montoObjetivo: 20000,
                    fechaObjetivo: "2026-03-15",
                    montoActual: 5000
                };

                const mov = MetaAhorro.fromJSON(data);

                expect(mov).toBeInstanceOf(MetaAhorro);
                expect(mov.toJSON()).toEqual(data);
            });

            it('debería genera un id automáticamente si no se envía uno', function () {
                const data = {
                    nombre: "Auto nuevo",
                    montoObjetivo: 20000,
                    fechaObjetivo: "2026-03-15",
                    montoActual: 5000
                };

                const mov = MetaAhorro.fromJSON(data);

                expect(mov).toBeInstanceOf(MetaAhorro);
                expect(mov.id).not.toBeNull();
            });

            it('asigna montoActual = 0 si no viene en el JSON', function () {
                const data = {
                    id: 10,
                    nombre: "Auto nuevo",
                    montoObjetivo: 20000,
                    fechaObjetivo: "2026-03-15",
                };

                const mov = MetaAhorro.fromJSON(data);

                expect(mov).toBeInstanceOf(MetaAhorro);
                expect(mov.montoActual).toBe(0);
            });

        });
    });

    describe("serialización", function () {
        describe('Planificador.localToJSON()', function ()  {
            it('serializa correctamente movimientos y metas', function () {
                const movMock = { toJSON: () => ({ id: 1, tipo: "gasto" }) };
                const metaMock = { toJSON: () => ({ id: 10, nombre: "Meta 1" }) };

                const plan = new Planificador();
                plan.movimientos = [movMock];
                plan.metasAhorro = [metaMock];

                const json = plan.localToJSON();

                expect(json).toEqual({
                    movimientos: [{ id: 1, tipo: "gasto" }],
                    metasAhorro: [{ id: 10, nombre: "Meta 1" }]
                });
            });
        });

        describe('Planificador.sessionToJSON()', function ()  {
            it('serializa correctamente los filtros', function () {
                const plan = new Planificador();
                plan.filtros = { año: 2025, tipo: "ingreso" };

                const json = plan.sessionToJSON();

                expect(json).toEqual({
                    filtros: JSON.stringify({ año: 2025, tipo: "ingreso" })
                });
            });
        });

        describe("Planificador.localFromJSON()", function ()  {
            it('reconstruye movimientos y metas usando los fromJSON correspondientes', function () {
                const jsonData = {
                    movimientos: [{ id:1, tipo: 'Ingreso', categoria: 'Salud', fecha: '2025-01-15', monto: 200 }],
                    metasAhorro: [{ id:2, nombre: "Viaje", montoObjetivo: 5000, fechaObjetivo: "2026-05-10", montoActual: 0 }]
                };

                const plan = Planificador.localFromJSON(jsonData);

                expect(plan.movimientos.length).toBe(1);
                expect(plan.metasAhorro.length).toBe(1);
                expect(plan.movimientos[0] instanceof Movimiento);
                expect(plan.metasAhorro[0] instanceof MetaAhorro);
            });

            it('si json es null, devuelve un planificador con arrays vacíos', function () {
                const plan = Planificador.localFromJSON(null);

                expect(plan.movimientos).toEqual([]);
                expect(plan.metasAhorro).toEqual([]);
            });
        });

        describe("Planificador.sessionRepFromJSON()", function ()  {
            it('carga correctamente filtros si se pasa un objeto', function () {
                const filtros = { mes: "Enero", categoria: "Gastos" };

                Planificador.sessionRepFromJSON(filtros);

                expect(Planificador.filtros).toEqual(filtros);
            });

            it('no sobrescribe filtros si recibe null', function () {
                Planificador.filtros = { activo: true };

                Planificador.sessionRepFromJSON(null);

                expect(Planificador.filtros).toEqual({ activo: true });
            });
        });
    });
});
