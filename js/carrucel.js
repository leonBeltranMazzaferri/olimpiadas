function scrollDestinos(direction) {
    const container = document.getElementById("carousel");
    const scrollAmount = 320; // ajustá al ancho de tu tarjeta + margen

    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

