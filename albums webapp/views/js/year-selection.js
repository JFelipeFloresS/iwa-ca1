years = [];
allAlbums.forEach((album) => {
    addYearToSelectOptions(album);
});
years.unshift(-1);

function displaySelectYearOptions() {
    let selectYear = document.querySelector('.select-year');
    selectYear.innerHTML = '';
    years.forEach((year) => {
        let newElement = document.createElement('option');
        newElement.value = year;
        newElement.innerHTML = year;
        if (year == -1) {
            newElement.innerHTML = 'All time';
        }
        selectYear.appendChild(newElement);
    });
}

displaySelectYearOptions();

function addYearToSelectOptions(album) {
    let y = String(album.querySelector('.year').innerHTML);
    y = y.substring(y.length - 4, y.length - 1);
    y = parseInt(y + '0');
    if (!years.includes(y)) {
        years.push(y);
        years.sort();
    }
    displaySelectYearOptions();
}

function updateYearDisplayed() {
    let selected = String(document.querySelector('.select-year').value);
    let start = selected.substring(0, selected.length - 1);

    let editable = document.querySelector('.toggle-edit');

    setEditabilityOfContent(false);
    allAlbums.forEach((album) => {
        let year = String(album.querySelector('.year').innerHTML);
        if (selected == '-1') {
            album.classList.remove('d-none');
            editable.removeAttribute('disabled');
            editable.innerHTML = 'Enable edit';
        } else if (!year.startsWith(start)) {
            album.classList.add('d-none');
            editable.setAttribute('disabled', true);
            editable.innerHTML = 'Enable edit<br>(Available in all time)';
        } else {
            album.classList.remove('d-none');
            editable.setAttribute('disabled', true);
            editable.innerHTML = 'Enable edit<br>(Available in all time)';
        }
    });
};