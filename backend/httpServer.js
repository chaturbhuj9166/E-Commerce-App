import data from "./data.js";
import http from "http";

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(data))
    }
    else if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk
        })

        req.on("end", () => {
            data.push(JSON.parse(body))
            res.writeHead(201, { "Content-Type": "application/json" })
            res.end(JSON.stringify(data))
        })
    }

    else if (req.method === "PUT") {
        const idtoEdit = Number(req.url.split("/")[1])
        let body = ""
        req.on("data", (chunk) => {
            body += chunk
        })
        req.on("end", () => {
            let updatedata = data.map((obj) => (obj.id === idtoEdit ? JSON.parse(body) : obj))
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(updatedata))
        })
    }

    else if (req.method === "DELETE") {
        const idToDelete = Number(req.url.split("/")[1])
        const updatedata = data.filter((obj) => obj.id !== idToDelete)
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify(updatedata))
    }


})

server.listen(3000, () => console.log("server started at port 3000"))