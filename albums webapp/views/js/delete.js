/**
 * Deletes an element from the table.
 * 
 * @param {PointerEvent} el 
 */
function deleteElement(el) {

    let delPos = el.target.parentNode.parentNode.querySelector('#number').innerHTML;
    el.target.parentNode.parentNode.parentNode.removeChild(el.target.parentNode.parentNode);

    // Adjusts the position of the remaining elements
    allAlbums = document.querySelectorAll('.album-row');
    for (let i = delPos - 1; i < allAlbums.length; i++) {
        allAlbums[i].querySelector('#number').innerHTML = delPos;
        delPos++;
    }

    // Removes the year option from the HTML select if it's the last element from that decade
    updateYearOptions();

    // Posts update to the server
    callPostUpdate();
};