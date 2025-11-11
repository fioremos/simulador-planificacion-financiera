// =============================================================
// Variables globales de estado
// =============================================================
let feedback = null;
let filtros = null;

const planificador = new Planificador();

// =============================================================
// 1. Módulo de Movimientos (Ingresos / Gastos)
// =============================================================
function initMovimientoEvents() {
    const formMovimiento = document.querySelector('#form-ingresos-gastos');
    feedback = document.querySelector('#fb-ingresos');

    if (!formMovimiento) {
        console.warn('Formulario de movimientos no encontrado en el DOM.');
        return;
    }

    formMovimiento.addEventListener('submit', manejarMovimientoSubmit);
    console.log('Listeners de Movimiento inicializados.');
}

// ---------- Manejador de evento ----------
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
        crearFilaMovimiento(datos);
        form.reset();

    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

// ---------- Manipulación del DOM ----------
function crearFilaMovimiento(datos) {
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
    boton.addEventListener('click', () => fila.remove());

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
function initExportarDatos() {
    const botonExportar = document.querySelector('#exportar-container .btn');
    feedback = document.querySelector('#fb-exportar');

    if (!botonExportar) return;
    botonExportar.addEventListener('click', manejarExportar);
    console.log('Listeners de Exportar inicializados.');
}

// ---------- Manejador de evento ----------
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
function initReportes() {
    const form = document.getElementById('movimientos-form');
    feedback = document.querySelector('#fb-reportes');

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

// ---------- Manejador de evento ----------
function manejarReportes(event) {
    const { id, value } = event.target;

    switch (id) {
        case 'fechaRyE': actualizarFechas(value, filtros); break;
        case 'categoriaRyE': filtros.categoria = value; break;
        case 'moneda': filtros.moneda = value; break;
        default: console.warn(`Evento no manejado: ${id}`);
    }

    try {
        const datos = planificador.generarReporte(filtros);
        actualizarReporteGastos(datos);
        setFeedback(feedback, 'Reporte generado con éxito.', false);
    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

// ---------- Manipulación del DOM ----------
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

// ---------- Funciones auxiliares ----------
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
function initMetaAhorro() {
    const formMetas = document.querySelector('#form-metas-modal');
    const formObjetivo = document.querySelector('#form-objetivo-modal');
    feedback = document.querySelector('#fb-metaAhorro');

    if (!formMetas || !formObjetivo) return;

    formMetas.addEventListener('submit', manejarGuardarMeta);
    formObjetivo.addEventListener('submit', manejarGuardarObjetivo);
    console.log('Listeners de Metas y Objetivos inicializados.');
}

// ---------- Manejador de evento ----------
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
        setFeedback(feedback, error, true);
    }
}


function manejarGuardarObjetivo(event) {
    feedback = document.querySelector('#fb-objetivos');
    event.preventDefault();

    const form = event.target;
    const radioSeleccionado = form.querySelector('input[name="tipo"]:checked');
    if (!radioSeleccionado) return setFeedback(feedback, 'Selecciona un objetivo.', true);

    const datosMeta = getDatosMeta(radioSeleccionado.value);
    if (!datosMeta) return;

    actualizarMetaCard(datosMeta);
    mostrarMetaCard(true);
    cerrarModal('ObjetivosModal');
    form.reset();
}

// ---------- Funciones de manipulación del DOM ----------
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

function mostrarMetaCard(mostrar = true) {
    const contenido = document.querySelector('.meta-card-content');
    if (!contenido) return;
    contenido.style.display = mostrar ? 'block' : 'none';
}

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

function actualizarRadiosConMetas() {
    const tbody = document.querySelector('.metas-table tbody');
    if (!tbody) return;

    const radioGroup = document.querySelector('#form-objetivo-modal .radio-group');
    if (!radioGroup) return;

    radioGroup.innerHTML = '';

    tbody.querySelectorAll('tr').forEach((fila) => {
        const objetivo = fila.querySelector('td')?.textContent.trim();
        if (!objetivo) return;

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
function crearCelda(texto) {
    const td = document.createElement('td');
    td.textContent = texto;
    return td;
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    const modalBootstrap = bootstrap.Modal.getInstance(modal);
    modalBootstrap?.hide();
}

function setFeedback(feedback, message, error) {
    if (error) {
        console.error(message);
        feedback.textContent =
            `${message.message}`;
        feedback.classList.remove('success');
        feedback.classList.add('error');
        console.error(message);

        // Limpiar el mensaje de error también después de 3 segundos
        setTimeout(() => {
            feedback.textContent = '';
            feedback.classList.remove('error');
        }, 3000);
    } else {
        feedback.textContent = message;
        feedback.classList.remove('error');
        feedback.classList.add('success');

        setTimeout(() => {
            feedback.textContent = '';
            feedback.classList.remove('success', 'error');
        }, 3000);
    }
}