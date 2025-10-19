/* ===============================================
* Script: Control de Secciones Interactivas
* Optimizado para rendimiento y carga rápida.
* ================================================ */
// Cacheo selectores globales para evitar consultas repetidas al DOM
let secciones;
let sidebar;
let header;
let principalContainer ;
let offcanvasEl;

function mostrarSeccion(id) {
    const activa = document.getElementById(id);
    if (!activa || activa.classList.contains('visible')) return;

    // Cambiar visibilidad usando clases sin remover/agregar repetidamente
    secciones.forEach(seccion => {
        seccion.classList.toggle('visible', seccion.id === id);
        seccion.classList.toggle('invisible', seccion.id !== id);
    });

    const estaEnLogin = id === 'login';

    if (sidebar) sidebar.classList.toggle('d-none', estaEnLogin);
    if (header) header.classList.toggle('d-none', estaEnLogin);
    if (principalContainer) principalContainer.classList.toggle('solo-contenido', estaEnLogin);
}

// Ejecutar solo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    secciones = document.querySelectorAll('.principal-section');
    sidebar = document.querySelector('.sidebar');
    header = document.getElementById('main-header');
    principalContainer = document.querySelector('.principal-main');
    offcanvasEl = document.getElementById('sidebarOffcanvas');

    // Obtener hash o establecer login por defecto
    let hash = window.location.hash.replace('#', '') || 'login';
    if (!window.location.hash) {
        window.location.hash = hash;

        // Limpiar parámetros de URL sin recargar la página
        const url = new URL(window.location);
        url.searchParams.delete('usuario');
        url.searchParams.delete('password');
        window.history.replaceState({}, '', url);
    }

    mostrarSeccion(hash);
});