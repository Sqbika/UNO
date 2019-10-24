//region Totally not stolen from stackoverflow. This time, literally
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };
//endregion

//TODO: Endgame
//TODO: +- play point movement
//TODO: Emelés + kezdés
//TODO: Pont div görgetés

var game;

class Game {
    players = [];
    name = today();

    constructor() {
        Util.setTitle(this.name);
    }

    load() {

    }

    player(id) {
        return this.players.find(e => e.getId == id);
    }

    updatePoints() {
        for (let player in this.players) { player.updateText(); }
    }

    get newId() {
        return this.players.length;
    }

    get asJson() {
        return {name: this.name, players: this.players};
    }

    addPlayer(player) {
        this.players.push(player);
    }

    start() {
        for (var i = 0; i < this.players.length; i++) {
            Util.setupPlayer(this.player(i));
        }
        getById('addPoints').insertAdjacentHTML("beforeEnd", `<input type="button" value="Add" class="addButton SPACE" onclick="addPoints()">`);
        getById('setupDiv').style.display = "none";
        getById('addPlayerDiv').style.display = "none";
    }
}

class Player {

    name;
    points = [];
    id;

    constructor(id, name) {
        this.name = name;
        this.id = id;
    }

    get getId() {
        return this.id;
    }

    get getName() {
        return this.name;
    }

    get sumDiv() {
        return getById('player' + this.id + '_point');
    }

    get pointsDiv() {
        return getById('player' + this.id + '_point_div');
    }

    get sumPoints() {
        return this.points.reduce((a,b) => a+b, 0);
    }

    get lastPoint() {
        return this.points[this.points.length-2];
    }

    addPoint(point) {
        this.points.push(Number(point));
    }

    updateText() {
        this.sumDiv.innerText = this.sumPoints;
    }

    updatePointDiv(point) {
        this.pointsDiv.insertAdjacentHTML("beforeEnd", Constants.pointDivString.formatUnicorn({point: point, sum: this.sumPoints, diff: point - this.lastPoint}))
    }
}

function pointInputKeyDown(input, ev) {
    ev.preventDefault();
    switch (ev.key) {
        case "Enter":
            if (input.parentElement.nextSibling != undefined) {
                if (input.parentElement.nextSibling.value == "Add") {
                    input.parentElement.parentElement.children[0].children[1].select();
                    input.parentElement.parentElement.children[0].children[1].focus();
                    addPoints();
                } else {
                    input.parentElement.nextSibling.children[1].select();
                    input.parentElement.nextSibling.children[1].focus();
                }
            }
            break;
        case "+":
            if (input.parentElement.nextElementSibling != undefined && input.parentElement.nextElementSibling.value != "Add") {
                input.parentElement.nextElementSibling.children[1].select();
                input.parentElement.nextElementSibling.children[1].focus();
            } else {
                input.parentElement.parentElement.firstElementChild.children[1].select();
                input.parentElement.parentElement.firstElementChild.children[1].focus();
            }
            break;
        case "-":
            if (input.parentElement.previousElementSibling != undefined) {
                input.parentElement.previousElementSibling.children[1].select();
                input.parentElement.previousElementSibling.children[1].focus();
            } else {
                var lastInputId = input.parentElement.parentElement.childElementCount -2;
                input.parentElement.parentElement.children[lastInputId].children[1].select();
                input.parentElement.parentElement.children[lastInputId].children[1].focus();
            }
            break;
    }
}

function addPlayer(event) {
    if (event) {
        if (event.keyCode !== 13) return;
    }
    var api = getById('addplayerinput');
    if (api.value != "") {
        game.addPlayer(new Player(game.newId, api.value));
        getById('playerList').innerHTML += `${api.value}<br/>`;
        api.value = "";
    }
}

function load() {
    if (document.cookie !== "") {
        game = JSON.parse(document.cookie.split(';')[0].split('=')[1]);
        game.load();
    } else {
        game = new Game();
    }
}

function toggleDarkmode() {
    var body = document.getElementsByTagName('body')[0];
    if (body.id == "darkmode") {
        body.id = "";
    } else {
        body.id = "darkmode";
    }
}

function getById(id) {
    return document.getElementById(id);
}

function today() {
    var a = new Date();
    return `${a.getFullYear()}_${a.getUTCMonth()+1}_${a.getDate()}_UNO`;
}

function showHide(elem) {
    var subContent = elem.parentElement.children[1];
    if (subContent.classList.contains("hideelement")) {
        subContent.classList.remove("hideelement");
        subContent.classList.add("showelement");
        $(subContent).animate({
            height: 'show',
            opacity: 1
        }, 500);
    } else {
        subContent.classList.add("hideelement");
        subContent.classList.remove("showelement");
        subContent.addEventListener("animationend", () => { hideElement(subContent) }, false); 
        $(subContent).animate({
            height: 'hide',
            opacity: 0
        }, 500);
    }
}

window.onbeforeunload = function(){
    return 'Are you sure you want to leave?';
};


function addPoints() {
    var points = getById('addPointDiv').children[1].children;
    for (var i = 0; i < points.length-1; i++) {
        if (points[i].children[1].value == "") return false;
    }
    for (var i = 0; i < points.length-1; i++) {
        var div2 = points[i].children[1];
        var point = Number(div2.value);
        game.player(i).addPoint(point);
        game.player(i).updatePointDiv(point);
        game.player(i).updateText();
        div2.value = "";
    }
    sort();
    //document.cookie = "game=" + JSON.stringify(game.asJson) + "; expires=" + new Date(7258122061000).toString();
}

function sort() {
    var order = game.players.sort((a,b) => a.points.reduce((a,b) => a+b, 0) - b.points.reduce((a,b) => a+b, 0)).map((e) => e.id);
    for (var i = 0; i < order.length; i++) {
        getById('player' + order[i] + "_point_div").style.order = i+1;
        getById('player' + order[i]).style.order = i + 1;
    }
}

let Util = {
    setTitle: (str) => getById('title').innerText = str,
    insertHeader: (player) => getById('header').insertAdjacentHTML("beforeEnd", Constants.headerString.formatUnicorn({playerName: player.getName, playerId: player.getId})),
    addPoints: (player) => getById('addPoints').insertAdjacentHTML("beforeEnd", Constants.addPointsString.formatUnicorn({playerName: player.getName, playerId: player.getId})),
    pointDiv: (player) => getById('pointDiv').insertAdjacentHTML("beforeEnd", Constants.pointsString.formatUnicorn({playerId: player.getId})),
    setupPlayer: player => {
        Util.insertHeader(player);
        Util.addPoints(player);
        Util.pointDiv(player);
    }
};

let Constants = {
    headerString: '<div class="flex_item green" id="player{playerId}"><div class="SPACE"><div>{playerName}</div></div><div class="blue SPACE"><div id="player{playerId}_point">0</div></div></div>',
    addPointsString: '<div class="col grayborder SPACE"><label for="player{playerId}">{playerName}:</label><input name="player{playerId}" id="{playerId}" type="number" class="point_input" onkeypress="pointInputKeyDown(this, event)"></div>',
    pointsString: '<div id="player{playerId}_point_div" class="flex_item SPACE"></div>',
     pointDivString: '<div class="sum_display grayborder ${point == 0? "red" : "green"}"><div class="diff_display numbers redborder">{diff}</div>{sum}<div class="point_display numbers yellowborder">{point}</div></div>'
}

