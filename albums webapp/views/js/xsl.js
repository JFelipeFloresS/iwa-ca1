/** 
 * Drag and drop handling!!!
*/

/**
 * This function stores the information of the TR that is being dragged into a variable draggedElement and into the DragEvent, 
 * and allows the DragEvent to move the data.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDragStart(e) {
    draggedElement = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragged');
};

/**
 * Removes the styling of the currently dragged TR and removes the class over of all previously added elements.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDragEnd(e) {
    this.classList.remove('dragged');
    allAlbums.forEach(function (item) {
        item.classList.remove('over');
    });
};

/**
 * Cancels the default action of the event, preventing the draggedElement from being dropped in the wrong place.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
};

/**
 * Adds the class over to the TR currently being hovered.
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDragEnter(e) {
    this.classList.add('over');
};

/**
 * Removes the class over from the TR that is no longer being hovered.
 * 
 * @param {DragEvent} e An event thatcontains the information of the drag.
 */
function handleDragLeave(e) {
    this.classList.remove('over');
};

// This queries all TRs that contain the information from the XML file.
allAlbums = document.querySelectorAll('.album-row');
allAlbums.forEach(function (album) {

    albumTitle = album.querySelector('.title').innerHTML;
    albumTitle = albumTitle.replaceAll('&amp;', '&');
    albumTitle = albumTitle.replaceAll('&quot;', '"');
    album.querySelector('.title').innerHTML = albumTitle;

    albumArtist = album.querySelector('.artist').innerHTML;
    albumArtist = albumArtist.replaceAll('&amp;', '&');
    albumArtist = albumArtist.replaceAll('&quot;', '"');
    album.querySelector('.artist').innerHTML = albumArtist;

});
/**
 * 
 * @param {DragEvent} e An event that contains the information of the drag.
 */
function handleDrop(e) {

    // Stops the current drag event from continuing.
    e.stopPropagation();

    // Handles the drop if the draggedElement is not the same as the dropped element.
    if (draggedElement !== this) {

        // Gets the position of both the draggedElement and the droppedElement in the NodeList allAlbums from their position in the chart.
        let dragPos = draggedElement.querySelector('#number').innerHTML - 1;
        let dropPos = this.querySelector('#number').innerHTML - 1;

        // In order to only iterate through the necessary elements in the NodeList, we need a starting and an ending point.
        let minPos = Math.min(dragPos, dropPos);
        let maxPos = Math.max(dragPos, dropPos);

        let draggedInnerHTML = draggedElement.innerHTML;

        if (dropPos == minPos) { // Handles the drop above the draggedElement.

            dropElementTop(minPos, maxPos, draggedInnerHTML);

        } else { // Handles the drop underneath the draggedElement.

            let currPos = minPos;
            let nextRow = allAlbums[currPos + 1].innerHTML;

            for (let i = minPos; i <= maxPos; i++) {

                // If it's the last position, then that element will get the draggedElement
                if (currPos == maxPos) {
                    allAlbums[i].innerHTML = draggedInnerHTML;
                } else {
                    allAlbums[i].innerHTML = nextRow;
                }

                // Updates the number of the current element and adjusts it for the next iteration.
                allAlbums[i].querySelector('#number').innerHTML = currPos + 1;
                currPos++;

                // Gets the next TR.
                if (i + 2 <= allAlbums.length - 1) {
                    nextRow = allAlbums[i + 2].innerHTML;
                }

            }
        }

        callPostUpdate();
    }
};

function dropElementTop(minPos, maxPos, dropElementInnerHTML) {
    // The iteration occurs backwards (maxPos to minPos).
    if (maxPos > 499) {
        maxPos = 499;
    }
    currPos = maxPos;
    let nextRow = allAlbums[currPos - 1].innerHTML;

    for (let i = maxPos; i >= minPos; i--) {
        console.log(i + ": " + nextRow);

        // If it's the last position, then that element will get the draggedElement
        if (currPos == minPos) {
            allAlbums[i].innerHTML = dropElementInnerHTML;
        } else {
            allAlbums[i].innerHTML = nextRow;
        }

        // Updates the number of the current element and adjusts it for the next iteration.
        allAlbums[i].querySelector('#number').innerHTML = currPos + 1;
        currPos--;

        // Gets the next TR
        if (i - 2 >= 0) {
            nextRow = allAlbums[i - 2].innerHTML;
        }

    }
}

