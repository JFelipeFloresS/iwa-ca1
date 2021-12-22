/**
 * Draws the table with the desired content.
 */
function draw_table() {

    $('#results').empty(); // Empties any content that might have been there beforehand.

    // Gets the HTML content created from the XML and XSL files on the server and puts it on the web page.
    $.getHTMLuncached = function (url) {
        return $.ajax({
            url: url,
            type: 'GET',
            cache: false,
            success: function (html) {
                $('#results').append(html);
            }
        });
    };

    $.getHTMLuncached('get/table');
}

/**
 * Draws the table when the page is ready.
 */
$(document).ready(function () {
    draw_table();
});