// Delegación de eventos para navegación interna rápida
document.body.addEventListener('click', e => {
    const enlace = e.target.closest('a[href^="#"]');
    if (!enlace) return;

    const id = enlace.getAttribute('href').substring(1);
    if (!id) return;

    const destino = document.getElementById(id);
    if (destino && destino.classList.contains('principal-section')) {
        e.preventDefault();
        if (window.location.hash !== `#${id}`) {
        window.location.hash = id;
        }
        mostrarSeccion(id);

        if (offcanvasEl) {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
        }
    }
});

// Listener para ocultar sidebar si está visible al redimensionar ventana
window.addEventListener('resize', () => {
    if (offcanvasEl && offcanvasEl.classList.contains('show')) {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
    }
});