function sortAlbums(newRow) {
    let newPos = newRow.querySelector('#number').innerHTML - 1;

    dropElementTop(newPos, allAlbums.length, newRow.innerHTML);
}

// Loop to add the event listeners to each TR
allAlbums.forEach(function (item) {
    addEventListeners(item);
});

function addEventListeners(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
    item.querySelector('#delete-button').addEventListener('click', (e) => { deleteElement(e); });
};

/**
 * Append handling!!
 */

breakException = {}; // Exception created solely to break from a forEach loop.

function appendElement() {
    let form = document.getElementById('append-form');
    let inputs = form.querySelectorAll('input');
    try {
        inputs.forEach(input => {
            if (input.value == '') {
                alert('Please write something first!');
                throw breakException;
            }
        });
    } catch (e) {
        if (e !== breakException) throw e;
        return;
    }

    if (inputs.item(0).value > 500) {
        alert('This is the top 500 albums list, not the top 1 million.');
        return;
    }

    let newRow = document.createElement('tr');
    newRow.className = 'album-row';
    newRow.id = 'album-row';
    newRow.setAttribute('draggable', true);

    let posTD = document.createElement('td');
    posTD.className = 'number';
    posTD.id = 'number';
    posTD.textContent = inputs.item(0).value;
    newRow.appendChild(posTD);

    let titleTD = document.createElement('td');
    titleTD.className = 'title';
    titleTD.textContent = inputs.item(1).value;
    newRow.appendChild(titleTD);

    let yearTD = document.createElement('td');
    yearTD.className = 'year';
    yearTD.textContent = inputs.item(2).value;
    newRow.appendChild(yearTD);

    let artistTD = document.createElement('td');
    artistTD.className = 'artist';
    artistTD.textContent = inputs.item(3).value;
    newRow.appendChild(artistTD);
    /*
        let genreTD = document.createElement('td');
        genreTD.className = 'genre';
        genreTD.textContent = inputs.item(4).value;
        newRow.appendChild(genreTD);
    
        let subTD = document.createElement('td');
        subTD.className = 'subgenre';
        subTD.textContent = inputs.item(5).value;
        newRow.appendChild(subTD);
    */
    let buttonTD = document.createElement('td');

    let button = document.createElement('button');
    button.className = 'btn btn-danger';
    button.textContent = 'delete';
    button.id = 'delete-button';

    if (document.querySelector('.toggle-edit').innerHTML == 'Enable edit') {
        button.disabled = true;
    } else {
        button.disabled = false;
    }

    buttonTD.appendChild(button);

    newRow.appendChild(buttonTD);

    sortAlbums(newRow);
    addEventListeners(newRow);

    inputs.forEach(input => {
        input.value = '';
    });

    allAlbums = document.querySelectorAll('.album-row');


    callPostUpdate();
};

document.getElementById('append').addEventListener('click', appendElement);

/**
 * Delete element!!
 */

/**
 * 
 * @param {PointerEvent} el 
 */
function deleteElement(el) {
    let delPos = el.target.parentNode.parentNode.querySelector('#number').innerHTML - 1;
    el.target.parentNode.parentNode.parentNode.removeChild(el.target.parentNode.parentNode);
    allAlbums = document.querySelectorAll('.album-row');
    for (let i = delPos; i < allAlbums.length; i++) {
        allAlbums[i].querySelector('#number').innerHTML = delPos + 1;
        delPos++;
    }
    callPostUpdate();
};

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

function saveChanges() {
    callPostUpdate();
};

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

function toggleEnable() {
    let btn = document.querySelector('.toggle-edit');
    let editable;
    if (btn.innerHTML == 'Enable edit') {
        btn.innerHTML = 'Disable edit';
        editable = true;
    } else {
        btn.innerHTML = 'Enable edit';
        editable = false;
    }

    allAlbums.forEach((album) => {
        if (editable) {
            album.querySelector('#delete-button').removeAttribute('disabled');
        } else {
            album.querySelector('#delete-button').setAttribute('disabled', true);
        }
        console.log(album.querySelector('.btn-td').querySelector('#delete-button'));
        album.querySelector('.title').setAttribute('contentEditable', editable);
        album.querySelector('.year').setAttribute('contentEditable', editable);
        album.querySelector('.artist').setAttribute('contentEditable', editable);
        album.setAttribute('draggable', editable);
    });
}