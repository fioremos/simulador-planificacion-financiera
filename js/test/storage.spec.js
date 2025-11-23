import { StorageUtil }  from '../utils/storage.js';

describe("StorageUtil - Test Suite Completo", function () {

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    describe("guardar()", function (){

        it("debería guardar un valor primitivo en localStorage", () => {
            const ok = StorageUtil.guardar("test1", "Hola");

            expect(ok).toBeTrue();
            expect(localStorage.getItem("test1")).toBe("Hola");
        });

        it("debería guardar objetos serializados correctamente", () => {
            const obj = { nombre: "Usuario", edad: 22 };
            StorageUtil.guardar("usuario", obj);

            expect(JSON.parse(localStorage.getItem("usuario")).nombre === obj.nombre).toBeTrue();
            expect(JSON.parse(localStorage.getItem("usuario")).edad  === obj.edad).toBeTrue();
        });

        it("debería guardar en sessionStorage cuando se indica tipo = 'session'", () => {
            StorageUtil.guardar("x", 123, "session");
            expect(sessionStorage.getItem("x")).toBe("123");
        });

        /*it("debería retornar false si el storage supera el límite estimado", () => {
            for (let i = 1; i <= 19 * 1024 - 517; i++) {
                StorageUtil.guardar("grande"+ i, "34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890");
            }
            const ok = StorageUtil.guardar(18939,"34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890");
            expect(ok).toBeFalse();
        });*/

        it("debería manejar QuotaExceededError", () => {
            spyOn(localStorage, "setItem").and.throwError({ name: "QuotaExceededError" });
            const ok = StorageUtil.guardar("clave", "valor");
            expect(ok).toBeFalse();
        });

        it("no debería romperse si valor es undefined", () => {
            const ok = StorageUtil.guardar("undefinedTest", undefined);
            expect(ok).toBeTrue();
            expect(localStorage.getItem("undefinedTest")).toBe("undefined");
        });
    });


    describe("obtener()", () => {

        it("debería retornar null si la clave no existe", () => {
            expect(StorageUtil.obtener("inexistente")).toBeNull();
        });

        it("debería obtener valores JSON válidos", () => {
            localStorage.setItem("obj", JSON.stringify({ x: 1 }));
            expect(StorageUtil.obtener("obj")).toEqual({ x: 1 });
        });

        it("debería obtener valores primitivos", () => {
            localStorage.setItem("num", "123");
            expect(StorageUtil.obtener("num")).toBe(123);
        });

        it("debería manejar errores de JSON.parse correctamente", () => {
            localStorage.setItem("malo", "{no válido");
            expect(StorageUtil.obtener("malo")).toBeNull();
        });
    });


    describe("actualizar()", () => {
        it("debería actualizar valores existentes", () => {
            StorageUtil.guardar("k", 1);
            StorageUtil.actualizar("k", 999);

            expect(StorageUtil.obtener("k")).toBe(999);
        });
    });


    describe("eliminar()", () => {

        it("debería eliminar una clave existente", () => {
            StorageUtil.guardar("elim", "x");
            StorageUtil.eliminar("elim");

            expect(localStorage.getItem("elim")).toBeNull();
        });

        it("debería retornar true aunque la clave no exista", () => {
            expect(StorageUtil.eliminar("noExiste")).toBeTrue();
        });
    });


    describe("listar()", () => {

        it("debería devolver todas las claves si no hay prefijo", () => {
            StorageUtil.guardar("a1", 1);
            StorageUtil.guardar("a2", 2);
            StorageUtil.guardar("b1", 3);

            expect(StorageUtil.listar().length).toBe(3);
        });

        it("debería devolver solo claves que coincidan con el prefijo", () => {
            StorageUtil.guardar("user_01", "A");
            StorageUtil.guardar("user_02", "B");
            StorageUtil.guardar("data_01", "C");

            const keys = StorageUtil.listar("user_");
            expect(keys.length).toBe(2);
            expect(keys.includes("user_01")).toBeTrue();
        });
    });


    describe("limpiar()", () => {

        it("debería limpiar completamente localStorage", () => {
            StorageUtil.guardar("a", 1);
            StorageUtil.guardar("b", 2);
            StorageUtil.limpiar("local");

            expect(localStorage.length).toBe(0);
        });

        it("debería limpiar sessionStorage", () => {
            StorageUtil.guardar("x", 1, "session");
            StorageUtil.limpiar("session");

            expect(sessionStorage.length).toBe(0);
        });
    });


    describe("existe()", () => {

        it("debería retornar true si existe la clave", () => {
            StorageUtil.guardar("ok", 1);
            expect(StorageUtil.existe("ok")).toBeTrue();
        });

        it("debería retornar false si no existe la clave", () => {
            expect(StorageUtil.existe("nada")).toBeFalse();
        });
    });


    describe("Casos Bordes Complejos", () => {

        it("guardar objetos profundamente anidados", () => {
            const data = { a: { b: { c: { d: 123 } } } };
            const ok = StorageUtil.guardar("deep", data);
            expect(ok).toBeTrue();
            expect(StorageUtil.obtener("deep")).toEqual(data);
        });

        it("guardar arrays grandes", () => {
            const arr = Array.from({ length: 200 }, (_, i) => i);
            StorageUtil.guardar("arr", arr);

            expect(StorageUtil.obtener("arr").length).toBe(200);
        });

        it("manejar claves vacías", () => {
            const ok = StorageUtil.guardar("", "valor");
            expect(ok).toBeTrue();
            expect(localStorage.getItem("")).toBe("valor");
        });

        it("guardar null explícitamente", () => {
            StorageUtil.guardar("nulo", null);
            expect(StorageUtil.obtener("nulo")).toBeNull();
        });

        it("no romperse si se pasan números como clave", () => {
            StorageUtil.guardar(123, "x");
            expect(localStorage.getItem(123)).toBe("x");
        });
    });

});
