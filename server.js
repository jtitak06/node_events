// Complete Events Exercise
const { createServer } = require("http")
const { EventEmitter } = require("events");
const { appendFile } = require("fs");

const newsletter = new EventEmitter();

const port = 3001;

newsletter.on("signup", (entry) => {
    appendFile("./contacts.csv", entry, (err) => {
        if (err) console.log(err);
    })
})

createServer((request, response) => {
    let chunks = [];
    request.on("data", (chunk) => {
        chunks.push(chunk);
    }).on("end", () => {
        let { url, method } = request;
            if (url === "/newsletter" && method === "POST") {
                let reqBody = JSON.parse(Buffer.concat(chunks).toString());
                newsletter.emit("signup", `${reqBody.name},${reqBody.email}\n`)
                response.writeHead(200, { "Content-Type": "text/html"});
                response.write("<h1>Successful Signup!</h1>");
                response.end();
            } else {
                response.writeHead(404, { "Content-Type": "text/html"});
                response.write("<h1>404 Not Found</h1>");
                response.end();
            }
    })
}).listen(port, () => console.log("Server running on port " + port));