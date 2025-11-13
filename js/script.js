// =============================================================
// Variables globales de estado
// =============================================================

/** @type {HTMLElement} Elemento para mostrar mensajes de feedback */
let feedback = document.querySelector('#feedback');

/** @type {Object|null} Filtros actuales para reportes */
let filtros = {fechaDesde: "", fechaHasta: "", categoria: "", moneda: ""};

/** @type {Planificador} Instancia principal del planificador */
let planificador;

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

let grafico;
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
    let hash = window.location.hash.replace('#', '') || 'login';

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
    const planificadorGuardado = StorageUtil.obtener('app:planificador', 'local');
    if (planificadorGuardado){
        planificador = Planificador.localFromJSON(planificadorGuardado);

        // Listar movimientos y metas en la interfaz
        ListarMoviminetos(planificador.localToJSON().movimientos);
        ListarMetas(planificador.localToJSON().metasAhorro);
        actualizarRadiosConMetas();
    }else
        planificador = new Planificador();
    
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
    const estaEnLogin = id === 'login';
    if (sidebar) sidebar.classList.toggle('d-none', estaEnLogin);
    if (header) header.classList.toggle('d-none', estaEnLogin);
    if (principalContainer) principalContainer.classList.toggle('solo-contenido', estaEnLogin);
    if (id === 'reportes') {
        if(!planificador.sessionToJSON().filtros.fechaAscii && StorageUtil.obtener('app:planificador:filtros', 'session'))
            recargarVariablesSession('reportes');
        else
            initReportes();
    }

    if (id === 'exportar') {
        if(StorageUtil.obtener('app:exportador:config', 'session'))
            recargarVariablesSession('exportador');
    }

    if (id === 'login') {
        if(planificador){
            StorageUtil.eliminar('app:planificador:filtros', 'session');
            filtros = {fechaDesde: "", fechaHasta: "", categoria: "", moneda: ""};

            document.getElementById('fechaRyE').value = "Últimos 7 días";
            document.getElementById('categoriaRyE').value = "Todas";
            document.getElementById('moneda').value = "ARS";

            
            StorageUtil.eliminar('app:exportador:config', 'session');
            if(document.querySelector('#exportar-container input[name="tipo"]:checked'))
                document.querySelector('#exportar-container input[name="tipo"]:checked').checked = false;
            document.querySelectorAll(`#exportar-container input[name="datos"]`).forEach(cb => {cb.checked = false;});  
            document.querySelector('#nombre').value ='';
            document.querySelector('#ubicacion').value = '';
        }
    }

}

// =============================================================
// 1. Módulo de Movimientos (Ingresos / Gastos)
// =============================================================

/**
 * Inicializa los listeners del formulario de ingresos y gastos.
 * Busca el formulario en el DOM y agrega el manejador de envío.
 */
if(document.querySelector('#form-ingresos-gastos'))
    document.querySelector('#form-ingresos-gastos').addEventListener('submit', manejarMovimientoSubmit);


/**
 * Lista los movimientos existentes en la tabla al iniciar la sección.
 * 
 * @param {Array} movimientos - Array de movimientos a listar.
 */
function ListarMoviminetos(movimientos) {
    movimientos.forEach(movimiento => {
        crearFilaMovimiento(movimiento);
    });
}

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
        fecha: form.querySelector('#fecha-Ingresos-Gastos').value,
        tipo: form.querySelector('input[name="tipo"]:checked')?.value || '',
        categoria: form.querySelector('#categoria-Ingresos-Gastos').value,
        monto: parseFloat(form.querySelector('#monto-Ingresos-Gastos').value),
    };

    try {
        const movimiento = planificador.agregarMovimiento(datos);
        StorageUtil.actualizar('app:planificador', planificador.localToJSON(), 'local');
        setFeedback(feedback, 'Movimiento agregado con éxito.', false);
        crearFilaMovimiento(datos, movimiento);
        form.reset();
    } catch (error) {
        setFeedback(feedback, error, true);
    }
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
    fila.dataset.movimientoId = datos.id;
    

    // Botón eliminar
    const tdBoton = document.createElement('td');
    tdBoton.classList.add('td-button');
    const boton = document.createElement('button');
    boton.classList.add('btn', 'small');
    const img = document.createElement('img');
    img.src = 'assets/images/iconos/Trash_2.png';
    img.alt = 'logo_tacho_borrar';
    boton.appendChild(img);
    tdBoton.appendChild(boton);
    boton.addEventListener('click', () => {
        fila.remove();
        planificador.eliminarMovimiento(fila.dataset.movimientoId);
        StorageUtil.actualizar('app:planificador', planificador.localToJSON(), 'local');
    });

    // Celdas
    const tdFecha = crearCelda(datos.fecha);
    const tdCategoria = crearCelda(capitalizar(datos.categoria));
    const tdMonto = crearCelda(`$${datos.monto.toLocaleString()}`);
    if (datos.tipo.toLowerCase() === 'gasto') tdMonto.classList.add('negative');
    const tdTipo = crearCelda(capitalizar(datos.tipo));

    fila.append(tdBoton, tdFecha, tdCategoria, tdMonto, tdTipo);
    tablaCuerpo.appendChild(fila);
}

