 /* ===============================================
        * Script: Control de Secciones Interactivas
        * Descripción: Este script permite mostrar u ocultar
        * secciones específicas según el botón presionado y
        * garantiza que la pagina cargue en la sección de login.
        *
        * NOTA IMPORTANTE:
        * Este script incluye lógica y estructura pensadas
        * para facilitar la corrección docente.
        * Debe ser removido una vez sea funcional la página.
        * ================================================ */
function mostrarSeccion(id) {
    const secciones = document.querySelectorAll('.principal-section');
    secciones.forEach(seccion => {
        seccion.classList.remove('visible');
        seccion.classList.add('invisible');
    });

    const activa = document.getElementById(id);
    if (activa) {
        activa.classList.remove('invisible');
        activa.classList.add('visible');
    }

    // Mostrar u ocultar sidebar y header según la sección
    const sidebar = document.querySelector('.sidebar');
    const header = document.getElementById('main-header'); 
    const principalContainer = document.querySelector('.principal-main');

    const estaEnLogin = id === 'login';


    if (sidebar) {
        sidebar.classList.toggle('d-none', estaEnLogin);
    }

    if (header) { 
        header.classList.toggle('d-none', estaEnLogin);
    }

    if (principalContainer) {
        principalContainer.classList.toggle('solo-contenido', estaEnLogin);
    }
}

// A modo de evitar errores reviso la URL 
// Cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Revisa la URL al cargar
    let hash = window.location.hash.replace('#', '');

    if (!hash) {
        hash = 'login';  
        window.location.hash = hash;

        const url = new URL(window.location);
        url.searchParams.set('usuario', '');  
        url.searchParams.set('password', '');  
        window.history.replaceState({}, '', url);  
    }

    mostrarSeccion(hash);

    // Delegación de eventos para enlaces de la sidebar
    document.body.addEventListener('click', function (e) {
        const enlace = e.target.closest('a[href^="#"]');
        if (!enlace) return;

        const id = enlace.getAttribute('href').substring(1); // elimina el #
        const destino = document.getElementById(id);

        if (destino && destino.classList.contains('principal-section')) {
            e.preventDefault();
            window.location.hash = id;
            mostrarSeccion(id);
        }
        
        const offcanvasEl = document.getElementById('sidebarOffcanvas');
        if (offcanvasEl) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (offcanvas) {
                offcanvas.hide();
            }
        }

    });

        // 🔄 Cerrar offcanvas si la ventana cambia de tamaño (ej. rotación)
    window.addEventListener('resize', () => {
        const offcanvasEl = document.getElementById('sidebarOffcanvas');
        if (offcanvasEl && offcanvasEl.classList.contains('show')) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (offcanvas) {
                offcanvas.hide();
            }
        }
    });
});