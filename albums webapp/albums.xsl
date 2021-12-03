<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match='/'>
        <table class='album-table'>
            <thead>
                <th>Position</th>
                <th>Title</th>
                <th>Year</th>
                <th>Artist</th>
                <th>Genre</th>
                <th>Subgenre</th>
            </thead>
            <tbody>
                <xsl:for-each select='//Album'>
                    <tr>
                        <td>
                            <xsl:value-of select='Number' />
                        </td>
                        <td>
                            <xsl:value-of select='Title' />
                        </td>
                        <td>
                            <xsl:value-of select='Year' />
                        </td>
                        <td>
                            <xsl:value-of select='Artist' />
                        </td>
                        <td>
                            |
                            <xsl:for-each select='Genres/Genre'>
                                <xsl:value-of select='.' />
                                |
                            </xsl:for-each>
                        </td>
                        <td>
                            |
                            <xsl:for-each select='Subgenres/Subgenre'>
                                <xsl:value-of select='.' />
                                |
                            </xsl:for-each>
                        </td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>