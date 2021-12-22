const express = require("express"), //Allows to respond to HTTP requests, defines routing and renders the required content
    bodyParser = require('body-parser'), // Parses the body of requests
    fs = require("fs"), //Working with the file system (read and write files)
    http = require("http"), //HTTP Server
    path = require("path"), //Utility that allows us to work with directory paths
    xml2js = require("xml2js"), //This is XML <-> JSON converter
    xmlParse = require("xslt-processor").xmlParse, //Parsing XML
    xsltProcess = require("xslt-processor").xsltProcess; //Processing XSLT

const router = express(), //Instantiating Express
    server = http.createServer(router); //Instantiating the server

router.use(express.static(path.resolve(__dirname, "views"))); //Serving static content from "public" folder

/**
 * Uses the bodyParser module in order to escape special characters and handle JSON transformations better.
 */
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/**
 * Overwrites an XML file with the information stored in a JSON.
 * 
 * @param {String} filename file to be overwritten.
 * @param {JSON} obj information to be written.
 * @param {NoParamCallback} cb call back.
 */
function JSONtoXML(filename, obj, cb) {
    let filepath = path.normalize(path.join(__dirname, filename));
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
}

/**
 * Serves HTML content created based on an XML and an XSL file. 
 */
router.get("/get/table", function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html",
    }); //Tell the user that the resource exists and which type that is

    let xml = fs.readFileSync("albums.xml", "utf8"), //read in the XML file
        xsl = fs.readFileSync("albums.xsl", "utf8"); //read in the XSL file

    let doc = xmlParse(xml), //Parse the XML file
        stylesheet = xmlParse(xsl); //Parse the XSL file

    let result = xsltProcess(doc, stylesheet); //Performing XSLT

    res.end(result.toString()); //Serve back the user
});

/**
 * Updates an XML file with the information of a JSON.
 */
router.post("/post/update", function (req, res) {

    /**
     * Calls the JSONtoXML function.
     * 
     * @param {JSON} json updated information
     */
    function updateJSON(json) {
        JSONtoXML("./albums.xml", json, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    updateJSON(req.body);

    res.redirect("back");
});

/**
 * Transforms the updated XML file into the backup original file.
 */
router.post("/post/fallback", function (req, res) {

    /**
     * Reads the information from the original and writes it into the normal file.
     */
    function fallBack() {

        fs.readFile('./originalalbums.xml', 'utf-8', function (err, data) {

            if (err) throw err;
            data = data.toString();

            fs.writeFile('./albums.xml', data, function (err) {
                err;
            });

        });

    }

    fallBack();

    res.redirect('fallback');
});

/**
 * Initiates the server and opens the port to listen.
 */
server.listen(
    process.env.PORT || 3000,
    process.env.IP || "0.0.0.0",
    function () {
        const addr = server.address();
        console.log("Server listening at", addr.address + ":" + addr.port);
    }
);