updateYearOptions();

displaySelectYearOptions();

/**
 * Updates the variable years and calls a function to display them to the user.
 */
function updateYearOptions() {

    // Starts the array with the number -1 (for all times)
    years = [-1];

    allAlbums.forEach((album) => {
        addYearToSelectOptions(album);
    });

    years.sort();

    displaySelectYearOptions();
}

/**
 * Appends the available decades to the HTML select element as options.
 */
function displaySelectYearOptions() {

    // Empties the current HTML select
    let selectYear = document.querySelector('.select-year');
    selectYear.innerHTML = '';

    // Creates and appends a new element option for each decade available
    years.forEach((year) => {

        let newElement = document.createElement('option');
        newElement.value = year;
        newElement.innerHTML = year;

        // Displays All time to the user for the option -1
        if (year == -1) {
            newElement.innerHTML = 'All time';
        }

        selectYear.appendChild(newElement);

    });

}

/**
 * Adds a decade to the years Array if the decade isn't part of it yet.
 * 
 * @param {HTMLTableRowElement} album a table row with the information of an album
 */
function addYearToSelectOptions(album) {

    // Gets the 3 initial numbers of the year as a String
    let y = String(album.querySelector('.year').innerHTML);
    y = y.substring(0, y.length - 1);

    // Transforms the String into a number that ends with 0
    y = parseInt(y + '0');

    if (!years.includes(y)) {
        years.push(y);
        years.sort();
    }

    displaySelectYearOptions();

}

/**
 * Displays the albums from the decade selected by the user.
 */
function updateYearDisplayed() {

    // Gets the 3 first numbers of the year as a String
    let selected = String(document.querySelector('.select-year').value);
    let start = selected.substring(0, selected.length - 1);

    // Editing is only available if all albums are being displayed.
    let editable = document.querySelector('.toggle-edit');

    setEditabilityOfContent(false);

    if (selected == '-1') {
        editable.removeAttribute('disabled');
        editable.innerHTML = 'enable edit';
    } else {
        editable.setAttribute('disabled', true);
        editable.innerHTML = 'enable edit<br>(Available in all time)';
    }

    allAlbums.forEach((album) => {

        let year = String(album.querySelector('.year').innerHTML);

        // Hides and shows elements based on the decade selected
        if (!year.startsWith(start) && selected != '-1') {
            album.classList.add('d-none');
        } else {
            album.classList.remove('d-none');
        }

    });

};