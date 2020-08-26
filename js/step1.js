
let mapSquares = new Array();
let mapSize = 90;
const gameBoardMap = $("#game-board-map");
/* 
GAME MAP OR BOARD AND ITS RELATED
*/

/* 
create the GameMap class and a static method to generate the board/map

*/
class GameMap{

    constructor(){
        this.mapBoardSize = mapSize;
        this.mapObstacles = function(eachPlayer){
            addItem(eachPlayer)
        };
        // alert(this.mapBoardSize);
    }
   
    static generateGameMap(){
        
        // using a for loop to generate the board using dynamic html li elements
        for (let i = 1; i <= mapSize; i++) {
            // console.log('num :: ' + i);
            gameBoardMap.append(`<div class="map-box" mapBoxId="${i}">${i}</div>`);
            
            let numbOfSquares = $('.map-box').length;
            mapSquares.push(numbOfSquares);
        }

    }
}

// create a new object of GameMap
let gameMap = new GameMap();

/* 
THE PLAYER CLASS
 */
class Player {

    constructor(playrName, playrScore, playrAlsoKnownAs, playrUniqNumber, playrWeapon, palyrDamage){
        this.playrName = playrName;
        this.playrScore = playrScore;
        this.playrAlsoKnownAs = playrAlsoKnownAs;
        this.playrUniqNumber = playrUniqNumber;
        this.playrWeapon = playrWeapon;
        this.palyrDamage = palyrDamage;
        this.addPlayer = function(){
            addItem(this.playrAlsoKnownAs, this.playrUniqNumber);
        }
    }

}

class PlayerState {

    constructor(activeState, inactiveState, attackState, winState, deadState){
        this.activeState = activeState;
        this.inactiveState = inactiveState;
        this.attackState = attackState;
        this.winState = winState;
        this.deadState = deadState;
    }
}

let defaultScore = 100;
let playerName = [ 'Simba', 'Mufasa'];
let playerAkA = [ 'player1', 'player2'];
let playerUniqNo = [ 1, 2 ];
let defaultWeapon = '';
let defaultDamage = null;

// create the players by create an instance of its class first
let player_1 = new Player(playerName[0], defaultScore[0], playerAkA[0], playerUniqNo[0], defaultWeapon, defaultDamage);
let player_2 = new Player(playerName[1], defaultScore[1], playerAkA[1], playerUniqNo[1], defaultWeapon, defaultDamage);

// set player default state
let setPlayer1State = new PlayerState('images/simba.png');
let setPlayer2State = new PlayerState('images/mufasa.png');

// create the boxes/squares
function setPlayerGamingInfo(playerDiv, player, weapon) {
    $(`${playerDiv} .player-name`).text(player.playrName);
    $(`${playerDiv} .player-score`).text(player.playrScore);
    $(`${playerDiv} .magic-box`).removeClass().addClass(`magic-box ${player.playrWeapon}`);
    $(`${playerDiv} .player-weapon-value`).text(player.palyrDamage);
}

$(document).ready(function(){
    GameMap.generateGameMap();
    
})