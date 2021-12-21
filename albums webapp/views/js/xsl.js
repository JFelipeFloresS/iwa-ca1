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
 * Stops the current drag event and places the dragged element where it has been dropped, moving all other items accordingly.
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

/**
 * Moves all elements below the minPos downwards and places the dragged element on top of them.
 * 
 * @param {Integer} minPos top position
 * @param {Integer} maxPos bottom position
 * @param {DOMString} dropElementInnerHTML dragged element DOMString
 */
function dropElementTop(minPos, maxPos, dropElementInnerHTML) {
    // The iteration occurs backwards (maxPos to minPos).
    if (maxPos > 499) {
        maxPos = 499;
    }
    currPos = maxPos;
    let nextRow = allAlbums[currPos - 1].innerHTML;

    for (let i = maxPos; i >= minPos; i--) {

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

/**
 * Puts a new element on its right place.
 * 
 * @param {Element} newRow new element that has been added
 */
function sortAlbums(newRow) {
    let newPos = newRow.querySelector('#number').innerHTML - 1;
    if (allAlbums.length < 500) {
        let addRow = document.createElement('tr');
        addRow.className = 'album-row';
        addRow.id = 'album-row';
        document.querySelector('#tableBody').appendChild(addRow);
        allAlbums = document.querySelectorAll('.album-row');
    }
    dropElementTop(newPos, allAlbums.length - 1, newRow.innerHTML);
}

// Loop to add the event listeners to each TR
allAlbums.forEach(function (item) {
    addEventListeners(item);
});

/**
 * Adds the event listeners required to drag and drop and delete a table row.
 * 
 * @param {Element} item tr element to add event listeners
 */
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

/**
 * Creates an element from the form and places it in the correct place on the table.
 * 
 * @returns null
 */
function appendElement() {

    // Gets all inputs within the append-form
    let form = document.getElementById('append-form');
    let inputs = form.querySelectorAll('input');

    try {
        // Checks if inputs are not empty
        inputs.forEach(input => {
            if (input.value == '') {
                alert('Please write something first!');
                throw breakException;
            }
        });
    } catch (e) { // try catch created to break from forEach loop
        if (e !== breakException) throw e;
        return;
    }

    // Only up to 500 albums are allowed to be on the list.
    if (inputs.item(0).value > 500) {
        alert('This is the top 500 albums list, not the top 1 million.');
        return;
    }

    /**
     * Creates a new Element with the information provided by the user.
     */
    let newRow = document.createElement('tr');
    newRow.className = 'album-row';
    newRow.id = 'album-row';
    newRow.setAttribute('draggable', true);

    let posTD = document.createElement('td');
    posTD.className = 'number';
    posTD.id = 'number';
    posTD.textContent = inputs.item(0).value;
    posTD.contentEditable = false;
    newRow.appendChild(posTD);

    let titleTD = document.createElement('td');
    titleTD.className = 'title';
    titleTD.textContent = inputs.item(1).value;
    titleTD.contentEditable = false;
    newRow.appendChild(titleTD);

    let yearTD = document.createElement('td');
    yearTD.className = 'year';
    yearTD.textContent = inputs.item(2).value;
    yearTD.contentEditable = false;
    newRow.appendChild(yearTD);

    let artistTD = document.createElement('td');
    artistTD.className = 'artist';
    artistTD.textContent = inputs.item(3).value;
    artistTD.contentEditable = false;
    newRow.appendChild(artistTD);

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

    // Places all rows in their right places and adds the event listeners to the new Element
    escapeString(newRow);
    addYearToSelectOptions(newRow);
    sortAlbums(newRow);
    addEventListeners(newRow);

    // Empties the inputs
    inputs.forEach(input => {
        input.value = '';
    });

    // Updates the list of albums
    allAlbums = document.querySelectorAll('.album-row');


    callPostUpdate();
};

// Event listener for the append button
document.getElementById('append').addEventListener('click', appendElement);

/**
 * Delete element!!
 */

/**
 * Deletes an element from the table.
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
        album.querySelector('.title').setAttribute('contentEditable', editable);
        album.querySelector('.year').setAttribute('contentEditable', editable);
        album.querySelector('.artist').setAttribute('contentEditable', editable);
        album.setAttribute('draggable', editable);
    });
}

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