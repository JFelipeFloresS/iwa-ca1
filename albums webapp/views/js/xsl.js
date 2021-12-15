/** 
 * Drag and drop handling!!!
*/

/**
 * 
 * @param {*} e 
 */
function handleDragStart(e) {
    dragScrollEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.style.backgroundColor = '#f0f0f0';
    this.style.border = '1px solid #000';
}

function handleDragEnd(e) {
    this.style = '';
    draggables.forEach(function (item) {
        item.classList.remove('over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }

    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

let allRows = document.querySelectorAll('.album-row');

function handleDrop(e) {
    e.stopPropagation();

    if (dragScrollEl !== this) {
        let scrollPos = dragScrollEl.querySelector('#number').innerHTML - 1;
        let dropPos = this.querySelector('#number').innerHTML - 1;
        let minPos = Math.min(scrollPos, dropPos);
        let maxPos = Math.max(scrollPos, dropPos);
        let currPos;
        if (dropPos == minPos) {
            currPos = maxPos;
            let dragged = dragScrollEl.innerHTML;
            let currentRow = allRows[currPos - 1].innerHTML;
            for (let i = maxPos; i >= minPos; i--) {

                if (currPos == minPos) {
                    allRows[i].innerHTML = dragged;
                } else {
                    allRows[i].innerHTML = currentRow;
                }

                allRows[i].querySelector('#number').innerHTML = currPos + 1;
                currPos--;
                if (i - 2 >= 0) {
                    currentRow = allRows[i - 2].innerHTML;
                }

            }
        } else {
            currPos = minPos;
            let dragged = dragScrollEl.innerHTML;
            let currentRow = allRows[currPos + 1].innerHTML;
            for (let i = minPos; i <= maxPos; i++) {

                if (currPos == maxPos) {
                    allRows[i].innerHTML = dragged;
                } else {
                    allRows[i].innerHTML = currentRow;
                }

                allRows[i].querySelector('#number').innerHTML = currPos + 1;
                currPos++;
                if (i + 2 <= allRows.length - 1) {
                    currentRow = allRows[i + 2].innerHTML;
                }

            }
        }
    }

    return false;
}

let draggables = document.querySelectorAll('.album-row');

draggables.forEach(function (item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
});

/**
 * Append handling
 */
let breakException = {};

document.getElementById('append').addEventListener('click', (e) => {
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
        // return;
    }

    let pos = inputs.item(0).value;
    let title = inputs.item(1).value;
    let year = inputs.item(2).value;
    let artist = inputs.item(3).value;
    let genre = inputs.item(4).value;
    let subgenre = inputs.item(5).value;
    let newRow = document.createElement(null);
    newRow.innerHTML = "<tr class='album-row' id='album-row' draggable='true' year=" + year + "><td class='number' id='number'>" +
        pos +
        "</td><td class='title'>" +
        title +
        "</td><td class='year'>" +
        year +
        "</td><td class='artist'>" +
        artist +
        "</td><td class='genres'>" +
        genre +
        "</td><td class='subgenres'>" +
        subgenre +
        "</td> <td><button class='btn btn-primary'>delete</button></td></tr>";
    Array.prototype.push.apply(allRows, newRow);
});