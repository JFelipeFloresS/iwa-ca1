breakException = {}; // Exception created solely to break from a forEach loop.

// Event listener for the append button
document.getElementById('append').addEventListener('click', appendElement);

/**
 * Creates an element from the form and places it in the correct place on the table.
 */
function appendElement() {

    // Gets all inputs within the append-form
    let form = document.getElementById('append-form');
    let inputs = form.querySelectorAll('input');

    try {
        // Checks if inputs are not empty
        inputs.forEach(input => {
            input.value = input.value.trim();
            console.log(input.value);
            if (input.value == '') {
                badNotification({
                    title: 'Error',
                    message: 'Pleas fill in all fields!'
                });
                throw breakException;
            }

            if (input.getAttribute('name') == 'position' && (input.value < 1 || input.value > 500)) {
                badNotification({
                    title: 'Error',
                    message: 'Only positions from 1 to 500 allowed!'
                });
                throw breakException;
            }

            if (input.getAttribute('name') == 'year' && (input.value < 1900 || input.value > 2022)) {
                badNotification({
                    title: 'Error',
                    message: 'Only albums from 1900 to 2022 allowed!'
                });
                throw breakException;
            }
        });
    } catch (e) { // try catch created to break from forEach loop
        if (e !== breakException) throw e;
        return;
    }

    // Places the item in the first position available if greater than the current amount of albums.
    if (inputs.item(0).value > allAlbums.length + 1) {
        inputs.item(0).value = allAlbums.length + 1;
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

    if (document.querySelector('.toggle-edit').innerHTML == 'enable edit') {
        button.disabled = true;
    } else {
        button.disabled = false;
    }

    buttonTD.appendChild(button);

    newRow.appendChild(buttonTD);

    // Places all rows in their right places and adds the event listeners to the new Element
    unescapeString(newRow);
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
