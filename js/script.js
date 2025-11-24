// =============================================================
// Importar clases del dominio (usando módulos ES6)
// =============================================================
import { Planificador } from './models/Planificador.js';
import { Exportador }   from './models/Exportador.js';
import { AlertUtils }   from './utils/alerts.js';


// =============================================================
// Variables globales de estado
// =============================================================

// Literales
const trashIcon = 'assets/images/iconos/Trash_2.png';
const trashIconAlt = 'logo_tacho_borrar';

const reportesOption = 'reportes';
const exportadorOption = 'exportar';
const loginOption = 'login'; 
const metasOption = 'metas';

/** @type {Object|null} Filtros actuales para reportes */
let filtros = {fechaDesde: "", fechaHasta: "", categoria: "", moneda: ""};

/** @type {Planificador} Instancia principal del planificador */
let planificador = new Planificador();

/** @type {NodeListOf<HTMLElement>} Lista de secciones principales del contenido */
let secciones;

/** @type {HTMLElement|null} Barra lateral de navegación */
let sidebar;

/** @type {HTMLElement|null} Cabecera principal del sitio */
let header;

/** @type {HTMLElement|null} Contenedor principal que engloba las secciones */
let principalContainer;

/** @type {HTMLElement|null} Elemento Offcanvas del sidebar (modo móvil) */
let offcanvasEl;

/** @type {HTMLElement|null} Exporatador usado por planificador */
let exportador = new Exportador;

/** @type {HTMLElement} Elemento para mostrar el grafico del reporte */
let grafico;
let metaGrafico;

/** @type {HTMLElement} Opciones originales de las categorias */
let categoriaSelects;
let opcionesOriginales = new Map();


// =============================================================
// Event Listeners
// =============================================================

/**
 * Evento principal que se ejecuta cuando el DOM está completamente cargado.
 * Realiza la inicialización de los elementos globales y determina qué sección mostrar inicialmente.
 *
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Cachear selectores para evitar consultas repetidas
    secciones = document.querySelectorAll('.principal-section');
    sidebar = document.querySelector('.sidebar');
    header = document.getElementById('main-header');
    principalContainer = document.querySelector('.principal-main');
    offcanvasEl = document.getElementById('sidebarOffcanvas');

    // Determinar la sección inicial a mostrar desde el hash de la URL
    let hash = window.location.hash.replace('#', '') || loginOption;

    // Si no hay hash, establecer "login" como predeterminado y limpiar parámetros extra
    if (!window.location.hash) {
        window.location.hash = hash;

        // Limpiar parámetros de autenticación de la URL sin recargar la página
        const url = new URL(window.location);
        url.searchParams.delete('usuario');
        url.searchParams.delete('password');
        window.history.replaceState({}, '', url);
    }

    //Cargo las variables locales si existen
    let datosLocales = planificador.obtenerVariables('planificador', 'local');
    if (datosLocales){
        planificador = Planificador.localFromJSON(datosLocales);

        // Listar movimientos y metas en la interfaz
        listarMovimientos(planificador.localToJSON().movimientos);
        listarMetas(planificador.localToJSON().metasAhorro);
        actualizarRadiosConMetas();
    }  


    // Guardamos un mapa con las opciones originales de cada select
    categoriaSelects = document.querySelectorAll('select[name="categoria"]');
    categoriaSelects.forEach((select, index) => {
        opcionesOriginales.set(index, Array.from(select.options));
    });

    // Mostrar la sección inicial
    mostrarSeccion(hash);
});

/**
 * Delegación de eventos sobre el `body` para manejar clics en enlaces internos.
 *
 * Permite la navegación fluida entre secciones del SPA sin recargar la página.
 * También actualiza el hash de la URL y oculta el menú lateral si está abierto.
 *
 * @event click
 * @param {MouseEvent} e - Evento de clic.
 */
document.body.addEventListener('click', e => {
    /** @type {HTMLAnchorElement|null} Enlace interno (si aplica) */
    const enlace = e.target.closest('a[href^="#"]');
    if (!enlace) return;

    const id = enlace.getAttribute('href').substring(1);
    if (!id) return;

    const destino = document.getElementById(id);

    // Verifica si el destino pertenece a una sección principal
    if (destino && destino.classList.contains('principal-section')) {
        e.preventDefault();

        // Actualiza el hash de la URL solo si cambió
        if (window.location.hash !== `#${id}`) {
            window.location.hash = id;
        }

        // Muestra la nueva sección solicitada
        mostrarSeccion(id);

        // Oculta el menú lateral (offcanvas) si está abierto
        if (offcanvasEl) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (offcanvas) offcanvas.hide();
        }
    }
});

