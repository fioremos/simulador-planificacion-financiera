/**
 * Representa un movimiento financiero
 * @typedef {Object} Movimiento
 * @property {string} fecha
 * @property {string} tipo
 * @property {string} categoria
 * @property {number} monto
 */

/**
 * Valida si una cadena es una fecha válida en el pasado
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD
 * @returns {boolean}
 */
function esFechaValida(fechaStr) {
    const regexFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regexFecha.test(fechaStr)) { return false; }

    const fecha = new Date(fechaStr);
    const hoy = new Date();
    
    // Limpiar la hora
    fecha.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    return fecha <= hoy;
}

/**
 * Verifica si el tipo ingresado es válido.
 *
 * @param {string} tipo - El tipo de movimiento ingresado por el usuario.
 * @returns {boolean} Retorna `true` si el tipo es uno de los valores permitidos, de lo contrario `false`.
 */
function esTipoValido(tipo) {
    const tiposValidos = ['ingreso', 'ahorro', 'inversión', 'gasto'];
    return tiposValidos.includes(tipo.trim().toLowerCase());
}

/**
 * Verifica si la categoría ingresada es válida.
 *
 * @param {string} categoria - La categoría del movimiento ingresada por el usuario.
 * @returns {boolean} Retorna `true` si la categoría es una de las permitidas, de lo contrario `false`.
 */
function esCategoriaValida(categoria) {
    const categoriasValidas = ['hogar', 'ocio', 'salud', 'sueldo', 'objetivos', 'otros'];
    return categoriasValidas.includes(categoria.trim().toLowerCase());
}

/**
 * Verifica si los campos del movimiento están completos
 * @param {Movimiento} movimiento
 * @returns {boolean}
 */
function camposCompletos(movimiento) {
    return (
        movimiento.fecha.trim() !== '' &&
        movimiento.tipo.trim() !== '' &&
        movimiento.categoria.trim() !== '' &&
        !isNaN(movimiento.monto)
    );
}

/**
 * Pide al usuario que ingrese un nuevo movimiento
 * @returns {Movimiento}
 */
function pedirDatosMovimiento() {
    const fecha = prompt('Ingrese la fecha del movimiento (YYYY-MM-DD):');
    const tipo = prompt('Ingrese el tipo de movimiento:\n- Ingreso\n- Ahorro\n- Inversión\n- Gasto');
    const categoria = prompt('Ingrese la categoría del movimiento:\n- Hogar\n- Ocio\n- Salud\n- Sueldo\n- Objetivos\n- Otros');
    const montoStr = prompt('Ingrese el monto del movimiento:');
    const monto = parseFloat(montoStr);

    return { fecha, tipo, categoria, monto };
}

/**
 * Simula enviar los datos al backend y guardar el movimiento
 * @param {Movimiento} movimiento
 */
function guardarMovimiento(movimiento) {
    console.log('Enviando al backend:', movimiento);

    // Simular acciones del backend
    console.log('Movimiento guardado en base de datos');
    console.log('Saldo actualizado');
    console.log('Historial actualizado');

    alert('Movimiento agregado con éxito');
}

/**
 * Flujo principal: agregar movimiento (con bucle hasta que esté válido)
 */
function agregarMovimientoFlow() {
    let movimiento;
    let errores = true;

    do {
        movimiento = pedirDatosMovimiento();

        if (!camposCompletos(movimiento)) {
            alert('Hay campos obligatorios incompletos');
            continue;
        }

        if (!esFechaValida(movimiento.fecha)) {
            alert('La fecha debe ser anterior a hoy y en formato válido (YYYY-MM-DD)');
            continue;
        }

        if (!esTipoValido(movimiento.tipo)) {
            alert('Tipo inválido. Debe ser uno de: Ingreso, Ahorro, Inversión o Gasto.');
            continue;
        }

        if (!esCategoriaValida(movimiento.categoria)) {
            alert('Categoría inválida. Debe ser una de: Hogar, Ocio, Salud, Sueldo, Objetivos u Otros.');
            continue;
        }

        if (movimiento.monto <= 0) {
            alert('El monto debe ser un número mayor a 0');
            continue;
        }

        errores = false; // todos los datos están OK

    } while (errores);

    guardarMovimiento(movimiento);
}

/**
 * @typedef {Object} MetaAhorro
 * @param {Array} metas
 * @property {string} nombre
 * @property {number} monto
 * @property {string|null} fechaObjetivo - Formato YYYY-MM-DD o null
 */
// ==== Datos simulados ====
const metas = [
    {
        nombre: 'Vacaciones 2026',
        monto: 300000,
        fechaObjetivo: '2026-01-01'
    }
];

/**
 * Verifica si un nombre es válido (no vacío, mínimo 2 caracteres)
 * @param {string} nombre
 * @returns {boolean}
 */
