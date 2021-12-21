<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match='/'>
        
        <!-- Table start -->
        <table id='albums-table'>

            <!-- Table headers -->
            <thead>
                <th>Position</th>
                <th>Title</th>
                <th>Year</th>
                <th>Artist</th>
                <th></th>
            </thead>

            <!-- Table body -->
            <tbody id='tableBody'>

                <xsl:for-each select='//Album'>

                    <!-- New table row for each album in the XML file -->
                    <tr class='album-row' id='album-row' draggable='false'>

                        <!-- Information to be displayed -->
                        <td class='number' id='number'>
                            <xsl:value-of select='Number' />
                        </td>

                        <td class='title' contentEditable='false'>
                            <xsl:value-of select='Title' />
                        </td>

                        <td class='year' contentEditable='false'>
                            <xsl:value-of select='Year' />
                        </td>

                        <td class='artist' contentEditable='false'>
                            <xsl:value-of select='Artist' />
                        </td>

                        <!-- Delete element button-->
                        <td class='btn-td'><button class='btn btn-danger' id='delete-button' disabled='true'>delete</button></td>
                        
                    </tr>

                </xsl:for-each>

            </tbody>

        </table>

        <script src="./js/xsl.js"></script>

    </xsl:template>

</xsl:stylesheet>