<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match='/'>
    <html>
        <head>
            <title>BEST ALBUMS OF ALL TIMES</title>
            <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>
            <link rel="stylesheet" href="./css/albums.css"/>
            <script type='text/javascript' src="./js/albums.js"></script>
            <link rel="shortcut icon" href="./assets/logo.jpg" type="image/x-icon"/>
        </head>

        <body>
            
            <div class='navbar row'>
                <div class='col-sm logo'>
                    <img src="./assets/logo.jpg" alt="Rolling Stone" width='10%'/>
                </div>
            </div>

            <div class='container'>

                <div class='container-header'>
                    <h3>Updating the top 500 albums of all time</h3>
                </div>

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
                                <td><xsl:value-of select='Number' /></td>
                                <td><xsl:value-of select='Title' /></td>
                                <td><xsl:value-of select='Year' /></td>
                                <td><xsl:value-of select='Artist' /></td>
                                <td>| <xsl:for-each select='Genres/Genre'><xsl:value-of select='.' /> | </xsl:for-each> </td>
                                <td>| <xsl:for-each select='Subgenres/Subgenre'><xsl:value-of select='.' /> | </xsl:for-each> </td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </div>

        </body>
    </html>
</xsl:template>
</xsl:stylesheet>