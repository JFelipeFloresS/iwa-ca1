function saveEdit() {

    try {
        let isValidFields = true;
        allAlbums.forEach((album) => {
            if (!isValidInformation(album)) {
                isValidFields = false;
            }
        });

        if (!isValidFields) throw breakException;

        callPostUpdate();
    } catch (e) {
        if (e !== breakException) throw e;
    }
};

function isValidInformation(album) {
    let isValid = true;

    let pos = album.querySelector('.number').innerHTML;
    let title = album.querySelector('.title');
    let year = album.querySelector('.year');
    let artist = album.querySelector('.artist');

    if (title.innerHTML.trim() == '') {
        title.style.border = '2px solid red';
        title.style.backgroundColor = '#eee';
        isValid = false;

        badNotification({
            title: 'Invalid information',
            message: 'Please insert a valid title at position ' + pos + '.',
        });
    } else {
        title.style = '';
    }

    if (year.innerHTML.trim() == '' || isNaN(year.innerHTML) || parseInt(year.innerHTML) < 1900 || parseInt(year.innerHTML) > 2022) {

        year.style.border = '2px solid red';
        year.style.backgroundColor = '#eee';
        isValid = false;

        badNotification({
            title: 'Invalid information',
            message: 'Please insert a valid number into the year field (1900-2022) at position ' + pos + '.'
        });
    } else {
        year.style = '';
    }

    if (artist.innerHTML.trim() == '') {
        artist.style.border = '2px solid red';
        artist.style.backgroundColor = '#eee';
        isValid = false;

        badNotification({
            artist: 'Invalid information',
            message: 'Please insert a valid artist at position ' + pos + '.'
        });
    } else {
        artist.style = '';
    }

    return isValid;
};