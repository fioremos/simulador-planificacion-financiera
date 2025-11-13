describe("Flujo de ejecución", function () {
    describe("Fuljo 1: Creación de Movimiento con Planificador", function () {
        let planificador;

        beforeEach(function () {
            planificador = new Planificador();
        });  

        it("debería agregar correctamente un movimiento válido", function () {
            const movimiento = planificador.agregarMovimiento({
                fecha: "2025-01-01",
                tipo: "ingreso",
                categoria: "sueldo",
                monto: 5000
            });
            expect(planificador.movimientos.length).toBe(1);
            expect(movimiento.monto).toBe(5000);
        });

        it("debería lanzar error al intentar agregar movimiento inválido", function () {
            expect(() => {
                planificador.agregarMovimiento({
                    fecha: "asd",
                    tipo: "gasto",
                    categoria: "hogar",
                    monto: 100
                });
            }).toThrowError(/Error al agregar movimiento/);
        });
        
    });

    describe("Flujo 2: Creación de Meta de Ahorro con Planificador", function () {
        let planificador;

        beforeEach(function () {
            planificador = new Planificador();
        });

        it("debería agregar correctamente una meta de ahorro válida", function () {
            const metaObj = planificador.agregarMetaAhorro({
                nombre: "Vacaciones",
                montoObjetivo: 5000,
                fechaObjetivo: "2026-12-31"
            });
            expect(planificador.metasAhorro.length).toBe(1);
            expect(metaObj.montoObjetivo).toBe(5000);
        });

        it("debería lanzar error al intentar agregar meta de ahorro inválida", function () {
            expect(() => {
                planificador.agregarMetaAhorro({
                    nombre: "Meta Vacía",
                    montoObjetivo: -100,
                    fechaObjetivo: "2026-12-31"
                });
            }).toThrowError(/Error al agregar meta de ahorro/);
        });


    });

    describe("Flujo 3: Exportar Datos", function () {
        let exportador, planificador;

        beforeEach(function () {
            exportador = new Exportador();
            planificador = new Planificador();
        });

        it("happy path: llama a exportar con datos válidos y configuración correcta", function () {
            let movimiento = { tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200 };
            planificador.agregarMovimiento(movimiento);

            spyOn(console, 'log'); // Espejeamos la salida de log
            exportador.exportarDatos('resumen-cuenta', 'CSV', 'mi-reporte', 'C:\\Exports', planificador);

            expect(console.log).toHaveBeenCalledWith("Exportación exitosa.");
        });

        it("debería rechazar exportación con formato inválido", function () {
            let movimiento = { tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200 };
            planificador.agregarMovimiento(movimiento);

            spyOn(console, 'log'); // Espejeamos la salida de log
            exportador.exportarDatos('resumen-cuenta', 'XML', 'mi-reporte', 'C:\\Exports', planificador);

            // Verificamos que el mensaje de error sea el esperado por un formato inválido
            expect(console.log).not.toContain("Exportación exitosa.");

        });

        it("debería rechazar exportación con configuración inválida (ruta vacía)", function () {
            let movimiento = { tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200 };
            planificador.agregarMovimiento(movimiento);

            spyOn(console, 'log');
            exportador.exportarDatos('resumen-cuenta', 'XML', 'mi-reporte', '', planificador);
            
            expect(console.log).not.toContain("Exportación exitosa.");
        });

    });

    describe("Flujo 4: Generar Reporte Financiero", function () {
        let planificador;

        beforeEach(function () {
            planificador = new Planificador();  
        });


        it("debería sumar correctamente 'ingresos'", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 100 });
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 200 });
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 300 });
            
            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };
            const reporte = planificador.generarReporte(filtros);
            expect(reporte.total.ingresos).toBe(600);  // 100 + 200 + 300 = 600
        });
        it("debería sumar correctamente 'gastos'", function () {
            planificador.agregarMovimiento({ tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-01-15', monto: 150 });
            planificador.agregarMovimiento({ tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-01-15', monto: 250 });
            

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };
            const reporte = planificador.generarReporte(filtros);
            expect(reporte.total.gastos).toBe(400);  // 150 + 250 = 400
            });  
        it("debería sumar correctamente 'ahorro'", function () {
            planificador.agregarMovimiento({ tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 100 });
            planificador.agregarMovimiento({ tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200 });

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };
            const reporte = planificador.generarReporte(filtros);
            expect(reporte.total.ahorro).toBe(300);  // 100 + 200 = 300
        });

        it("debería calcular 'saldo' correctamente", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 1000 });
            planificador.agregarMovimiento({ tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-01-15', monto: 500 });
            

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const reporte = planificador.generarReporte(filtros);

            expect(reporte.total.saldo).toBe(500);  // Ingresos - Gastos = 1000 - 500 = 500
        });

        it("debería calcular 'porcentajeAhorro' correctamente", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 1000 });
            planificador.agregarMovimiento({ tipo: 'Ahorro', categoria: 'Hogar', fecha: '2025-01-15', monto: 200 });

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const reporte = planificador.generarReporte(filtros);

            expect(reporte.total.porcentajeAhorro).toBe('20.00');  // (200 / 1000) * 100 = 20%
        });
            
        it("debería manejar caso sin datos (todo cero)", function () {
                

                const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

                const reporte = planificador.generarReporte(filtros);

                expect(reporte.total.ingresos).toBe(0);
                expect(reporte.total.gastos).toBe(0);
                expect(reporte.total.ahorro).toBe(0);
                expect(reporte.total.saldo).toBe(0);
                expect(reporte.total.porcentajeAhorro).toBe('0.00');
            });
            it("debería manejar casos con solo 'gastos'", function () {
            planificador.agregarMovimiento({ tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-01-15',  monto: 500 });

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const reporte = planificador.generarReporte(filtros);

            expect(reporte.total.ingresos).toBe(0);
            expect(reporte.total.gastos).toBe(500);
            expect(reporte.total.ahorro).toBe(0);
            expect(reporte.total.saldo).toBe(-500);  // No ingresos, solo gasto
            expect(reporte.total.porcentajeAhorro).toBe('0.00');
        });

            
        it("debería manejar casos con solo 'ahorro'", function () {
            planificador.agregarMovimiento({ tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 300 });

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const reporte = planificador.generarReporte(filtros);

            expect(reporte.total.ingresos).toBe(0);
            expect(reporte.total.gastos).toBe(0);
            expect(reporte.total.ahorro).toBe(300);
            expect(reporte.total.saldo).toBe(0);  // No ingresos ni gastos
            expect(reporte.total.porcentajeAhorro).toBe('0.00');
        });

        it("debería manejar casos con ingresos y gastos iguales", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 500 });
            planificador.agregarMovimiento({ tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-01-15', monto: 500 });

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const reporte = planificador.generarReporte(filtros);

            expect(reporte.total.ingresos).toBe(500);
            expect(reporte.total.gastos).toBe(500);
            expect(reporte.total.ahorro).toBe(0);
            expect(reporte.total.saldo).toBe(0);  // Ingresos - Gastos = 0
            expect(reporte.total.porcentajeAhorro).toBe('0.00');
        });
            
        it("debería manejar casos con 'ahorro' mayor que 'ingresos'", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 400 });
            planificador.agregarMovimiento({ tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15',  monto: 500 });

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const reporte = planificador.generarReporte(filtros);
            
            expect(reporte.total.ingresos).toBe(400);
            expect(reporte.total.gastos).toBe(0);
            expect(reporte.total.ahorro).toBe(500);
            expect(reporte.total.saldo).toBe(400);  // Ingresos - 0 = 400
            expect(reporte.total.porcentajeAhorro).toBe('125.00');  // (500 / 400) * 100 = 125%
        });
        
        it("debería manejar casos con 'gastos' mayores que 'ingresos'", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 300 });
            planificador.agregarMovimiento({ tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-01-15', monto: 500 });

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const reporte = planificador.generarReporte(filtros);

            expect(reporte.total.ingresos).toBe(300);
            expect(reporte.total.gastos).toBe(500);
            expect(reporte.total.ahorro).toBe(0);
            expect(reporte.total.saldo).toBe(-200);  // Ingresos - Gastos = -200
            expect(reporte.total.porcentajeAhorro).toBe('0.00');
        });
            
        it("debería manejar casos con decimales en montos", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-01-15', monto: 1000.75 });
            planificador.agregarMovimiento({ tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-01-15', monto: 500.25 });
            planificador.agregarMovimiento({ tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-01-15', monto: 200.50 });
            

            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-12-31', categoria: 'Todas' };

            const report = planificador.generarReporte(filtros);

            expect(report.total.ingresos).toBeCloseTo(1000.75, 2);
            expect(report.total.gastos).toBeCloseTo(500.25, 2);
            expect(report.total.ahorro).toBeCloseTo(200.50, 2);
            expect(report.total.saldo).toBeCloseTo(500.5, 2);
            expect(report.total.porcentajeAhorro).toBeCloseTo('20.03', 2);  // (200.50 / 1000.75) * 100
        });
            
        it("debería filtrar correctamente los datos según el rango de fechas y categoría", function () {
            planificador.agregarMovimiento({ tipo: 'Ingreso', monto: 1000, fecha: '2025-01-10', categoria: 'Sueldo' });
            planificador.agregarMovimiento({ tipo: 'Ingreso', monto: 500, fecha: '2025-02-10', categoria: 'Sueldo' });
            planificador.agregarMovimiento({ tipo: 'Gasto', monto: 200, fecha: '2025-01-20', categoria: 'Hogar' });
            planificador.agregarMovimiento({ tipo: 'Ahorro', monto: 100, fecha: '2025-03-15', categoria: 'Objetivos' });


            const filtros = { fechaDesde: '2025-01-01', fechaHasta: '2025-02-28', categoria: 'Sueldo' };

            const reporte = planificador.generarReporte(filtros);
<<<<<<< HEAD

=======
            
>>>>>>> bad003d (corrección en el valor del test)
            expect(reporte.total.ingresos).toBe(1500);  // Solo el ingreso de 'Sueldo'
            expect(reporte.total.gastos).toBe(0);
            expect(reporte.total.ahorro).toBe(0);
            expect(reporte.total.saldo).toBe(1500);  // Ingresos - 0 = 1000
        });
                

    });
});