
describe("Flujo 1: Agregar Movimiento", function () {
    beforeEach(function () {
        spyOn(window, 'alert').and.stub();
    });  

    describe("Función esFechaValida()", function () {
        it("debería aceptar una fecha pasada", function () {
            const pasado = "2025-10-01";
            expect(esFechaValida(pasado)).toBeTruthy();
        });
        it("debería aceptar la fecha de hoy", function () {
            const hoy = new Date().toISOString().slice(0, 10);
            expect(esFechaValida(hoy)).toBeTruthy();
        });
        it("debería rechazar una fecha futura", function () {
            const futura = "2025-12-31";
            expect(esFechaValida(futura)).toBeFalsy();
        });
        it("debería rechazar una cadena inválida", function () {
            const noFecha = "asd";
            expect(esFechaValida(noFecha)).toBeFalsy();
        });
        it("debería rechazar una fecha con formato incorrecto", function () {
            const formatoIncorrecto = "01-10-2025";
            expect(esFechaValida(formatoIncorrecto)).toBeFalsy();
        });
        it("debería rechazar una fecha vacía", function () {
            expect(esFechaValida("")).toBeFalsy();
        });
    });

    describe("Función esTipoValido()", function () {
        it("debería aceptar 'tipos' esperados", function () {
            expect(esTipoValido("Ingreso")).toBeTruthy();
        });
        it("debería aceptar 'tipos' con espacios alrededor", function () {
            expect(esTipoValido(" Ingreso ")).toBeTruthy();
        });
        it("debería aceptar 'tipos' en mayúscula", function () {
            expect(esTipoValido("INGRESO")).toBeTruthy();
        });
        it("debería aceptar 'tipos' en minúscula", function () {
            expect(esTipoValido("ingreso")).toBeTruthy();
        });
        it("debería rechazar string vacío", function () {
            expect(esTipoValido("")).toBeFalsy();
        });
        it("debería rechazar 'tipos' no esperados", function () {
            expect(esTipoValido("Otro")).toBeFalsy();
        });
    });

    describe("Función esCategoriaValida()", function () {
        it("debería aceptar categorías esperadas", function () {
            expect(esCategoriaValida("Hogar")).toBeTruthy();
        });
        it("debería aceptar categorías con espacios alrededor", function () {
            expect(esCategoriaValida(" Hogar ")).toBeTruthy();
        });
        it ("debería aceptar categorías en mayúscula", function () {
            expect(esCategoriaValida("HOGAR")).toBeTruthy();
        });
        it ("debería aceptar categorías en minúscula", function () {
            expect(esCategoriaValida("hogar")).toBeTruthy();
        });
        it ("deberia rechazar string vacío", function () {
            expect(esCategoriaValida("")).toBeFalsy();
        });
        it("debería rechazar categorías no esperadas", function () {
            expect(esCategoriaValida("Desconocida")).toBeFalsy();
        });
    });

    describe("Validaciones de monto con función pedirDatosMovimiento()", function () {
        it("debería aceptar monto positivo", function () {
            spyOn(window, 'prompt').and.returnValues("2025-01-01", "Ingreso", "Sueldo", "10000");
            const montoPositivo = pedirDatosMovimiento();
            expect(montoPositivo.monto).toBeTruthy();
        });
        it("debería aceptar monto decimal positivo", function () {
            spyOn(window, 'prompt').and.returnValues("2025-01-01", "Ingreso", "Sueldo", "10000.75");
            const montoDecimal = pedirDatosMovimiento();
            expect(montoDecimal.monto).toBeTruthy();
        });
        it("debería aceptar monto muy grande", function () {
            spyOn(window, 'prompt').and.returnValues("2025-01-01", "Ingreso", "Sueldo", "9999999999");
            const montoGrande = pedirDatosMovimiento();
            expect(montoGrande.monto).toBeTruthy();
        });
        it("debería rechazar monto cero", function () {
            spyOn(window, 'prompt').and.returnValues("2025-01-01", "Ingreso", "Sueldo", "0");
            const montoCero = pedirDatosMovimiento();
            expect(montoCero.monto).toBeFalsy();
        });
        it("debería rechazar monto negativo", function () {
            spyOn(window, 'prompt').and.returnValues("2025-01-01", "Ingreso", "Sueldo", "- 10000");
            const montoNegativo = pedirDatosMovimiento();
            expect(montoNegativo.monto).toBeFalsy();
        });
        it("debería rechazar monto no numérico", function () {
            spyOn(window, 'prompt').and.returnValues("2025-01-01", "Ingreso", "Sueldo", "abc");
            const montoNoNumerico = pedirDatosMovimiento();
            expect(montoNoNumerico.monto).toBeFalsy();
        });
    });
});