/**
 * Listener global para ocultar el sidebar (offcanvas)
 * automáticamente cuando se redimensiona la ventana.
 *
 * Evita que el panel lateral quede abierto al cambiar entre
 * modos de escritorio y móvil.
 *
 * @event resize
 */
window.addEventListener('resize', () => {
    if (offcanvasEl && offcanvasEl.classList.contains('show')) {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
    }
});

//================= Listener de las secciones ===========================

/**
 * Inicializa los listeners de los formularios de ingresos y gastos.
 * Busca los formularios en el DOM y agrega el manejador de envío.
 */

/** @type {HTMLFormElement|null} Formulario principal de ingresos y gastos */
if (document.querySelector('#form-ingresos-gastos')) {
    document.querySelector('#form-ingresos-gastos').addEventListener('submit', manejarMovimientoSubmit);
}

/** @type {HTMLFormElement|null} Formulario modal de dashboard */
if (document.querySelector('#form-dashboard-modal')) {
    document.querySelector('#form-dashboard-modal').addEventListener('submit', manejarMovimientoSubmit);
}

/**
 * Inicializa el botón de exportación de datos.
 */

/** @type {HTMLButtonElement|null} Botón de exportación de datos */
if (document.querySelector('#exportar-container .btn')) {
    document.querySelector('#exportar-container .btn').addEventListener('click', manejarExportar);
}

/**
 * Inicializa los reportes y configura los filtros por defecto.
 */

/** @type {HTMLFormElement|null} Formulario de filtros de movimientos */
if (document.getElementById('movimientos-form')) {
    document.getElementById('movimientos-form').addEventListener('change', manejarReportes);
}

/**
 * Inicializa los formularios de metas y objetivos de ahorro.
 */

/** @type {HTMLFormElement|null} Formulario modal para metas de ahorro */
if (document.querySelector('#form-metas-modal')) {
    document.querySelector('#form-metas-modal').addEventListener('submit', manejarGuardarMeta);
}

/** @type {HTMLFormElement|null} Formulario modal para objetivos de ahorro */
if (document.querySelector('#form-objetivo-modal')) {
    document.querySelector('#form-objetivo-modal').addEventListener('submit', manejarMostrarObjetivo);
}

/**
 * Inicializa los listeners de los grupos de radio buttons para el tipo de movimiento.
 * Si se selecciona "ahorro", abre el combo correspondiente; si no, oculta todos los combos de ahorro.
 */


if(document.querySelectorAll('input[name="tipo"]')){
    document.querySelectorAll('input[name="tipo"]').forEach(radio => {
        radio.addEventListener("change", function() {      
            // Opciones permitidas según tipo
            const opcionesPorTipo = { ingreso: ["sueldo"], ahorro: ["objetivos"], inversion: ["inversiones"], gasto: ["hogar", "ocio", "salud"] };
            const tipoSeleccionado = this.value;
            const permitidas = opcionesPorTipo[tipoSeleccionado];

            if(this.checked) {
                if (this.value === "ahorro") {
                    if(!abrirCombo()){
                        setFeedback('No hay metas de ahorro disponibles. Por favor, crea una antes de asignar un movimiento de ahorro.', true);
                        this.checked = false;
                        return;
                    }
                } else {
                    /** @type {HTMLCollectionOf<HTMLElement>} Todos los elementos con clase 'form-ahorro' */
                    Array.from(document.getElementsByClassName("form-ahorro")).forEach(el => {
                        el.classList.remove("visible");
                        el.classList.add("invisible");
                    });
                }
            }

            categoriaSelects.forEach((select, index) => {
                const opciones = opcionesOriginales.get(index);

                // Limpiar opciones
                select.innerHTML = "";

                // Agregar solo las permitidas
                opciones.forEach(opt => {
                    if (permitidas.includes(opt.value)) {
                        select.appendChild(opt.cloneNode(true));
                    }
                });

                // Seleccionar automáticamente la primera opción válida
                if (select.options.length > 0) {
                    select.selectedIndex = 0;
                }
            });

        });
    });
}

