/**
 * Validates the editable TD's for each TR and calls the update on the server.
 */
function saveEdit() {

    try {

        // Boolean for validation of the fields as a whole.
        let isValidFields = true;

        // Validates each TR and changes the boolean to false if not valid.
        allAlbums.forEach((album) => {
            isValidFields *= isValidInformation(album);
        });

        // Throws an error if any field is not valid.
        if (!isValidFields) throw breakException;

        // Calls post update if all fields are valid.
        callPostUpdate();
    } catch (e) {
        if (e !== breakException) throw e;
    }
};

/**
 * Validates the contents of a TR.
 * 
 * @param {HTMLTableRowElement} album TR to be checked
 * @returns true if valid, false if not valid
 */
function isValidInformation(album) {
    let isValid = true;

    // Gets all TD's as variables.
    let pos = album.querySelector('.number').innerHTML;
    let title = album.querySelector('.title');
    let year = album.querySelector('.year');
    let artist = album.querySelector('.artist');

    // Chekcs the title TD and alerts the user if not valid.
    if (title.innerHTML.trim() == '') {
        title.style.border = '2px solid red';
        title.style.backgroundColor = '#eee';
        isValid = false;

        badNotification({
            title: 'Invalid information',
            message: 'Please insert a valid title at position ' + pos + '.',
        });
    } else {
        title.style = ''; // Empties the style of the TD if it's valid.
    }

    // Chekcs the year TD and alerts the user if not valid.
    if (year.innerHTML.trim() == '' || isNaN(year.innerHTML) || parseInt(year.innerHTML) < 1900 || parseInt(year.innerHTML) > 2022) {

        year.style.border = '2px solid red';
        year.style.backgroundColor = '#eee';
        isValid = false;

        badNotification({
            title: 'Invalid information',
            message: 'Please insert a valid number into the year field (1900-2022) at position ' + pos + '.'
        });
    } else {
        year.style = ''; // Empties the style of the TD if it's valid.
    }

    // Chekcs the artist TD and alerts the user if not valid.
    if (artist.innerHTML.trim() == '') {
        artist.style.border = '2px solid red';
        artist.style.backgroundColor = '#eee';
        isValid = false;

        badNotification({
            artist: 'Invalid information',
            message: 'Please insert a valid artist at position ' + pos + '.'
        });
    } else {
        artist.style = ''; // Empties the style of the TD if it's valid.
    }

    return isValid;
};