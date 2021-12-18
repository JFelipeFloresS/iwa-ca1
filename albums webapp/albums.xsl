<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match='/'>
        <table id='albums-table'>
            <thead>
                <th>Position</th>
                <th>Title</th>
                <th>Year</th>
                <th>Artist</th>
                <!--
                <th>Genre</th>
                <th>Subgenre</th>
                -->
            </thead>
            <tbody id='tableBody'>
                <xsl:for-each select='//Album'>
                    <tr class='album-row' id='album-row' draggable='true'>
                        <td class='number' id='number'>
                            <xsl:value-of select='Number' />
                        </td>
                        <td class='title'>
                            <xsl:value-of select='Title' />
                        </td>
                        <td class='year'>
                            <xsl:value-of select='Year' />
                        </td>
                        <td class='artist'>
                            <xsl:value-of select='Artist' />
                        </td>
                        <!--
                        <td class='genres'>
                            <xsl:for-each select='Genres/Genre'>
                                <xsl:value-of select='.' />
                                <br />
                            </xsl:for-each>
                        </td>
                        <td class='subgenres'>
                            <xsl:for-each select='Subgenres/Subgenre'>
                                <xsl:value-of select='.' />
                                <br>
                            </xsl:for-each>
                        </td>
                        -->
                        <td><button class='btn btn-danger' id='delete-button'>delete</button></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
        <script src="./js/xsl.js"></script>
    </xsl:template>
</xsl:stylesheet>