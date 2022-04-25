const http = require("http");
const fs = require("fs");
const os = require("os");
const host = "127.0.0.1";
const port = 5000;

const server = http.createServer((req, res) => {
  const urlPath = req.url;
  if (urlPath === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(__dirname + "/pages/index.html")
      .on("error", () => {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Oops! A Server error occured");
      })
      .pipe(res);
  } else if (urlPath === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(__dirname + "/pages/about.html")
      .on("error", () => {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Oops! A Server error occured");
      })
      .pipe(res);
  } else if (urlPath === "/sys") {
    try {
      res.writeHead(201, { "Content-Type": "text/plain" });
      const content = `{
      "hostname": ${JSON.stringify(os.hostname())},
      "platform": ${JSON.stringify(os.platform())},
      "architecture": ${JSON.stringify(os.arch())},
      "numberOfCPUS": ${JSON.stringify(os.cpus().length)},
      "networkInterfaces": ${JSON.stringify(os.networkInterfaces())},
      "uptime": ${JSON.stringify(os.uptime())}
    }`;
      fs.createWriteStream(__dirname + "/osinfo.json")
        .on("error", () => {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Oops! An error occured and os info was not saved");
        })
        .write(content);
      res.end("Your OS info has been saved successfully!");
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Oops! A Server error");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    fs.createReadStream(__dirname + "/pages/404.html")
      .on("error", () => {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Oops! A Server error occured");
      })
      .pipe(res);
  }
});

server.listen(port, host, () => {
  console.log(`Running at ${host}:${port}`);
});