// =============================================================
//  Funciones de inicialización
// =============================================================
/**
 * Inicializa el formulario de exportación con valores predefinidos.
 * 
 * Si se reciben filtros de exportación, marca los inputs correspondientes
 * (tipo de archivo y datos a exportar) y completa el nombre y la ubicación del archivo.
 * 
 * @param {Object} filtrosExportacion - Objeto con los valores de configuración.
 *        {string} filtrosExportacion.formato - Formato de exportación (ej. "csv", "json").
 *        {Array<string>} filtrosExportacion.tipo - Tipos de datos a exportar (ej. ["movimientos", "metasAhorro"]).
 *        {string} filtrosExportacion.nombreArchivo - Nombre del archivo de exportación.
 *        {string} filtrosExportacion.rutaDestino - Ruta destino donde se guardará el archivo.
 */
function initExportador(filtrosExportacion) {
    if (filtrosExportacion){

        document.querySelector(`#exportar-container input[name="tipoExp"][value="${filtrosExportacion.formato}"]`).checked = true;
        const checkboxes = document.querySelectorAll('#exportar-container input[name="datos"]');

        checkboxes.forEach(cb => {
            cb.checked = filtrosExportacion.tipo.includes(cb.value);
        });

        document.querySelector('#nombre').value = filtrosExportacion.nombreArchivo;
        document.querySelector('#ubicacion').value = filtrosExportacion.rutaDestino;
    }
}

/**
 * Inicializa los reportes financieros y configura los filtros por defecto o guardados.
 * 
 * - Si se proporcionan filtros guardados, rellena los campos del formulario con esos valores.
 * - Si no, toma los valores actuales de los inputs del DOM.
 * - Luego actualiza las fechas, genera el reporte, el gráfico y actualiza la sección de gastos.
 * 
 * @param {Object|null} [filtrosGuardado=null] - Filtros previamente guardados para inicializar el reporte.
 * @param {string} filtrosGuardado.fechaAscii - Fecha en formato ASCII para filtrar los movimientos.
 * @param {string} filtrosGuardado.categoria - Categoría seleccionada para filtrar.
 * @param {string} filtrosGuardado.moneda - Moneda seleccionada para filtrar.
 */
function initReportes(filtrosGuardado = null) {
    let fechaAscii;
    if(!filtrosGuardado){
        fechaAscii = document.getElementById('fechaRyE').value;
        filtros.categoria = document.getElementById('categoriaRyE').value;
        filtros.moneda = document.getElementById('moneda').value;
    } else{
        document.getElementById('fechaRyE').value = filtrosGuardado.fechaAscii;
        document.getElementById('categoriaRyE').value = filtrosGuardado.categoria;
        document.getElementById('moneda').value = filtrosGuardado.moneda;

        fechaAscii = filtrosGuardado.fechaAscii;
        filtros.categoria = filtrosGuardado.categoria;
        filtros.moneda = filtrosGuardado.moneda;
    }

    actualizarFechas(fechaAscii, filtros);

    const datos = planificador.generarReporte(filtros, fechaAscii);
    generarGraficoReporte(datos.datosFiltrados);
    actualizarReporteGastos(datos);
}



// =============================================================
//  Funciones manejadoras de eventos
// =============================================================
/**
 * Maneja el evento de envío del formulario de movimientos.
 * Valida los datos y los envía al planificador.
 * 
 * @param {SubmitEvent} event - Evento de envío del formulario.
 */
function manejarMovimientoSubmit(event) {
    event.preventDefault();
    const form = event.target;

    const datos = {
        fecha: form.querySelector('input[name="fecha"]').value,
        tipo: form.querySelector('input[name="tipo"]:checked')?.value || '',
        categoria: form.querySelector('select[name="categoria"]').value,
        monto: parseFloat(form.querySelector('input[name="monto"]').value),
        objetivo: (form.querySelector('select[name="categoria"]').value==='objetivos')? form.querySelector('select[name="objetivos"]').value:null,
    };

    try {
        const movimiento = planificador.agregarMovimiento(datos);
        planificador.actualizarLocalVariables('planificador', 'planificador', null);
        setFeedback('Movimiento agregado con éxito.', false);
        crearFilaMovimiento(datos, movimiento);
        
        Array.from(document.getElementsByClassName("form-ahorro")).forEach(el => {
            el.classList.remove("visible");
            el.classList.add("invisible");
            });
    

        if (window.location.hash === "#dashboard") {
            cerrarModal('miModal');
        }

        //Reseteo el combo de categorias:
        categoriaSelects.forEach((select, index) => {
            const opciones = opcionesOriginales.get(index);

            // Limpiar opciones
            select.innerHTML = "";

            // Agregar solo las permitidas
            opciones.forEach(opt => {
                select.appendChild(opt.cloneNode(true));
 
            });

            // Seleccionar automáticamente la primera opción válida
            if (select.options.length > 0) {
                select.selectedIndex = 0;
            }
        });

        form.reset();
    } catch (error) {
        setFeedback(error, true);
        cerrarModal('miModal');
    }
}

