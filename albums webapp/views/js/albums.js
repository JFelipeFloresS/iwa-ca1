// This queries all TRs that contain the information from the XML file.
allAlbums = document.querySelectorAll('.album-row');
allAlbums.forEach(function (album) {

    escapeString(album);

});

function escapeString(album) {

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
    let json = '{ "Collection": {"Album": [';
    for (i = 0; i < allAlbums.length; i++) {
        row = allAlbums[i];
        json += '{' +
            '"Number":' + row.querySelector('#number').innerHTML + ',' +
            '"Year": ' + row.querySelector('.year').innerHTML + ',' +
            '"Title": "' + row.querySelector('.title').innerHTML
                .replaceAll(/[\\]/g, '\\\\')
                .replaceAll(/[\"]/g, '\\\"')
                .replaceAll(/[\/]/g, '\\/')
                .replaceAll(/[\b]/g, '\\b')
                .replaceAll(/[\f]/g, '\\f')
                .replaceAll(/[\n]/g, '\\n')
                .replaceAll(/[\r]/g, '\\r')
                .replaceAll(/[\t]/g, '\\t') + '",' +
            '"Artist": "' + row.querySelector('.artist').innerHTML
                .replaceAll(/[\\]/g, '\\\\')
                .replaceAll(/[\"]/g, '\\\"')
                .replaceAll(/[\/]/g, '\\/')
                .replaceAll(/[\b]/g, '\\b')
                .replaceAll(/[\f]/g, '\\f')
                .replaceAll(/[\n]/g, '\\n')
                .replaceAll(/[\r]/g, '\\r')
                .replaceAll(/[\t]/g, '\\t') + '"' +
            '}';
        if (i < allAlbums.length - 1) {
            json += ',';
        }
    }
    json += ']}}';

    return JSON.parse(json);
};

/**
 * Saves the information of the webpage into the XML file.
 */
function callPostUpdate() {
    let json = JSON.stringify(getJSONFromList());

    $.ajax({
        type: 'POST',
        url: '/post/update',
        dataType: 'json',
        contentType: 'application/json',
        data: '{ "body": ' + json + '}',
        async: false
    });

    const notification = window.createNotification({

        closeOnClick: true,
        positionClass: 'nfc-bottom-left',
        showDuration: 2500,
        theme: 'success'
    });

    notification({
        title: 'Saved!',
        message: 'Changes have been successfully saved.',
    });
};

/**
 * Changes the data in the XML in use into the original Rolling Stones list.
 * 
 * @returns null
 */
function fallBackToOriginalXML() {
    if (!confirm('This will be irreversible and you won\'t be able to get your modified data back. Are you sure you want to continue?')) {
        return;
    }

    if (!confirm('All your data will be lost. Proceed?')) {
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/post/fallback',
        dataType: 'json',
        contentType: 'application/json',
        data: '{"body": { "fallback": true } }',
        async: false
    });

    draw_table();
};

/**
 * Enables and disables the edit of the table rows.
 */
function toggleEnable() {
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

}

function setEditabilityOfContent(editable) {
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
}