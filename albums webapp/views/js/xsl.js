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
    albumTitle = albumTitle.replace('&amp;', '&');
    albumTitle = albumTitle.replace('&quot;', '"');
    album.querySelector('.title').innerHTML = albumTitle;

    albumArtist = album.querySelector('.artist').innerHTML;
    albumArtist = albumArtist.replace('&amp;', '&');
    albumArtist = albumArtist.replace('&quot;', '"');
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

function sortAlbums(newRow) {
    let pos = newRow.querySelector('.number').innerHTML - 1;
    let size = allAlbums.length - 1;
    if (pos > size) {
        console.log('too big');
        newRow.remove();
    }
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
    buttonTD.appendChild(button);

    newRow.appendChild(buttonTD);

    sortAlbums(newRow);
    addEventListeners(newRow);

    document.getElementById('tableBody').appendChild(newRow);

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
 * TODO ESCAPE ' " & BEFORE ADDING TO JSON !!!!!!!!!!!!!!!!!!!!!!!
 * @returns 
 */
function getJSONFromList() {
    let json = '{ Collection:';
    for (i = 0; i < allAlbums.length; i++) {
        row = allAlbums[i];
        json += '{ Album: {' +
            '{Number:' + encodeURI(row.querySelector('#number').innerHTML) + '},' +
            '{Year: ' + encodeURI(row.querySelector('.year').innerHTML) + '},' +
            '{Title: ' + encodeURI(row.querySelector('.title').innerHTML) + '},' +
            '{Artist: ' + encodeURI(row.querySelector('.artist').innerHTML) + '}' +
            '}}';
        if (i < allAlbums.length - 1) {
            json += ',';
        }
    }
    json += '}';
    console.log(json);
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
};