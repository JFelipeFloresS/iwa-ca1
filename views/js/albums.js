// This queries all TRs that contain the information from the XML file.
allAlbums = document.querySelectorAll('.album-row');
allAlbums.forEach(function (album) {

    unescapeString(album);

});

/**
 * Replaces the &amp; and &quot; symbols with & and "
 * 
 * @param {HTMLTableRowElement} album element to unescape the Strings
 */
function unescapeString(album) {

    albumTitle = album.querySelector('.title').innerHTML;
    albumTitle = albumTitle.replaceAll('&amp;', '&');
    albumTitle = albumTitle.replaceAll('&quot;', '"');
    album.querySelector('.title').innerHTML = albumTitle;

    albumArtist = album.querySelector('.artist').innerHTML;
    albumArtist = albumArtist.replaceAll('&amp;', '&');
    albumArtist = albumArtist.replaceAll('&quot;', '"');
    album.querySelector('.artist').innerHTML = albumArtist;
}

/**
 * Creates a JSON from the elements with album-row class (got from XML file).
 * 
 * @returns JSON of updated albums
 */
function getJSONFromList() {
    try {
        let json = '{ "Collection": {"Album": [';
        for (i = 0; i < allAlbums.length; i++) {
            row = allAlbums[i];
            json += '{' +
                '"Number":' + row.querySelector('#number').innerHTML + ',' +
                '"Year": ' + row.querySelector('.year').innerHTML + ',' +
                '"Title": "' + escapeStringJSON(row.querySelector('.title').innerHTML) + '",' +
                '"Artist": "' + escapeStringJSON(row.querySelector('.artist').innerHTML) + '"' +
                '}';
            if (i < allAlbums.length - 1) {
                json += ',';
            }
        }
        json += ']}}';
        json = json.replaceAll('<br>', ' ');
        return JSON.parse(json);
    } catch (err) {
        badNotification({
            title: 'Error',
            message: err
        });
        return null;
    }
};

/**
 * Escapes necessary characters for the JSON.
 * 
 * @param {String} string unescaped String
 * @returns escapedS String
 */
function escapeStringJSON(string) {
    return string.replaceAll(/[\\]/g, '\\\\')
        .replaceAll(/[\"]/g, '\\\"')
        .replaceAll(/[\/]/g, '\\/')
        .replaceAll(/[\b]/g, '\\b')
        .replaceAll(/[\f]/g, '\\f')
        .replaceAll(/[\n]/g, '\\n')
        .replaceAll(/[\r]/g, '\\r')
        .replaceAll(/[\t]/g, '\\t')
}

/**
 * Creates a notification that can be called whenever it's needed.
 * Retrieved from https://github.com/JamieLivingstone/styled-notifications
 */
notification = window.createNotification({
    closeOnClick: true,
    positionClass: 'nfc-bottom-left',
    showDuration: 2500,
    theme: 'success'
});

badNotification = window.createNotification({
    closeOnClick: true,
    positionClass: 'nfc-bottom-left',
    showDuration: 3500,
    theme: 'error'
});

/**
 * Saves the information of the webpage into the XML file.
 */
function callPostUpdate() {

    // If a new decade has been added or there are no albums from a decade left, updates the decade options.
    updateYearOptions();

    let json = JSON.stringify(getJSONFromList());

    try {
        // Posts the JSON to the server.
        $.ajax({
            type: 'POST',
            url: '/post/update',
            dataType: 'json',
            contentType: 'application/json',
            data: '{ "body": ' + json + '}',
            async: false
        });

        // Notifies the user that the changes have been made.
        notification({
            title: 'Saved!',
            message: 'Changes have been successfully saved.',
        });

        draw_table();
    } catch (err) {
        badNotification({
            title: 'Error',
            message: err
        });
    }
};

/**
 * Changes the data in the XML in use into the original Rolling Stones list.
 */
function fallBackToOriginalXML() {
    if (!confirm('This will be irreversible and you won\'t be able to get your modified data back. Are you sure you want to continue?')) {
        return
    }

    if (!confirm('All your data will be lost. Proceed?')) {
        return
    }

    try {
        // Posts the fallback request to the server
        $.ajax({
            type: 'POST',
            url: '/post/fallback',
            dataType: 'json',
            contentType: 'application/json',
            data: '{"body": { "fallback": true } }',
            async: false
        });

        draw_table();

        notification({
            title: 'Fall back successful!',
            message: 'All the original data has been successfully restored.'
        });

    } catch (err) {
        badNotification({
            title: 'Error',
            message: err
        });
    }
};

/**
 * Enables and disables the edit of the table rows.
 */
function toggleEnable() {

    try {
        // Toggles the enable/disable edit button
        let btn = document.querySelector('.toggle-edit');
        let editable;
        if (btn.innerHTML == 'enable edit') {
            btn.innerHTML = 'disable edit';
            editable = true;
        } else {
            btn.innerHTML = 'enable edit';
            editable = false;
        }

        setEditabilityOfContent(editable);

    } catch (err) {
        badNotification({
            title: 'Error',
            message: err
        });
    }

}

/**
 * Toggles editability of TR's by enabling or disabling the delete button, the draggable attribute and the contentEditable attribute.
 * 
 * @param {boolean} editable if the contents are editable or not
 */
function setEditabilityOfContent(editable) {
    try {

        allAlbums.forEach((album) => {

            if (editable) {
                album.querySelector('#delete-button').removeAttribute('disabled');
            } else {
                album.querySelector('#delete-button').setAttribute('disabled', true);
            }
            album.querySelector('.title').setAttribute('contentEditable', editable);
            album.querySelector('.year').setAttribute('contentEditable', editable);
            album.querySelector('.artist').setAttribute('contentEditable', editable);
            album.setAttribute('draggable', editable);

        });

    } catch (err) {
        badNotification({
            title: 'Error',
            message: err
        });
    }
}