/**
 * Maneja la exportación de datos seleccionados.
 * 
 * @param {MouseEvent} event - Evento del clic en el botón de exportar.
 */
function manejarExportar(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('#exportar-container input[name="datos"]:checked');
    const tipoDatos = Array.from(checkboxes).map(cb => cb.value);
    const formato = document.querySelector('#exportar-container input[name="tipoExp"]:checked')?.value;
    const nombre = document.querySelector('#nombre').value.trim();
    const ubicacion = document.querySelector('#ubicacion').value.trim();

    try {
        exportador.exportarDatos(tipoDatos, formato, nombre, ubicacion , planificador);
        planificador.actualizarSessionVariables('exportador', 'exportador:config', exportador);
        setFeedback('Archivo exportado con éxito.', false);
    } catch (error) {
        setFeedback(error, true);
    }
}

/**
 * Maneja los cambios de filtros en el formulario de reportes.
 * 
 * @param {Event} event - Evento de cambio en el formulario.
 */
function manejarReportes(event) {
    const { id, value } = event.target;

    switch (id) {
        case 'fechaRyE': actualizarFechas(value, filtros); break;
        case 'categoriaRyE': filtros.categoria = value; break;
        case 'moneda': filtros.moneda = value; break;
        default: console.log(`Evento no manejado: ${id}`);
    }

    try {
        const datos = planificador.generarReporte(filtros, document.getElementById('fechaRyE').value);
        planificador.actualizarSessionVariables('planificador', 'planificador:filtros', null);
        generarGraficoReporte(datos.datosFiltrados);
        actualizarReporteGastos(datos);
        setFeedback('Reporte generado con éxito.', false);
    } catch (error) {
        setFeedback(error, true);
    }
}

/**
 * Maneja el guardado de una nueva meta de ahorro.
 * 
 * @param {SubmitEvent} event - Evento de envío del formulario de metas.
 */
function manejarGuardarMeta(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre-objetivo').value;
    const monto = document.getElementById('monto-objetivo').value;
    const fecha = document.getElementById('fecha-objetivo').value;

    try {
        const meta = planificador.agregarMetaAhorro({nombre: nombre, montoObjetivo: monto, fechaObjetivo: fecha});
        planificador.actualizarLocalVariables('planificador', 'planificador', null);
        crearFilaMeta(meta);
        actualizarRadiosConMetas();
        cerrarModal('MetasAhorroModal');
        setFeedback('Objetivo guardado con éxito', false);
        event.target.reset();
    } catch (error) {
        cerrarModal('MetasAhorroModal');
        setFeedback(error, true);
    }
}

/**
 * Maneja la selección y visualización de un objetivo guardado.
 * 
 * @param {SubmitEvent} event - Evento de envío del formulario de objetivos.
 */
function manejarMostrarObjetivo(event) {
    event.preventDefault();

    const form = event.target;
    const radioSeleccionado = form.querySelector('input[name="tipo"]:checked');
    if (!radioSeleccionado) return setFeedback('Selecciona un objetivo.', true);

    const datosMeta = planificador.obtenerMovimientosPorMeta(radioSeleccionado.value);
    const meta = planificador.getMetaById(radioSeleccionado.value);  
    if (!datosMeta || !meta) {
        console.log("No hay datos de Meta de Ahorro");
        cerrarModal('ObjetivosModal');
        return;
    }

    actualizarMetaCard(meta, datosMeta);
    generarGraficoMeta(datosMeta);
    mostrarMetaCard(true);
    cerrarModal('ObjetivosModal');
    form.reset();
}



// =============================================================
// Manipulacion del DOM
// =============================================================

/**
 * Muestra una sección específica de la interfaz y oculta las demás.
 * Además, inicializa los módulos correspondientes según el ID de la sección.
 *
 * @param {string} id - ID de la sección a mostrar (por ejemplo: "reportes", "metas", etc.)
 */
