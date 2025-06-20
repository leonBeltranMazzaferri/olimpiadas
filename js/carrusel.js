function scrollDestinos(direction) {
    const container = document.getElementById('carousel');
    const scrollAmount = 320;

    // Scroll the container
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });

    // Esperar a que termine el scroll (aprox)
    setTimeout(() => {
        const items = container.querySelectorAll('#destino-item');
        if (direction > 0) {
            // Mover el primero al final
            container.appendChild(items[0]);
            container.scrollLeft -= scrollAmount;
        } else {
            // Mover el último al principio
            container.prepend(items[items.length - 1]);
            container.scrollLeft += scrollAmount;
        }
    }, 350);
}
