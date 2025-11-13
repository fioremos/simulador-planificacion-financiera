// =============================================================
// Variables globales de estado
// =============================================================

/** @type {HTMLElement} Elemento para mostrar mensajes de feedback */
let feedback = document.querySelector('#feedback');

/** @type {Object|null} Filtros actuales para reportes */
let filtros = null;

/** @type {Planificador} Instancia principal del planificador */
const planificador = new Planificador();

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

    // Control para evitar inicializaciones múltiples
    let movimientosIniciado = false;

    // Inicializar el módulo correspondiente según la sección activa
    if (id === 'ingresos-gastos' && !movimientosIniciado) {
        initMovimientoEvents();
        movimientosIniciado = true;
    }

    if (id === 'exportar' && !movimientosIniciado) {
        initExportarDatos();
        movimientosIniciado = true;
    }

    if (id === 'reportes' && !movimientosIniciado) {
        initReportes();
        movimientosIniciado = true;
    }

    if (id === 'metas' && !movimientosIniciado) {
        initMetaAhorro();
        movimientosIniciado = true;
    }
}

// =============================================================
// 1. Módulo de Movimientos (Ingresos / Gastos)
// =============================================================

/**
 * Inicializa los listeners del formulario de ingresos y gastos.
 * Busca el formulario en el DOM y agrega el manejador de envío.
 */
function initMovimientoEvents() {
    const formMovimiento = document.querySelector('#form-ingresos-gastos');
    if (!formMovimiento) {
        console.log('Formulario de movimientos no encontrado en el DOM.');
        return;
    }

    formMovimiento.addEventListener('submit', manejarMovimientoSubmit);
    console.log('Listeners de Movimiento inicializados.');
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
        planificador.eliminarMovimiento(movimiento);
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
function initExportarDatos() {
    const botonExportar = document.querySelector('#exportar-container .btn');
    if (!botonExportar) {
        console.log("'#exportar-container .btn' no encontrado");
        return;
    }
    botonExportar.addEventListener('click', manejarExportar);
    console.log('Listeners de Exportar inicializados.');
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
        planificador.exportarDatos(tipoDatos, formato, nombre, ubicacion);
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
function initReportes() {
    const form = document.getElementById('movimientos-form');

    filtros = {
        fechaDesde: "",
        fechaHasta: "",
        categoria: document.getElementById('categoriaRyE').value,
        moneda: document.getElementById('moneda').value
    };

    actualizarFechas(document.getElementById('fechaRyE').value, filtros);

    const datos = planificador.generarReporte(filtros);
    actualizarReporteGastos(datos);

    form.addEventListener('change', manejarReportes);
    console.log('Listeners de Reportes inicializados.');
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
function initMetaAhorro() {
    const formMetas = document.querySelector('#form-metas-modal');
    const formObjetivo = document.querySelector('#form-objetivo-modal');

    if (!formMetas || !formObjetivo) return;

    formMetas.addEventListener('submit', manejarGuardarMeta);
    formObjetivo.addEventListener('submit', manejarGuardarObjetivo);
    console.log('Listeners de Metas y Objetivos inicializados.');
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