function esNombreValido(nombre) {
    return nombre.trim().length >= 2;
}

/**
 * Verifica si la fecha ingresada es futura o está vacía
 * @param {string|null} fechaStr
 * @returns {boolean}
 */
function esFechaFuturaValida(fechaStr) {
    if (!fechaStr || fechaStr.trim() === '') return true;
    
    const regexFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regexFecha.test(fechaStr)) { return false; }

    const fecha = new Date(fechaStr);
    const hoy = new Date();
    
    fecha.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    return fecha > hoy;
}

/**
 * Pide al usuario los datos de la nueva meta de ahorro
 * @returns {MetaAhorro|null}
 */
function pedirMeta() {
    const nombre = prompt("Ingrese el nombre de la meta:");
    const montoStr = prompt("Ingrese el monto objetivo:");
    const fecha = prompt("Ingrese la fecha objetivo (YYYY-MM-DD) (opcional):");
    const monto = parseFloat(montoStr);

    // Validaciones
    if (isNaN(monto) || monto <= 0 || montoStr.includes(' ')) {
        alert("Monto inválido. Debe ser un número mayor a 0.");
        return null;
    }

    if (!esNombreValido(nombre)) {
        alert("Nombre inválido. Debe tener al menos 2 caracteres.");
        return null;
    }

    if (!esFechaFuturaValida(fecha)) {
        alert("La fecha objetivo debe ser futura o dejarse vacía.");
        return null;
    }

    return {
        nombre: nombre.trim(),
        monto,
        fechaObjetivo: fecha && fecha.trim() !== '' ? fecha.trim() : null,
    };
}

/**
 * Flujo para crear una nueva meta de ahorro
 */
function crearMetaAhorro() {
    let meta = null;

    do {
        meta = pedirMeta();
    } while (!meta);

    // Simulamos "guardar en base de datos"
    metas.push(meta);
    console.log("Meta guardada:", meta);

    alert("Meta guardada con éxito.");
}

/**
 * Muestra las metas disponibles y permite seleccionar una para ver detalles
 */
function visualizarMeta() {
    if (metas.length === 0) {
        alert("No hay metas creadas todavía.");
        return;
    }

    // Mostrar lista
    let lista = "Metas disponibles:\n";
    metas.forEach((meta, i) => {
        lista += `${i + 1}. ${meta.nombre}\n`;
    });

    const seleccionStr = prompt(`${lista}\nIngrese el número de la meta a visualizar:`);
    const seleccion = parseInt(seleccionStr);

    if (isNaN(seleccion) || seleccion < 1 || seleccion > metas.length) {
        alert("Meta no encontrada.");
        return;
    }

    const metaElegida = metas[seleccion - 1];

    console.log("Meta consultada:", metaElegida);
    alert(`Detalles de la Meta:\n- Nombre: ${metaElegida.nombre}\n- Monto objetivo: $${metaElegida.monto}\n- Fecha objetivo: ${metaElegida.fechaObjetivo || 'No definida'}`);
}

/**
 * Menú principal de flujo de metas de ahorro
 */
function metasAhorroFlow() {
    const opcion = prompt(`Gestión de Metas de Ahorro\n Seleccione una opción:\n1. Agregar una nueva meta\n2. Visualizar una meta existente`);

    if (opcion === '1') {
        crearMetaAhorro();
    } else if (opcion === '2') {
        visualizarMeta();
    } else {
        alert("Opción inválida.");
    }
}

/**
 * @typedef {"CSV" | "PDF" | "JSON"} FormatoExportacion
 */

/**
 * Verifica si hay al menos un tipo de dato seleccionado
 * @param {string[]} datosSeleccionados
 * @returns {boolean}
 */
function hayDatosSeleccionados(datosSeleccionados) {
    return Array.isArray(datosSeleccionados) && datosSeleccionados.length > 0;
}

/**
 * Verifica si el formato es válido
 * @param {string} formato
 * @returns {boolean}
 */
function esFormatoValido(formato) {
    const formatosPermitidos = ['CSV', 'PDF', 'JSON'];
    return formatosPermitidos.includes(formato.toUpperCase());
}

/**
 * Verifica que el nombre de archivo y la ruta estén completos
 * @param {string} nombre
 * @param {string} ruta
 * @returns {boolean}
 */
function sonNombreYRutaValidos(nombre, ruta) {
    return nombre.trim() !== '' && ruta.trim() !== '';
}

/**
 * Simula el proceso de generación de archivo y retorno desde el backend
 * @param {string[]} tiposDatos
 * @param {FormatoExportacion} formato
 * @param {string} nombreArchivo
 * @param {string} rutaDestino
 * @returns {boolean} - true si la exportación fue exitosa
 */
