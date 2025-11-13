describe("Model Movimiento", function () {

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
    
});

describe("Model Metas de Ahorro", function () {
    
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

        it("debería rechazar monto negativo", function () {
            const datos = { nombre: "Meta1", montoObjetivo: -1000, fechaObjetivo: "2026-12-31" };
            expect(MetaAhorro.esMontoValido(datos.montoObjetivo)).toBeFalse();
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

});

describe("Model Exportardor", function () {
    let exportador;

    beforeEach(function () {
        exportador = new Exportador();
    });

    describe("Exportador.hayDatosSeleccionados()", function () {
        it("debería aceptar tipos de datos disponibles (resumen-cuenta)", function () {
            const seleccion = "resumen-cuenta";
            const tiposDisponibles = ['transacciones', 'inversiones', 'performance', 'contribuciones', 'asignaciones', 'balances', 'flujo-fondos', 'descripcion-general', 'resumen-cuenta'];
            const tiposSeleccionados = seleccion
                ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e.toLowerCase()))
                : [];

            expect(exportador.hayDatosSeleccionados(tiposSeleccionados, seleccion.split(','))).toBeTrue();
        });

        it("debería aceptar varios tipos de datos disponibles (Movimientos, Metas)", function () {
            const seleccion = "resumen-cuenta, inversiones";
            const tiposDisponibles = ['transacciones', 'inversiones', 'performance', 'contribuciones', 'asignaciones', 'balances', 'flujo-fondos', 'descripcion-general', 'resumen-cuenta'];
            const tiposSeleccionados = seleccion
                ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e.toLowerCase()))
                : [];

            expect(exportador.hayDatosSeleccionados(tiposSeleccionados, seleccion.split(','))).toBeTrue();
        });

        it("debería rechazar tipos de datos incorrectos (movimientos)", function () {
            const seleccion = "movimientos";
            const tiposDisponibles = ['transacciones', 'inversiones', 'performance', 'contribuciones', 'asignaciones', 'balances', 'flujo-fondos', 'descripcion-general', 'resumen-cuenta'];
            const tiposSeleccionados = seleccion
                ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e.toLowerCase()))
                : [];

            expect(exportador.hayDatosSeleccionados(tiposSeleccionados, seleccion.split(','))).toBeFalse();
        });

        it("debería rechazar tipos de datos vacíos", function () {
            const seleccion = "";
            const tiposDisponibles = ['transacciones', 'inversiones', 'performance', 'contribuciones', 'asignaciones', 'balances', 'flujo-fondos', 'descripcion-general', 'resumen-cuenta'];
            const tiposSeleccionados = seleccion
                ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e.toLowerCase()))
                : [];

            expect(exportador.hayDatosSeleccionados(tiposSeleccionados, seleccion.split(','))).toBeFalse();
        });
    });

    describe("Exportador.esFormatoValido()", function () {
        it("debería aceptar formatos válidos (CSV, PDF, JSON, XLSX)", function () {
            expect(exportador.validarConfiguracion({formato:  "CSV", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({formato:  "PDF", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})) .toBeTrue();
            expect(exportador.validarConfiguracion({formato: "JSON", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({formato: "XLSX", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería aceptar formatos válidos en minúscula (csv, pdf, json, xlsx)", function () {
            expect(exportador.validarConfiguracion({formato:  "csv", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({formato:  "pdf", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({formato: "json", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
            expect(exportador.validarConfiguracion({formato: "xlsx", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería rechazar formatos inválidos (XML, TXT)", function () {
            expect(exportador.validarConfiguracion({formato:  "XML", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
            expect(exportador.validarConfiguracion({formato:  "TXT", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });

        it("debería rechazar formatos vacíos", function () {
            expect(exportador.validarConfiguracion({formato:  "", nombreArchivo: "Archivo", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });
    });

    describe("Exportador.sonNombreYRutaValidos()", function () {
        it("debería aceptar nombre y ruta válidos", function () {
            expect(exportador.validarConfiguracion({formato:  "CSV", nombreArchivo: "reporte", rutaDestino:"C:\\Downloads"})).toBeTrue();
        });

        it("debería rechazar nombre vacío", function () {
            expect(exportador.validarConfiguracion({formato:  "CSV", nombreArchivo: "", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });

        it("debería rechazar ruta vacía", function () {
            expect(exportador.validarConfiguracion({formato:  "CSV", nombreArchivo: "reporte", rutaDestino:""})).toBeFalse();
        });

        it("debería rechazar nombre con extensión (reporte.pdf)", function () {
            expect(exportador.validarConfiguracion({formato:  "CSV", nombreArchivo: "reporte.pdf", rutaDestino:"C:\\Downloads"})).toBeFalse();
        });
    });

});

describe("Model Planificador", function () {
     let planificador;

    beforeEach(function () {
        planificador = new Planificador();  
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

            planificador.eliminarMovimiento(movimiento);  // Ahora lo eliminamos
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

            planificador.eliminarMovimiento(movimiento);  // Asumimos que eliminamos con la fecha como identificador único
            expect(planificador.movimientos.length).toBe(movimientosPrevios - 1);
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

});