// =============================================================
// 2. Módulo de Exportar Datos
// =============================================================

/**
 * Inicializa el botón de exportación de datos.
 */
if(document.querySelector('#exportar-container .btn'))
    document.querySelector('#exportar-container .btn').addEventListener('click', manejarExportar);


function initExportador(filtrosExportacion) {
    if (filtrosExportacion){

        document.querySelector(`#exportar-container input[name="tipo"][value="${filtrosExportacion.formato}"]`).checked = true;
        const checkboxes = document.querySelectorAll('#exportar-container input[name="datos"]');

        checkboxes.forEach(cb => {
            cb.checked = filtrosExportacion.tipo.includes(cb.value);
        });
        /*checkboxes.forEach(cb => {
            cb.checked = tipoDatos.includes(cb.value);
        });*/

        document.querySelector('#nombre').value = filtrosExportacion.nombreArchivo;
        document.querySelector('#ubicacion').value = filtrosExportacion.rutaDestino;
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
    const formato = document.querySelector('#exportar-container input[name="tipo"]:checked')?.value;
    const nombre = document.querySelector('#nombre').value.trim();
    const ubicacion = document.querySelector('#ubicacion').value.trim();

    try {
        exportador.exportarDatos(tipoDatos, formato, nombre, ubicacion , planificador);
        StorageUtil.actualizar('app:exportador:config', exportador.sessionToJSON(), 'session');
        setFeedback(feedback, 'Archivo exportado con éxito.', false);
    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

// =============================================================
// 3. Módulo de Reportes
// =============================================================

/**
 * Inicializa los reportes y configura los filtros por defecto.
 */
if(document.getElementById('movimientos-form'))
    document.getElementById('movimientos-form').addEventListener('change', manejarReportes);

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
    generarGrafico(datos.datosFiltrados);
    actualizarReporteGastos(datos);
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
        const datos = planificador.generarReporte(filtros);
        actualizarReporteGastos(datos);
        setFeedback(feedback, 'Reporte generado con éxito.', false);
    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

function generarGrafico(datosFiltrados) {
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

    console.log(datasets)

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
 * Actualiza los rangos de fechas según la opción seleccionada.
 * 
 * @param {string} valor - Valor seleccionado (por ejemplo, "Últimos 7 días").
 * @param {Object} filtros - Objeto de filtros que se actualizará.
 */
function actualizarFechas(valor, filtros) {
    const hoy = new Date();
    const desde = new Date(hoy);

    if (valor === 'Últimos 7 días') desde.setDate(hoy.getDate() - 7);
    else if (valor === 'Último mes') desde.setMonth(hoy.getMonth() - 1);
    else if (valor === 'Último año') desde.setFullYear(hoy.getFullYear() - 1);

    filtros.fechaDesde = desde.toISOString().split('T')[0];
    filtros.fechaHasta = hoy.toISOString().split('T')[0];
}

// =============================================================
// 4. Módulo de Metas y Objetivos de Ahorro
// =============================================================

/**
 * Inicializa los formularios de metas y objetivos de ahorro.
 */
if(document.querySelector('#form-metas-modal'))
    document.querySelector('#form-metas-modal').addEventListener('submit', manejarGuardarMeta);

if(document.querySelector('#form-objetivo-modal'))
    document.querySelector('#form-objetivo-modal').addEventListener('submit', manejarGuardarObjetivo);
  
/**
 * Lista las metas de ahorro existentes en la tabla al iniciar la sección.
 * 
 * @param {Array} metasAhorro - Array de metas de ahorro a listar.
 */
function ListarMetas(metasAhorro) {
    metasAhorro.forEach(metaAhorro => {
        crearFilaMeta(metaAhorro);
    });
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
        StorageUtil.actualizar('app:planificador', planificador.localToJSON(), 'local');
        crearFilaMeta(meta);
        actualizarRadiosConMetas();
        cerrarModal('MetasAhorroModal');
        setFeedback(feedback, 'Objetivo guardado con éxito', false);
        event.target.reset();
    } catch (error) {
        cerrarModal('MetasAhorroModal');
        setFeedback(feedback, error, true);
    }
}

/**
 * Maneja la selección y visualización de un objetivo guardado.
 * 
 * @param {SubmitEvent} event - Evento de envío del formulario de objetivos.
 */
function manejarGuardarObjetivo(event) {
    event.preventDefault();

    const form = event.target;
    const radioSeleccionado = form.querySelector('input[name="tipo"]:checked');
    if (!radioSeleccionado) return setFeedback(feedback, 'Selecciona un objetivo.', true);

    const datosMeta = getDatosMeta(radioSeleccionado.value);
    if (!datosMeta) {
        console.log("No hay datos de Meta de Ahorro");
        cerrarModal('ObjetivosModal');
        return;
    }

    actualizarMetaCard(datosMeta);
    mostrarMetaCard(true);
    cerrarModal('ObjetivosModal');
    form.reset();
}

/**
 * Obtiene los datos de una meta específica desde la tabla.
 * 
 * @param {string} objetivo - Nombre de la meta a buscar.
 * @returns {Object|null} Datos de la meta o null si no se encuentra.
 */
function getDatosMeta(objetivo) {
    const filas = document.querySelectorAll('.metas-table tbody tr');

    for (const fila of filas) {
        const celdas = fila.querySelectorAll('td');
        const nombreMeta = celdas[0]?.textContent.trim();
        if (nombreMeta === objetivo) {
            return {
                nombre: nombreMeta,
                ahorrado: parseInt(celdas[1].textContent.replace(/\D/g, '')),
                restante: parseInt(celdas[2].textContent.replace(/\D/g, ''))
            };
        }
    }
    return null;
}

/**
 * Actualiza la tarjeta (card) de la meta seleccionada.
 * 
 * @param {Object} datosMeta - Datos de la meta de ahorro.
 */
function actualizarMetaCard(datosMeta) {
    document.querySelector('#meta-nombre').textContent = datosMeta.nombre;
    document.querySelector('#meta-ahorrado').textContent = `$${datosMeta.ahorrado.toLocaleString()}`;
    document.querySelector('#meta-mensaje').innerHTML = `
        Este mes ingresaste $${datosMeta.ahorrado.toLocaleString()}, alcanzaste un 
        ${Math.round((datosMeta.ahorrado / (datosMeta.ahorrado + datosMeta.restante)) * 100)}% 
        de tu meta de ahorro.<br>
        <span class="highlight bold">
            Solo te faltan $${datosMeta.restante.toLocaleString()}. ¡Vas por muy buen camino!
        </span>
    `;

    const porcentaje = Math.round((datosMeta.ahorrado / (datosMeta.ahorrado + datosMeta.restante)) * 100);
    const progress = document.querySelector('#meta-ahorro');
    const porcentajeElem = document.querySelector('#meta-porcentaje');
    progress.value = porcentaje;
    porcentajeElem.textContent = `${porcentaje}% completado`;
}

/**
 * Muestra u oculta la tarjeta de meta seleccionada.
 * 
 * @param {boolean} [mostrar=true] - Define si se muestra o se oculta la tarjeta.
 */
function mostrarMetaCard(mostrar = true) {
    const contenido = document.querySelector('.meta-card-content');
    if (!contenido) {
        console.log("'.meta-card-content' no encontrado");
        return;
    }
    contenido.style.display = mostrar ? 'block' : 'none';
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
        console.log(".metas-table tbody no encontrado");
        return;
    }

    const radioGroup = document.querySelector('#form-objetivo-modal .radio-group');
    if (!radioGroup) {
        console.log("'#form-objetivo-modal .radio-group' no encontrado");
        return;
    }

    radioGroup.innerHTML = '';

    tbody.querySelectorAll('tr').forEach((fila) => {
        const objetivo = fila.querySelector('td')?.textContent.trim();
        if (!objetivo) {
            console.log("No se encontró ningún objetivo");
            return;
        }

        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'tipo';
        input.value = objetivo;

        const span = document.createElement('span');
        span.classList.add('radio-cuadrado', 'horizontal');

        label.append(input, span, document.createTextNode(' ' + objetivo));
        radioGroup.appendChild(label);
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
 * Muestra un mensaje de feedback (éxito o error) en pantalla.
 * 
 * @param {HTMLElement} feedback - Elemento del DOM para el mensaje.
 * @param {string|Error} message - Mensaje a mostrar.
 * @param {boolean} error - Si es true, se trata de un mensaje de error.
 */
function setFeedback(feedback, message, error) {
    const overlay = document.getElementById('overlay');
    if (error) {
        console.log(message);
        feedback.textContent = `${message.message}`;
        feedback.classList.remove('success');
        feedback.classList.add('error');
        overlay.style.display = "flex";

        setTimeout(() => {
            feedback.textContent = '';
            feedback.classList.remove('error');
            overlay.style.display = "none";
        }, 1000);
    } else {
        feedback.textContent = message;
        feedback.classList.remove('error');
        feedback.classList.add('success');
        overlay.style.display = "flex";

        setTimeout(() => {
            feedback.textContent = '';
            feedback.classList.remove('success', 'error');
            overlay.style.display = "none";
        }, 1000);
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
        case 'reportes': {
            const datosGuardados = StorageUtil.obtener('app:planificador:filtros', 'session');
            Planificador.sessionRepFromJSON(datosGuardados);

            if (datosGuardados) {
                initReportes(datosGuardados);
            }
            break;
        }
        case 'exportador': {
            const datosGuardados = JSON.parse(StorageUtil.obtener('app:exportador:config', 'session').filtrosExportador);
            exportador.sessionExpFromJSON(datosGuardados);

            if (datosGuardados) {
                initExportador(datosGuardados);
            }
            break;
        }
    }
}