function procesarExportacion(tiposDatos, formato, nombreArchivo, rutaDestino) {
    console.log('Enviando datos al backend...');
    console.log(`Datos: ${tiposDatos.join(', ')}`);
    console.log(`Formato: ${formato}`);
    console.log(`Nombre del archivo: ${nombreArchivo}`);
    console.log(`Ruta destino: ${rutaDestino}`);

    return true;
}

/**
 * Flujo principal: Exportar datos
 */
function exportarDatosFlow() {
    let exportacionExitosa = false;

    do {
        //Selección de tipos de datos
        const tiposDisponibles = ['Movimientos', 'Metas', 'Presupuesto', 'Historial'];
        const seleccion = prompt(`¿Qué datos desea exportar? (separe con coma)\nOpciones:\n${tiposDisponibles.join(', ')}`);
        const tiposSeleccionados = seleccion
            ? seleccion.split(',').map(e => e.trim()).filter(e => tiposDisponibles.includes(e))
            : [];

        if (!hayDatosSeleccionados(tiposSeleccionados)) {
            alert('Debe seleccionar al menos un tipo de dato válido.');
            continue;
        }

        //Selección de formato
        const formato = prompt('Formato de exportación:\n- CSV\n- PDF\n- JSON').toUpperCase();

        if (!esFormatoValido(formato)) {
            alert('Formato inválido. Debe ser CSV, PDF o JSON.');
            continue;
        }

        // 3. Nombre del archivo
        const nombreArchivo = prompt('Ingrese el nombre del archivo (sin extensión):');
        const rutaArchivo = prompt('Ingrese la ruta del directorio de exportación:');

        if (!sonNombreYRutaValidos(nombreArchivo, rutaArchivo)) {
            alert('El nombre del archivo y la ruta son obligatorios.');
            continue;
        }

        // 4. Procesar exportación
        exportacionExitosa = procesarExportacion(tiposSeleccionados, formato, nombreArchivo, rutaArchivo);

    } while (!exportacionExitosa);

    alert('Exportación exitosa. El archivo fue generado correctamente.');

}

/**
 * Filtra los datos en base a los filtros activos
 * @param {Array} datos
 * @param {Object} filtros
 * @returns {Array}
 */

// ==== Datos simulados ====
const datosFinancieros = [
    { tipo: 'Ingreso', categoria: 'Sueldo', fecha: '2025-09-01', monto: 150000 },
    { tipo: 'Gasto', categoria: 'Hogar', fecha: '2025-09-10', monto: 25000 },
    { tipo: 'Gasto', categoria: 'Ocio', fecha: '2025-09-15', monto: 18000 },
    { tipo: 'Ingreso', categoria: 'Freelance', fecha: '2025-09-20', monto: 60000 },
    { tipo: 'Gasto', categoria: 'Salud', fecha: '2025-09-21', monto: 30000 },
    { tipo: 'Ahorro', categoria: 'Objetivos', fecha: '2025-09-30', monto: 40000 }
];

// ==== Filtros por defecto ====
let filtros = {
    fechaDesde: '2025-09-01',
    fechaHasta: '2025-09-30',
    moneda: 'ARS',
    categoria: 'Todas'
};

/**
 * Filtra los datos financieros según los filtros de fecha y categoría.
 *
 * @param {Array<Object>} datos - Lista de objetos con información financiera. Cada objeto debe tener una propiedad `fecha` y `categoria`.
 * @param {Object} filtros - Filtros a aplicar. Debe contener `fechaDesde`, `fechaHasta` y `categoria`.
 * @returns {Array<Object>} Un nuevo array con los datos filtrados que coinciden con los filtros.
 */
function filtrarDatos(datos, filtros) {
    const desde = new Date(filtros.fechaDesde);
    const hasta = new Date(filtros.fechaHasta);

    return datos.filter(d => {
        const fecha = new Date(d.fecha);
        const enRango = fecha >= desde && fecha <= hasta;
        const categoriaCoincide = filtros.categoria === 'Todas' || d.categoria === filtros.categoria;
        const esIngreso = d.tipo === 'Ingreso';
        return enRango && categoriaCoincide || esIngreso;
    });
}

/**
 * Calcula indicadores financieros básicos
 * @param {Array} datos
 * @returns {filtros}
 */
function calcularIndicadores(datos) {
    const ingresos = datos.filter(d => d.tipo === 'Ingreso').reduce((acc, cur) => acc + cur.monto, 0);
    const gastos = datos.filter(d => d.tipo === 'Gasto').reduce((acc, cur) => acc + cur.monto, 0);
    const ahorro = datos.filter(d => d.tipo === 'Ahorro').reduce((acc, cur) => acc + cur.monto, 0);
    const saldo = ingresos - gastos;
    const porcentajeAhorro = ingresos > 0 ? (ahorro / ingresos) * 100 : 0;

    return {
        ingresos,
        gastos,
        ahorro,
        saldo,
        porcentajeAhorro: porcentajeAhorro.toFixed(2)
    };
}

