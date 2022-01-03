const size = 19;
const len = 5;

class Game {
    gameboard = [];
    currentPlayer = 1;
    ended = true;
    player1;
    player2;
    inited = false;
    sendBoards() {
        console.log("send");
        if(this.player1)
            this.player1.send(JSON.stringify({ type: "board", data: this.gameboard }));
        if(this.player2)
            this.player2.send(JSON.stringify({ type: "board", data: this.gameboard }));
    }
    init() {
        if(this.inited) return;
        this.inited = true;
        console.log("init", this.player1.name, this.player2.name)
        this.gameboard = []
        this.ended = false;
        for(let i = 0; i < size; i=i+1){
            this.gameboard.push([]);
            for (let j = 1; j <= size; j = j + 1){
                this.gameboard[i].push(0);
            }
        }
        this.sendBoards();
        this.player1.send(JSON.stringify({ type: "info",
            data: { opponentName: this.player2.name, order: 1 }}));
        this.player2.send(JSON.stringify({ type: "info",
            data: { opponentName: this.player1.name, order: 2 }}));
    }
    move(i, j, who) {
        
        let gameboard = this.gameboard;
        let currentPlayer = this.currentPlayer;

        console.log(i, j, who);
        if(gameboard[i-1][j-1] !=0) return;
        if(who != currentPlayer) return;
        gameboard[i-1][j-1] = currentPlayer;
        this.sendBoards();
        
        for(let i = 0;i<size; i=i+1){
        for(let j = 0;j<=size-len; j=j+1){ 
            let isaline = true;
            for(let l = 0; l < len; l=l+1){
                if(gameboard[i][j+l]!=currentPlayer)
                isaline = false;
            }
            if(isaline){
                return win(who);
            }
        }}         
        for(let j = 0;j<=size-len; j=j+1){
        for(let i = 0;i<size; i=i+1){ 
            let isaline = true;
            for(let l = 0; l < len; l=l+1){
                if(gameboard[j+l][i]!=currentPlayer)
                isaline = false;
            }
            if(isaline){
                return win(who);
            }}}
            for(let j = 0;j<=size-len; j=j+1){
        for(let i = 0;i<=size-len; i=i+1){ 
            let isaline = true;
            for(let l = 0; l < len; l=l+1){
                if(gameboard[j+l][i+l]!=currentPlayer)
                isaline = false;
            }
            if(isaline){
                return win(who);
            }}}
        for(let i = 0;i<=size-len; i=i+1){
        for(let j = 0;j<=size-len; j=j+1){ 
            let isaline = true;
            for(let l = 0; l < len; l=l+1){
                if(gameboard[i+l][j-l]!=currentPlayer)
                isaline = false;
            }
            if(isaline){
                return win(who);
            }}}
        this.currentPlayer = 3 - currentPlayer;
    }
    

    onPlayer (conn) {
        if (this.player1 === undefined) {
            this.player1 = conn;
        } else if (this.player2 === undefined) {
            this.player2 = conn;
        } else throw "room full";

        conn.on("message", (msg) => {
            let data = JSON.parse(msg.utf8Data);
            console.log(data);
            if(conn === this.player1) {
                if(data.type === "move") {
                    this.move(data.data[0], data.data[1], 1);
                }
            }
            if(conn === this.player2) {
                if(data.type === "move") {
                    this.move(data.data[0], data.data[1], 2);
                }
            }
            if(data.type === "name") {
                conn.name = data.name;
                if(this.player1 && this.player2 && this.player1.name && this.player2.name)
                    this.init();
            }
        });
    }
}

exports.Game = Game