function mostrarSeccion(id) {
    const activa = document.getElementById(id);
    if (!activa || activa.classList.contains('visible')) return;

    // Cambiar visibilidad usando clases sin manipular el DOM repetidamente
    secciones.forEach(seccion => {
        seccion.classList.toggle('visible', seccion.id === id);
        seccion.classList.toggle('invisible', seccion.id !== id);
    });

    // Ocultar elementos globales si la vista actual es login
    const estaEnLogin = id === loginOption;
    if (sidebar) sidebar.classList.toggle('d-none', estaEnLogin);
    if (header) header.classList.toggle('d-none', estaEnLogin);
    if (principalContainer) principalContainer.classList.toggle('solo-contenido', estaEnLogin);
    if (id === reportesOption) {
        if(!planificador.sessionToJSON().filtros.fechaAscii && planificador.obtenerVariables('planificador:filtros', 'session'))
            recargarVariablesSession(reportesOption);
        else
            initReportes();
    }
    
    if (id === metasOption) {
        document.querySelector('.metas-table tbody').innerHTML = '';
        listarMetas(planificador.localToJSON().metasAhorro);
        mostrarMetaCard(false);
    }

    if (id === exportadorOption) {
        if(planificador.obtenerVariables('exportador:config', 'session'))
            recargarVariablesSession(exportadorOption);
    }

    if (id === loginOption) {
        if(planificador){
            planificador.eliminarVariables('planificador:filtros', 'session');
            filtros = {fechaDesde: "", fechaHasta: "", categoria: "", moneda: ""};

            document.getElementById('fechaRyE').value = "semana";
            document.getElementById('categoriaRyE').value = "Todas";
            document.getElementById('moneda').value = "ARS";

            
            planificador.eliminarVariables('exportador:config', 'session');
            if(document.querySelector('#exportar-container input[name="tipoExp"]:checked'))
                document.querySelector('#exportar-container input[name="tipoExp"]:checked').checked = false;
            document.querySelectorAll(`#exportar-container input[name="datos"]`).forEach(cb => {cb.checked = false;});  
            document.querySelector('#nombre').value ='';
            document.querySelector('#ubicacion').value = '';
        }
    }

}

/**
 * Muestra el combo de metas de ahorro y lo llena con las opciones actuales del planificador.
 * 
 * Busca todos los elementos `<select>` con el atributo `name="objetivos"` y les agrega
 * una opción por cada meta de ahorro registrada en `planificador.metasAhorro`.
 * 
 * Luego, hace visibles todos los elementos con clase `form-ahorro` y oculta la clase `invisible`.
 */
function abrirCombo() {
    const categoriaSelect = document.getElementsByName("objetivos");

    if( planificador.metasAhorro.length === 0)
        return false

    for (let i = 0; i < categoriaSelect.length; i++) {
        if (categoriaSelect[i] && categoriaSelect[i].innerHTML !== undefined) {
            categoriaSelect[i].innerHTML = '';
        }
    }
    
    categoriaSelect.forEach(cat => {
        planificador.metasAhorro.forEach(ma => {
        const opcion = document.createElement("option");
        opcion.value = ma.id;
        opcion.textContent = ma.nombre;
        cat.appendChild(opcion);
        });

    });
     
    Array.from(document.getElementsByClassName("form-ahorro")).forEach(el => {
    el.classList.add("visible");
    el.classList.remove("invisible");
    });
    return true;
}

/**
 * Crea y agrega una fila en la tabla de movimientos.
 * 
 * @param {Object} datos - Datos del movimiento.
 * @param {Object} movimiento - Objeto de movimiento generado por el planificador.
 */
function crearFilaMovimiento(datos, movimiento) {
    const tablaCuerpo = document.querySelector('.movimientos-table tbody');
    const fila = document.createElement('tr');
    // Guardamos el id del movimiento en el dataset de la fila
    if(movimiento)
        fila.dataset.movimientoId = movimiento.id;
    else    
        fila.dataset.movimientoId = datos.id;

    // Botón eliminar
    const tdBoton = document.createElement('td');
    tdBoton.classList.add('td-button');
    const boton = document.createElement('button');
    boton.classList.add('btn', 'small');
    const img = document.createElement('img');
    img.src = trashIcon;
    img.alt = trashIconAlt;
    boton.appendChild(img);
    tdBoton.appendChild(boton);
    boton.addEventListener('click', () => {
        planificador.eliminarMovimiento(fila.dataset.movimientoId);
        fila.remove();
        planificador.actualizarLocalVariables('planificador', 'planificador', null);
    });

    // Celdas
    const tdFecha = crearCelda(datos.fecha);
    const tdCategoria = crearCelda(capitalizar(datos.categoria));
    const tdMonto = crearCelda(`$${datos.monto.toLocaleString()}`);
    if (datos.tipo.toLowerCase() === 'gasto') tdMonto.classList.add('negative');
    if (datos.tipo.toLowerCase() === 'ahorro') tdMonto.classList.add('saving');
    const tdTipo = crearCelda(capitalizar(datos.tipo));

    fila.append(tdBoton, tdFecha, tdCategoria, tdMonto, tdTipo);
    tablaCuerpo.appendChild(fila);
}