/**
 * Muestra el reporte basado en los datos filtrados
 * @param {Array} datos
 */
function mostrarReporte(datos) {
    if (datos.length === 0) {
        alert('No hay datos para los filtros seleccionados.\nSe generó un reporte vacío.');
        return;
    }

    const indicadores = calcularIndicadores(datos);

    let resumen = `Reporte Financiero:
Intervalo: ${filtros.fechaDesde} a ${filtros.fechaHasta}
Categoria: ${filtros.categoria}
Moneda: ${filtros.moneda} 

Ingresos: $${indicadores.ingresos}
Gastos: $${indicadores.gastos}
Ahorro: $${indicadores.ahorro}
Saldo promedio: $${indicadores.saldo}
% Ahorro: ${indicadores.porcentajeAhorro}%
`;

    console.log('Filtros aplicados correctamente.');
    alert(resumen);
}

/**
 * Verifica si una categoría es válida dentro de las permitidas.
 *
 * @param {string} categoria - Categoría ingresada por el usuario.
 * @returns {boolean} Devuelve `true` si la categoría es válida, de lo contrario `false`.
 */
function categoriaValida(categoria) {
    const categorias = ["Todas", "Ocio", "Hogar", "Salud", "Objetivos"]
    return categorias.includes(categoria);
}

/**
 * Permite al usuario cambiar los filtros actuales.
 * @returns {boolean} Devuelve `true` si algún filtro fue modificado, `false` si no hubo cambios.
 */
function configurarFiltros() {
    let nuevaFechaDesde = prompt(`Fecha Desde (actual: ${filtros.fechaDesde}):`) || filtros.fechaDesde;
    let nuevaFechaHasta = prompt(`Fecha Hasta (actual: ${filtros.fechaHasta}):`) || filtros.fechaHasta;
    let nuevaMoneda = prompt(`Moneda (actual: ${filtros.moneda}):`) || filtros.moneda;
    let nuevaCategoria = prompt(`Categoría (actual: ${filtros.categoria})\n(Todas, Ocio, Hogar, Salud, Objetivos):`) || filtros.categoria;

    while (!esFechaValida(nuevaFechaDesde)){
        alert('La fecha desde no puede posterior al dia de hoy')
        nuevaFechaDesde = prompt(`Fecha Desde (actual: ${filtros.fechaDesde}):`) || filtros.fechaDesde;
    }

    while (!categoriaValida(nuevaCategoria)) {
        alert('Categoria no valida. Ingrese nuevamente.');
        nuevaCategoria = prompt(`Categoría (actual: ${filtros.categoria})\n(Todas, Ocio, Hogar, Salud, Objetivos):`) || filtros.categoria;
    }

    const filtrosAnteriores = { ...filtros };

    filtros = {
        fechaDesde: nuevaFechaDesde,
        fechaHasta: nuevaFechaHasta,
        moneda: nuevaMoneda,
        categoria: nuevaCategoria
    };

    // Ver si cambió algo
    return JSON.stringify(filtros) !== JSON.stringify(filtrosAnteriores);
}

/**
 * Flujo principal: Visualizar Reporte Financiero
 */
function reporteFinancieroFlow() {
    alert(`Visualizar Reporte Financiero\n
Filtros por defecto aplicados:
- Fecha: ${filtros.fechaDesde} a ${filtros.fechaHasta}
- Moneda: ${filtros.moneda}
- Categoría: ${filtros.categoria}
`);

    let seguir = true;

    while (seguir) {
        const datosFiltrados = filtrarDatos(datosFinancieros, filtros);
        mostrarReporte(datosFiltrados);

        const cambiar = prompt('¿Desea cambiar los filtros? (sí / no)').toLowerCase();

        if (cambiar === 'si') {
            const cambiaron = configurarFiltros();
            if (!cambiaron) {
                console.log('No se cambió ningún filtro.');
                seguir = false;
            }
        } else {
            seguir = false;
        }
    }

    alert('Fin del reporte.');
}

function menuDesplegable() {
    const option = prompt(
        'Seleccione una opción:\n' +
        '1 - Agregar Movimiento\n' +
        '2 - Metas de Ahorro\n' +
        '3 - Exportar Datos\n' +
        '4 - Reporte Financiero'
    );

    switch (option) {
        case '1': {
            agregarMovimientoFlow();
            return;
        }
        case '2': {
            metasAhorroFlow();
            return;
        }
        case '3': {
            exportarDatosFlow();
            return;
        }
        case '4': {
            reporteFinancieroFlow();
            return;
        }
        default: {
            alert('Opción no válida.');
            return;
        }
    }
}

menuDesplegable()