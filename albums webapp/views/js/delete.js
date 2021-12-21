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