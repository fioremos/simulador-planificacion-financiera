const ApiService = {
    fetchData: async (endpoint) => {
        if(endpoint === '/invalid-endpoint') throw new Error('HTTP error');
        return []; 
    }
};

const DataProcessor = {
    mapData: (data) => data 
};

describe("ApiService", function() {
    describe("fetchData()", function() {
        it("debe obtener datos exitosamente de la API", async function()
        {
            // Test de caso exitoso
            const data = await ApiService.fetchData('/endpoint');
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
        });
        it("debe manejar errores HTTP correctamente", async function() {
            // Test de error 404 
            try {
                await ApiService.fetchData('/invalid-endpoint');
                fail("Debería haber lanzado un error");
            } catch (error) {
                expect(error.message).toContain('HTTP error');
            }
        });
        it("debe procesar datos con map correctamente", function() {
            const rawData = [{id: 1, name: 'Test'}];
            const processed = DataProcessor.mapData(rawData);
            expect(processed).toBeDefined();
            expect(processed.length).toBe(1);
        });
    });
});