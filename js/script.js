let feedback;

function initMovimientoEvents() {
    const formMovimiento = document.querySelector('#form-ingresos-gastos');
    const tablaCuerpo = document.querySelector('.movimientos-table tbody');
    feedback = document.querySelector('#fb-ingresos');

    if (!formMovimiento) {
        console.warn('Formulario de movimientos no encontrado en el DOM.');
        return;
    }

    // Escuchar evento submit del formulario
    formMovimiento.addEventListener('submit', handleMovimientoSubmit);
    console.log('Listeners de Movimiento inicializados.');
}

function handleMovimientoSubmit(event) {
    event.preventDefault();

    const form = event.target;

    // Extraer datos del formulario
    const datos = {
        fecha: form.querySelector('#fecha-Ingresos-Gastos').value,
        tipo: form.querySelector('input[name="tipo"]:checked')?.value || '',
        categoria: form.querySelector('#categoria-Ingresos-Gastos').value,
        monto: parseFloat(form.querySelector('#monto-Ingresos-Gastos').value),
    };

    try {
        const nuevoMovimiento = new Movimiento(
            datos.fecha,
            datos.tipo,
            datos.categoria,
            datos.monto
        );

        setFeedback(feedback, 'Movimiento agregado con éxito.', false);

        crearFilaMovimiento(datos);

        form.reset();

    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

function crearFilaMovimiento(datos) {
    // Seleccionamos el tbody de la tabla
    const tablaCuerpo = document.querySelector('.movimientos-table tbody');

    // Crear fila
    const fila = document.createElement('tr');

    // Celda del botón de borrar
    const tdBoton = document.createElement('td');
    tdBoton.classList.add('td-button');
    const boton = document.createElement('button');
    boton.classList.add('btn', 'small');
    const img = document.createElement('img');
    img.src = 'assets/images/iconos/Trash_2.png';
    img.alt = 'logo_tacho_borrar';
    boton.appendChild(img);
    tdBoton.appendChild(boton);

    // Evento para eliminar fila
    boton.addEventListener('click', () => fila.remove());

    // Celdas de los datos
    const tdFecha = document.createElement('td');
    tdFecha.textContent = datos.fecha;

    const tdCategoria = document.createElement('td');
    tdCategoria.textContent = datos.categoria.charAt(0).toUpperCase() + datos.categoria.slice(1);

    const tdMonto = document.createElement('td');
    tdMonto.textContent = `$${datos.monto.toLocaleString()}`;

    if (datos.tipo.toLowerCase() === 'gasto') {
        tdMonto.classList.add('negative');
    }

    const tdTipo = document.createElement('td');
    tdTipo.textContent = datos.tipo.charAt(0).toUpperCase() + datos.tipo.slice(1);

    // Agregar celdas a la fila
    fila.appendChild(tdBoton);
    fila.appendChild(tdFecha);
    fila.appendChild(tdCategoria);
    fila.appendChild(tdMonto);
    fila.appendChild(tdTipo);

    // Agregar fila al tbody
    tablaCuerpo.appendChild(fila);
}

function initExportarDatos() {
    const botonExportar = document.querySelector('#exportar-container .btn');
    feedback = document.querySelector('#fb-exportar');

    botonExportar.addEventListener('click', handleExportar);
    console.log('Listeners de Exportar inicializados.');
}

function handleExportar(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('#exportar-container input[name="datos"]:checked');
    const datosSeleccionados = Array.from(checkboxes).map(cb => cb.value);

    const tipoArchivo = document.querySelector('#exportar-container input[name="tipo"]:checked')?.value;

    const nombre = document.querySelector('#nombre').value.trim();
    const ubicacion = document.querySelector('#ubicacion').value.trim();

    try {
        const exportador = new Exportador();
        exportador.exportar({ tipo: datosSeleccionados, formato: tipoArchivo, nombreArchivo: nombre, rutaDestino: ubicacion });

        setFeedback(feedback, 'Archivo exportado con éxito.', false);
    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

let filtros;

function initReportes() {
    const form = document.getElementById('movimientos-form');
    feedback = document.querySelector('#fb-reportes');

    filtros = { fechaDesde: "", fechaHasta: "", categoria: document.getElementById('categoriaRyE').value, moneda: document.getElementById('moneda').value };
    actualizarFechas(document.getElementById('fechaRyE').value, filtros);

    const planificador = new Planificador();
    var datos = planificador.generarReporte(filtros);

    actualizarReporteGastos(datos);

    form.addEventListener('change', handleReportes);

    console.log('Listeners de Reportes inicializados.');
}

function handleReportes(event) {
    const { id, value } = event.target;

    switch (id) {
        case 'fechaRyE':
            actualizarFechas(value, filtros);
            break;

        case 'categoriaRyE':
            filtros.categoria = value;
            break;

        case 'moneda':
            filtros.moneda = value;
            break;

        default:
            console.warn(`Evento no manejado para elemento: ${id}`);
    }

    try {
        const planificador = new Planificador();
        var datos = planificador.generarReporte(filtros);

        actualizarReporteGastos(datos);

        setFeedback(feedback, 'Reporte generado con éxito.', false);

    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

function actualizarFechas(valor, filtros) {
    const hoy = new Date();
    if (valor === 'Últimos 7 días') {
        const desde = new Date(hoy);
        desde.setDate(hoy.getDate() - 7);
        filtros.fechaDesde = desde.toISOString().split('T')[0];
        filtros.fechaHasta = hoy.toISOString().split('T')[0];
    } else if (valor === 'Último mes') {
        const desde = new Date(hoy);
        desde.setMonth(hoy.getMonth() - 1);
        filtros.fechaDesde = desde.toISOString().split('T')[0];
        filtros.fechaHasta = hoy.toISOString().split('T')[0];
    } else if (valor === 'Último año') {
        const desde = new Date(hoy);
        desde.setFullYear(hoy.getFullYear() - 1);
        filtros.fechaDesde = desde.toISOString().split('T')[0];
        filtros.fechaHasta = hoy.toISOString().split('T')[0];
    }
}

function actualizarReporteGastos(resultados) {
    const { filtros, total, categorias } = resultados;

    const listaContenedor = document.getElementById('gastos-lista');
    const saldoElem = document.querySelector('#reportes .saldo-promedio strong');
    const ahorroElem = document.querySelector('#reportes .porcentaje-ahorro strong');

    // Limpiar la lista antes de renderizar
    listaContenedor.innerHTML = '';

    // Agrupar los movimientos por categoría y sumar los gastos
    const categoriasMap = {};

    for (const [cat, valores] of Object.entries(categorias)) {
        if (valores.gasto > 0) {
            categoriasMap[cat] = valores.gasto;
        }
    }

    Object.entries(categorias).forEach(([categoria, valores]) => {
        const montoGasto = valores.gasto;
        if (montoGasto <= 0) return; // Solo mostrar categorías con gasto

        const row = document.createElement('div');
        row.classList.add('row', 'justify-content-center', 'gasto-item');
        row.dataset.categoria = categoria;

        // Columna con el nombre de la categoría
        const colNombre = document.createElement('div');
        colNombre.classList.add('col', 'gastos-list');
        const h4 = document.createElement('h4');
        h4.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();;
        colNombre.appendChild(h4);

        // Columna con la barra
        const colBar = document.createElement('div');
        colBar.classList.add('col', 'gastos-bars');
        const bar = document.createElement('div');
        const porcentaje = total.ingresos > 0 ? (montoGasto / total.ingresos) * 100 : 0;
        bar.style.width = `${porcentaje}%`;
        bar.classList.add('bar');
        colBar.appendChild(bar);

        row.appendChild(colNombre);
        row.appendChild(colBar);
        listaContenedor.appendChild(row);
    });

    // Actualizamos indicadores de la derecha
    saldoElem.textContent = `$${total.saldo.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    ahorroElem.textContent = `${total.porcentajeAhorro}%`;
}

function initMetaAhorro() {
    const formMetas = document.querySelector('#form-metas-modal');
    const formObjetivo = document.querySelector('#form-objetivo-modal');
    feedback = document.querySelector('#fb-metaAhorro');

    if (!formMetas) {
        console.warn('Formulario de metas no encontrado en el DOM.');
        return;
    }    
    if (!formObjetivo) {
        console.warn('Formulario de objetivo no encontrado en el DOM.');
        return;
    }

    // Escuchar evento submit del formulario
    formMetas.addEventListener('submit', handleGuardarMeta);
    formObjetivo.addEventListener('submit', handleGuardarObjetivo);
    console.log('Listeners de Metas y Objetivos inicializados.');

}

function handleGuardarMeta(event) {
    event.preventDefault();

    const form = event.target;

    const nombre = document.getElementById('nombre-objetivo').value;
    const monto = document.getElementById('monto-objetivo').value;
    const fecha = document.getElementById('fecha-objetivo').value;

    try {
        const meta = new MetaAhorro(nombre, monto, fecha);

        form.reset();

        const modal = document.getElementById('MetasAhorroModal')
        const modalBootstrap = bootstrap.Modal.getInstance(modal);
        modalBootstrap?.hide();

        crearFilaMeta(meta);
        actualizarRadiosConMetas();

        setFeedback(feedback, 'Objetivo guardado con exito', false);

    } catch (error) {
        setFeedback(feedback, error, true);
    }
}

function handleGuardarObjetivo(event) {
    feedback = document.querySelector('#fb-objetivos');
    event.preventDefault();

    const form = event.target;

    const radioSeleccionado = form.querySelector('input[name="tipo"]:checked');

    if (!radioSeleccionado) {
        setFeedback(feedback, 'Por favor selecciona un objetivo.', true);
        return;
    }

    const objetivo = radioSeleccionado.value;
    
    var datosMeta = getDatosMeta(objetivo);

    if (!datosMeta) return;

    actualizarMetaCard(datosMeta)
    mostrarMetaCard(true);

    form.reset();

    const modal = document.getElementById('ObjetivosModal')
    const modalBootstrap = bootstrap.Modal.getInstance(modal);
    modalBootstrap?.hide();
}

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
    // Actualizar contenido
    document.querySelector('#meta-nombre').textContent = datosMeta.nombre;
    document.querySelector('#meta-ahorrado').textContent = `$${datosMeta.ahorrado.toLocaleString()}`;
    document.querySelector('#meta-mensaje').innerHTML = `
        Este mes ingresaste $${datosMeta.ahorrado.toLocaleString()}, alcanzaste un ${Math.round((datosMeta.ahorrado / (datosMeta.ahorrado + datosMeta.restante)) * 100)}% de tu meta de ahorro.<br>
        <span class="highlight bold">Solo te faltan $${datosMeta.restante.toLocaleString()}. ¡Vas por muy buen camino!</span>
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
    // Seleccionamos el tbody de la tabla
    const tablaCuerpo = document.querySelector('.metas-table tbody');

    // Crear fila
    const fila = document.createElement('tr');

    // Celda del nombre del objetivo
    const tdNombre = document.createElement('td');
    tdNombre.textContent = meta.nombre;

    // Celda del monto ahorrado
    const tdAhorrado = document.createElement('td');
    tdAhorrado.textContent = `$${meta.montoActual.toLocaleString()}`;

    // Celda del restante
    const tdRestante = document.createElement('td');
    const restante = meta.montoObjetivo - meta.montoActual;
    tdRestante.textContent = `$${restante.toLocaleString()}`;

    // Celda de nota (puedes agregar lógica de colores si quieres)
    const tdNota = document.createElement('td');
    const span = document.createElement('span');
    span.classList.add('dot', 'blue'); // o lógica para cambiar color según progreso
    tdNota.appendChild(span);

    // Agregar celdas a la fila
    fila.appendChild(tdNombre);
    fila.appendChild(tdAhorrado);
    fila.appendChild(tdRestante);
    fila.appendChild(tdNota);

    // Agregar fila al tbody
    tablaCuerpo.appendChild(fila);
}

function actualizarRadiosConMetas() {
    // Seleccionamos el tbody de la tabla de metas
    const tbody = document.querySelector('.metas-table tbody');
    if (!tbody) return;

    // Seleccionamos el contenedor de los radio buttons
    const radioGroup = document.querySelector('#form-objetivo-modal .radio-group');
    if (!radioGroup) return;

    // Limpiamos radios anteriores
    radioGroup.innerHTML = '';

    // Iteramos por cada fila de la tabla
    tbody.querySelectorAll('tr').forEach((fila, index) => {
        const objetivo = fila.querySelector('td')?.textContent.trim();
        if (!objetivo) return;

        // Creamos el label
        const label = document.createElement('label');

        // Creamos el input radio
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'tipo';
        input.value = objetivo;

        // Span para estilo
        const span = document.createElement('span');
        span.classList.add('radio-cuadrado', 'horizontal');

        // Armamos el label
        label.appendChild(input);
        label.appendChild(span);
        label.appendChild(document.createTextNode(' ' + objetivo));

        // Lo agregamos al contenedor
        radioGroup.appendChild(label);
    });
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