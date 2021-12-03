const img = document.getElementById('logo-img');
img.addEventListener('mouseenter', e => {
    img.style.width = '8.5%';
});
img.addEventListener('mouseleave', e => {
    img.style.width = '8%';
});