/**
 * Genera un gráfico de barras apiladas usando Chart.js a partir de un conjunto de movimientos filtrados.
 * 
 * - Agrupa los movimientos por categoría y fecha.
 * - Diferencia ingresos y egresos usando los colores definidos en CSS.
 * - Destruye el gráfico anterior si existe y crea uno nuevo en el canvas con id "reportes-chart".
 * 
 * @param {Array<Object>} datosFiltrados - Lista de movimientos a graficar.
 *        {string|Date} datosFiltrados[].fecha - Fecha del movimiento.
 *        {string} datosFiltrados[].tipo - Tipo de movimiento: "ingreso", "gasto" o "ahorro".
 *        {string} datosFiltrados[].categoria - Categoría del movimiento.
 *        {number} datosFiltrados[].monto - Monto del movimiento.
 */      
function generarGraficoReporte(datosFiltrados) {
    // --- Extraemos los datos para el gráfico ---
    const styles = getComputedStyle(document.documentElement);
    const colorIngreso = styles.getPropertyValue("--success").trim();
    const colorEgreso = styles.getPropertyValue("--danger").trim();
    const etiquetas = [...new Set(datosFiltrados.map(mov => new Date(mov.fecha).toLocaleDateString()))].sort((a, b) => new Date(a) - new Date(b));
    
    //Agrupar montos por categoría
    const porCategoria = {};

    datosFiltrados.forEach(mov => {
        const categoria = mov.categoria;
        if (!porCategoria[categoria]) {
            porCategoria[categoria] = {
            tipo: mov.tipo,
            data: Array(etiquetas.length).fill(0) // inicializa con ceros
            };
        }

        // Suma el monto en la posición correcta según la fecha
        const idx = etiquetas.indexOf(mov.fecha.toLocaleDateString());
        porCategoria[categoria].data[idx] += mov.monto;
    });

    //Convertir a formato de dataset de Chart.js
    const datasets = Object.keys(porCategoria).map(cat => ({
    label: cat,
    data: porCategoria[cat].data,
    backgroundColor:
        porCategoria[cat].tipo === "ingreso" ? colorIngreso : colorEgreso
    }));

    if (grafico) {
        grafico.destroy();
    }

    const ctx = document.getElementById("reportes-chart").getContext("2d");

    // --- Creamos el gráfico ---
    grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: etiquetas,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Montos por Categoría y Fecha"
            },
            tooltip: {
                mode: "index",
                intersect: false
            }
            },
            scales: {
            x: { stacked: true, title: { display: true, text: "Fecha" } },
            y: { stacked: true, beginAtZero: true, title: { display: true, text: "Monto ($)" } }
            }
        }
    });
}

