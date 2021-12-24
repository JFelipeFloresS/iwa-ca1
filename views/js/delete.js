/**
 * Deletes an element from the table.
 * 
 * @param {PointerEvent} el 
 */
function deleteElement(el) {

    if (!isTableValid()) {
        return
    }
    let delPos = el.target.parentNode.parentNode.querySelector('#number').innerHTML;
    el.target.parentNode.parentNode.parentNode.removeChild(el.target.parentNode.parentNode);

    // Adjusts the position of the remaining elements
    allAlbums = document.querySelectorAll('.album-row');
    for (let i = delPos - 1; i < allAlbums.length; i++) {
        allAlbums[i].querySelector('#number').innerHTML = delPos;
        delPos++;
    }

    // Posts update to the server
    saveEdit();
};