describe("Flujo 2: Metas de Ahorro", function () {
    beforeEach(function () {
        spyOn(window, 'alert').and.stub();
    });

    describe("Función esNombreValido()", function () {
        it("debería aceptar nombres con 2 o más caracteres", function () {
            expect(esNombreValido("Vacaciones")).toBeTruthy();
            expect(esNombreValido("A1")).toBeTruthy();
        });
        it ("debería aceptar nombres con espacios", function () {
            expect(esNombreValido("Mi Meta")).toBeTruthy();
        });
        it ("debería aceptar nombres con caracteres especiales", function () {
            expect(esNombreValido("#!%")).toBeTruthy();
        });
        it ("debería rechazar nombres con menos de 2 caracteres", function () {
            expect(esNombreValido("A")).toBeFalsy();
        });
        it ("debería rechazar nombres vacíos", function () {
            expect(esNombreValido("")).toBeFalsy();
        });
    });

    describe("Validaciones de monto en pedirMeta()", function () {
        it("debería aceptar monto positivo", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", "5000", "2026-12-31");
            const montoValido = pedirMeta();
            expect(montoValido).toBeTruthy();
        });
        it("debería aceptar monto decimal positivo", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", "7500.50", "2026-12-31");
            const montoDecimal = pedirMeta();
            expect(montoDecimal).toBeTruthy();
        });
        it("debería aceptar monto muy grande", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", "9999999999", "2026-12-31");
            const montoGrande = pedirMeta();
            expect(montoGrande).toBeTruthy();
        });
        it("deberia rechazar monto en cero", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", "0", "2026-12-31");
            const montoCero = pedirMeta();
            expect(montoCero).toBeFalsy();
        });
        it("debería rechazar monto negativo", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", "-1000", "2026-12-31");
            const montoNegativo = pedirMeta();
            expect(montoNegativo).toBeFalsy();
        });
        it("debería recharzar monto vacío", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", "", "2026-12-31");
            const montoVacio = pedirMeta();
            expect(montoVacio).toBeFalsy();
        });
        it("debería recharzar monto no numérico", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", "abc", "2026-12-31");
            const montoNoNumerico = pedirMeta();
            expect(montoNoNumerico).toBeFalsy();
        });
        it("debería recharzar monto con espacios", function () {
            spyOn(window, 'prompt').and.returnValues("Meta1", " 5000 ", "2026-12-31");
            const montoConEspacios = pedirMeta();
            expect(montoConEspacios).toBeFalsy();
        });
    });

    describe("Función esFechaFuturaValida()", function () {
        it("debería aceptar fechas futuras", function () {
            const futura = "2026-01-01";
            expect(esFechaFuturaValida(futura)).toBeTruthy();
        });
        it("debería aceptar fecha vacía", function () {
            expect(esFechaFuturaValida("")).toBeTruthy();
        });
        it("debería rechazar fechas pasadas", function () {
            const pasada = "2025-01-01";
            expect(esFechaFuturaValida(pasada)).toBeFalsy();
        });
        it ("debería rechazar fechas con formato incorrecto", function () {
            const formatoIncorrecto = "01-01-2026";
            expect(esFechaFuturaValida(formatoIncorrecto)).toBeFalsy();
        });
    });

});