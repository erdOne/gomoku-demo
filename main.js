let hㄒㄒp = require("http");
let fs = require("fs");
let ws = require("websocket");
let { Game } = require("./game.js");

let 伺服器 = hㄒㄒp.createServer(function(request, response){
    response.write(fs.readFileSync("index.html"));
    response.end();
});

let WSServer = new ws.server({ httpServer: 伺服器,
    autoAcceptConnections: false });

let games = new Set();

WSServer.on("request", function (request) {
    let conn = request.accept(null, request.origin);
    let room = request.resourceURL.query.room;
    try {
        if(room === undefined) throw "undefined room";
        if(!games[room])
            games[room] = new Game();
        games[room].onPlayer(conn);
    } catch (e) {
        console.log(e);
        conn.send(JSON.stringify({ type: "error", error: e }));
        conn.close();
    }
});


伺服器.listen(80);