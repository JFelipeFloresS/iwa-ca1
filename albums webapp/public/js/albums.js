const express = require("express"), //Allows to respond to HTTP requests, defines routing and renders the required content
  fs = require("fs"), //Working with the file system (read and write files)
  http = require("http"), //HTTP Server
  path = require("path"), //Utility that allows us to work with directory paths
  xml2js = require("xml2js"), //This is XML <-> JSON converter
  xmlParse = require("xslt-processor").xmlParse, //Parsing XML
  xsltProcess = require("xslt-processor").xsltProcess; //Processing XSLT

const router = express(), //Instantiating Express
  server = http.createServer(router); //Instantiating the server

router.use(express.static(path.resolve(__dirname, "public"))); //Serving static content from "public" folder

router.get("/", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" }); //Tell the user that the resource exists and which type that is

  let xml = fs.readFileSync("../private/albums.xml", "utf8"), //read in the XML file
    xsl = fs.readFileSync("albums.xsl", "utf8"); //read in the XSL file

  console.log(xml);
  console.log(xsl);

  let doc = xmlParse(xml), //Parse the XML file
    stylesheet = xmlParse(xsl); //Parse the XSL file

  let result = xsltProcess(doc, stylesheet); //Performing XSLT

  console.log(result);

  res.end(result.toString()); //Serve back the user
});

server.listen(
  process.env.PORT || 3000,
  process.env.IP || "0.0.0.0",
  function () {
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
  }
);