function generarGraficoMeta(movimientosMEta) {
  const ahorrosPorMes = {};
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // 1. Agrupar y sumar montos por Mes/Año
  movimientosMEta.forEach(m => {
    const date = m.fecha;
    // Clave: "Año-Mes" para ordenamiento (EJEMPLO "2025-10")
    const key = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`;
    
    if (!ahorrosPorMes[key]) {
    ahorrosPorMes[key] = {
        montoTotal: 0,
        label: `${meses[date.getMonth()]} ${date.getFullYear()}` // Etiqueta para el gráfico
    };
    }
    ahorrosPorMes[key].montoTotal += m.monto;
  });

  // 2. Preparar los datos y etiquetas para Chart.js
  const datosOrdenados = Object.keys(ahorrosPorMes)
    .sort() // Ordena cronológicamente (gracias al formato "YYYY-MM")
    .map(key => ahorrosPorMes[key]);

  const labels = datosOrdenados.map(d => d.label);
  const data = datosOrdenados.map(d => d.montoTotal);

  if (metaGrafico) {
        metaGrafico.destroy();
    }

  metaGrafico = new Chart(document.getElementById("meta-chart").getContext("2d"), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ahorro Total por Mes',
        data: data,
        backgroundColor: [
          getComputedStyle(document.documentElement).getPropertyValue("--success").trim(), 
        ],
        borderColor: [
          getComputedStyle(document.documentElement).getPropertyValue("--success").trim(),
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Monto Ahorrado ($)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Período'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Ahorro Acumulado por Mes'
        }
      }
    }
  });
}

/**
 * Actualiza la sección visual del reporte de gastos.
 * 
 * @param {{total: Object, categorias: Object}} resultados - Resultados del reporte.
 */
function actualizarReporteGastos(resultados) {
    const { total, categorias } = resultados;
    const listaContenedor = document.getElementById('gastos-lista');
    const saldoElem = document.querySelector('#reportes .saldo-promedio strong');
    const ahorroElem = document.querySelector('#reportes .porcentaje-ahorro strong');

    listaContenedor.innerHTML = '';

    Object.entries(categorias).forEach(([categoria, valores]) => {
        if (valores.gasto <= 0) return;

        const row = document.createElement('div');
        row.classList.add('row', 'justify-content-center', 'gasto-item');

        const colNombre = document.createElement('div');
        colNombre.classList.add('col', 'gastos-list');
        const h4 = document.createElement('h4');
        h4.textContent = capitalizar(categoria);
        colNombre.appendChild(h4);

        const colBar = document.createElement('div');
        colBar.classList.add('col', 'gastos-bars');
        const bar = document.createElement('div');
        const porcentaje = total.ingresos > 0 ? (valores.gasto / total.ingresos) * 100 : 0;
        bar.style.width = `${porcentaje}%`;
        bar.classList.add('bar');
        colBar.appendChild(bar);

        row.append(colNombre, colBar);
        listaContenedor.appendChild(row);
    });

    saldoElem.textContent = `$${total.saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    ahorroElem.textContent = `${total.porcentajeAhorro}%`;
}

/**
 * Actualiza la tarjeta (card) de la meta seleccionada.
 * 
 * @param {Object} datosMeta - Datos de la meta de ahorro.
 */
function actualizarMetaCard(datosMeta, movimientosMeta) {
    let ahorradoMes = 0;
    const porcentaje = planificador.getPorcentajeMeta(datosMeta);
    movimientosMeta.forEach(mov => {
        const fechaMovimiento = new Date(mov.fecha);
        const fechaActual = new Date();
        if (fechaMovimiento.getMonth() === fechaActual.getMonth() &&
            fechaMovimiento.getFullYear() === fechaActual.getFullYear()) {
            ahorradoMes += mov.monto;
        }
    });

    document.querySelector('#meta-nombre').textContent = datosMeta.nombre;
    document.querySelector('#meta-ahorrado').textContent = `$ ${datosMeta.montoActual}`;

    document.querySelector('#meta-mensaje').innerHTML = `
        Este mes ingresaste $ ${ahorradoMes}, alcanzaste un 
        ${porcentaje}% 
        de tu meta de ahorro.<br>
        <span class="highlight bold">
            Solo te faltan $${datosMeta.montoObjetivo - datosMeta.montoActual}. ¡Vas por muy buen camino!
        </span>
    `;

    const progress = document.querySelector('#meta-ahorro');
    const porcentajeElem = document.querySelector('#meta-porcentaje');
    progress.value = porcentaje;
    porcentajeElem.textContent = `${porcentaje} % completado`;
}

/**
 * Muestra u oculta la tarjeta de meta seleccionada.
 * 
 * @param {boolean} [mostrar=true] - Define si se muestra o se oculta la tarjeta.
 */
function mostrarMetaCard(mostrar = true) {
    const contenido = document.querySelector('.meta-card-content');
    if (!contenido) {
        return;
    }
    if (mostrar) {
        contenido.classList.add("visible");
        contenido.classList.remove("invisible");
    } else {
        contenido.classList.add("invisible");
        contenido.classList.remove("visible");
    }
}

/**
 * Crea una nueva fila en la tabla de metas de ahorro.
 * 
 * @param {Object} meta - Objeto con datos de la meta.
 */
function crearFilaMeta(meta) {
    const tablaCuerpo = document.querySelector('.metas-table tbody');
    const fila = document.createElement('tr');

    const tdNombre = document.createElement('td');
    tdNombre.textContent = meta.nombre;

    const tdAhorrado = document.createElement('td');
    tdAhorrado.textContent = `$${meta.montoActual.toLocaleString()}`;

    const tdRestante = document.createElement('td');
    const restante = meta.montoObjetivo - meta.montoActual;
    tdRestante.textContent = `$${restante.toLocaleString()}`;

    const tdNota = document.createElement('td');
    const span = document.createElement('span');
    span.classList.add('dot', 'blue');
    tdNota.appendChild(span);

    fila.append(tdNombre, tdAhorrado, tdRestante, tdNota);
    tablaCuerpo.appendChild(fila);
}

/**
 * Actualiza los radios en el formulario de objetivos según las metas disponibles.
 */
function actualizarRadiosConMetas() {
    const tbody = document.querySelector('.metas-table tbody');
    if (!tbody) {
        return;
    }

    const radioGroup1 = document.querySelector('#form-objetivo-modal .radio-group');

    if (!radioGroup1) {
        return;
    }

    radioGroup1.innerHTML = '';

    planificador.metasAhorro.forEach(meta => {
        const objetivo = meta.nombre;

        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'tipo';
        input.value = meta.id;

        const span = document.createElement('span');
        span.classList.add('radio-cuadrado', 'horizontal');

        label.append(input, span, document.createTextNode(' ' + objetivo));
        radioGroup1.appendChild(label);
    });
}



// =============================================================
// Funciones auxiliares comunes
// =============================================================

/**
 * Crea una celda <td> con texto.
 * 
 * @param {string} texto - Texto del contenido de la celda.
 * @returns {HTMLTableCellElement} Celda creada.
 */
function crearCelda(texto) {
    const td = document.createElement('td');
    td.textContent = texto;
    return td;
}

/**
 * Capitaliza un string (primera letra mayúscula, resto minúscula).
 * 
 * @param {string} str - Cadena de texto.
 * @returns {string} Texto capitalizado.
 */
function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Cierra un modal de Bootstrap por su ID.
 * 
 * @param {string} id - ID del modal a cerrar.
 */
function cerrarModal(id) {
    const modal = document.getElementById(id);
    const modalBootstrap = bootstrap.Modal.getInstance(modal);
    modalBootstrap?.hide();
}

/**
 * Muestra un mensaje de feedback (éxito o error) usando SweetAlert2.
 * 
 * @param {string|Error} message - Mensaje a mostrar.
 * @param {boolean} isError - Si es true, se trata de un mensaje de error.
 * @param {Function} [callback=null] - Función a ejecutar después de cerrar (opcional).
 */
function setFeedback(message, isError = false, callback = null) {
    const title = isError ? 'Error' : 'Éxito';
    const messageText = message instanceof Error ? message.message : String(message);

    if (isError) {
        AlertUtils.error(title, messageText, callback);
    } else {
        AlertUtils.success(title, messageText, callback);
    }
}

/**
 * Recarga las variables de sesión desde el almacenamiento para un módulo dado.
 *
 * @function recargarVariablesSession
 * @param {string} tipo - Identificador del módulo cuyas variables de sesión se deben recargar.
 *   Valores esperados:
 *   - `"Reportes"`: Recarga los filtros de reporte del planificador.
 *   - `"exportador"`: Recarga la configuración de exportación.
 */

function recargarVariablesSession(tipo) {
    switch (tipo){
        case reportesOption: {
            const datosGuardados = JSON.parse(planificador.obtenerVariables('planificador:filtros', 'session').filtros);
            Planificador.sessionRepFromJSON(datosGuardados);

            if (datosGuardados) {
                initReportes(datosGuardados);
            }
            break;
        }
        case exportadorOption: {
            const datosGuardados = JSON.parse(planificador.obtenerVariables('exportador:config', 'session').filtrosExportador);
            exportador.sessionExpFromJSON(datosGuardados);

            if (datosGuardados) {
                initExportador(datosGuardados);
            }
            break;
        }
    }
}

/**
 * Lista los movimientos existentes en la tabla al iniciar la sección.
 * 
 * @param {Array} movimientos - Array de movimientos a listar.
 */
function listarMovimientos(movimientos) {
    movimientos.forEach(movimiento => {
        crearFilaMovimiento(movimiento);
    });
}

/**
 * Actualiza los rangos de fechas según la opción seleccionada.
 * 
 * @param {string} valor - Valor seleccionado (por ejemplo, "Últimos 7 días").
 * @param {Object} filtros - Objeto de filtros que se actualizará.
 */
function actualizarFechas(valor, filtros) {
    const hoy = new Date();
    const desde = new Date(hoy);

    if (valor === 'semana') desde.setDate(hoy.getDate() - 7);
    else if (valor === 'mes') desde.setMonth(hoy.getMonth() - 1);
    else if (valor === 'año') desde.setFullYear(hoy.getFullYear() - 1);

    filtros.fechaDesde = desde.toISOString().split('T')[0];
    filtros.fechaHasta = hoy.toISOString().split('T')[0];
}

/**
 * Lista las metas de ahorro existentes en la tabla al iniciar la sección.
 * 
 * @param {Array} metasAhorro - Array de metas de ahorro a listar.
 */
function listarMetas(metasAhorro) {
    metasAhorro.forEach(metaAhorro => {
        crearFilaMeta(metaAhorro);
    });
}