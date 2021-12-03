const img = document.getElementById('logo-img');
img.addEventListener('mouseenter', e => {
    img.style.width = '8.5%';
});
img.addEventListener('mouseleave', e => {
    img.style.width = '8%';
});

let rows = document.getElementsByClassName("album-row");
for (var i = 0; i < rows.length; i++) {
    console.log(rows[i].year);
}