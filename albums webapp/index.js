const express = require("express"), //Allows to respond to HTTP requests, defines routing and renders the required content
    fs = require("fs"), //Working with the file system (read and write files)
    http = require("http"), //HTTP Server
    path = require("path"), //Utility that allows us to work with directory paths
    xml2js = require("xml2js"), //This is XML <-> JSON converter
    xmlParse = require("xslt-processor").xmlParse, //Parsing XML
    xsltProcess = require("xslt-processor").xsltProcess; //Processing XSLT

const router = express(), //Instantiating Express
    server = http.createServer(router); //Instantiating the server

router.use(express.static(path.resolve(__dirname, "views"))); //Serving static content from "public" folder

function XMLtoJSON(filename, cb) {
    let filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, "utf8", function (err, xmlStr) {
        if (err) throw (err);
        xml2js.parseString(xmlStr, {}, cb);
    });
}

function JSONtoXML(filename, obj, cb) {
    let filepath = path.normalize(path.join(__dirname, filename));
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
}

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

router.post("/post/json", function (req, res) {
    function appendJSON(obj) {
        console.log(obj);

        XMLtoJSON("albums.xml", function (err, result) {
            if (err) console.log(err);
            result.Collection.Album.entry.push({
                Number: obj.Number,
                Year: obj.Year,
                Title: obj.Title,
                Artist: obj.Artist,
                Genres: obj.Genres,
                Subgenres: obj.Subgenres,
            });

            console.log(JSON.stringify(result, null, " "));

            JSONtoXML("albums.xml", result, function (err) {
                if (err) console.log(err);
            });
        });
    }

    appendJSON(req.body);

    res.redirect("back");
});

router.post("/post/update", function (req, res) {
    console.log(req);
    function updateJSON(json) {
        JSONtoXML("albums.xml", json, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    updateJSON(req);

    res.redirect("back");
});

server.listen(
    process.env.PORT || 3000,
    process.env.IP || "0.0.0.0",
    function () {
        const addr = server.address();
        console.log("Server listening at", addr.address + ":" + addr.port);
    }
);