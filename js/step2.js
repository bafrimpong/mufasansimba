
let mapSquaresArray = []; //new Array();
const gameObstacleCount = 10;
let mapSize = 89;
let isMufasaActivePlayer = true;// since Mufasa will first play
let activePlayer; //current active player
let inactivePlayer; // current inactive player
let activePlayerDiv; // current active palyer div element
let inactivePlayerDiv; // current inactive player div element
let isPlayerActiveToMove = true;
let isPlayerAttacked = false;
let maximumMoves = 3;
let newXYPos;
let oldXYPos;
let playerPosition;
let isBoxHovered = false;
const gameBoardMap = $("#game-board-map");
const gameWeaponGunClass = 'game-weapon-gun';
const gameWeaponBowClass = 'game-weapon-bow';
const gameWeaponCutlassClass = 'game-weapon-cutlass';
const gameWeaponAxeClass = 'game-weapon-axe';
const gameWeaponClass = 'game-weapon';
const gameWeaponLifeClass = 'game-weapon-life';
const treasureBoxClass = "game-weapon-fake";
let defaultScore = 100;
const playerName = ['Mufasa', 'Scar'];
const playerHtmlClass = ['player-mufasa', 'player-scar'];
let playerUniqNo = [1, 2];
let defaultDamage = 0;

class Game {

    constructor() {
        this.mapBoardSize = mapSize;
        this.obstacleHtmlClass = 'game-obstacles';
    }

    // a private method to generate a random number
    #generateRandomNumber = function (number) {
        return Math.floor(Math.random() * number);
    }

    // this method starts or load the game
    startLoadingGame() {
        this.#createGameMap();

        // set obstacles
        for (let i = 0; i < gameObstacleCount; i++) {
            this.addObstaclesToGameMap(this.obstacleHtmlClass);
        }
    }

    endGameOver(activePlayerDiv, inactivePlayerDiv, activePlayer, inactivePlayer) {
        $(inactivePlayerDiv + ' .game-score').text('0');
        $(activePlayer + ' .message').text('Winner!');
        $(inactivePlayerDiv + ' .message').text('Looser');
        $(inactivePlayerDiv + ' .attack').hide();
        $(inactivePlayerDiv + ' .defend').hide();
        $('.map-box').remove();

    }

    addObstaclesToGameMap() {
        this.addItemToGameMap(this.obstacleHtmlClass);
    }

    /**
     * Generates or creates the grid for the game
     */
    #createGameMap = function () {
        // using a for loop to generate the board using dynamic html li elements
        for (let i = 0; i <= mapSize; i += 1) {
            gameBoardMap.append(
                `<div class="pre-map-box" id='pre-map-box${i}'>
                    <div class="map-box" mapboxid="${i}"></div>
                </div>`
            );

            let numbOfSquares = $('.map-box').length;
            mapSquaresArray.push(numbOfSquares);
        }
    }


    /**
     * A generic method which adds an item to the game board based on the parameters
     * passed to it. e.g. can be adding a player, obstacle, etc.
     * @param {*} htmlClass 
     * @param {*} uniqPlayerNumber 
    */
    addItemToGameMap(htmlClass, uniqPlayerNumber) {

        let map_Square = mapSquaresArray;
        let map_box_class = $('.map-box');
        let mapBoxIsEmpty = true;

        while (mapBoxIsEmpty) {
            let randomNumber = this.#generateRandomNumber(this.mapBoardSize);
            let isPositionFound;

            if (uniqPlayerNumber === 1) {
                isPositionFound = (randomNumber % 10 === 0);
            } else if (uniqPlayerNumber === 2) {
                isPositionFound = (randomNumber % 10 === 9);
            } else {
                isPositionFound = (randomNumber % 10 !== 0 && randomNumber % 10 !== 9);
            }

            if ((isPositionFound) && map_Square.includes(randomNumber)) {
                map_box_class.eq(randomNumber).addClass(htmlClass);

                let index = map_Square.indexOf(randomNumber);
                map_Square.splice(index, 1);
                mapBoxIsEmpty = false;
            }
        }
    }


    /**
     * Sets a current active player and returns the results
     */
    #setActivePlayer = function (activePlayerObject, inactivePlayerObject, activePlayerObjectDiv, inactivePlayerObjectDiv, activeState, inactiveState) {
        activePlayer = activePlayerObject;
        inactivePlayer = inactivePlayerObject;
        activePlayerDiv = activePlayerObjectDiv;
        inactivePlayerDiv = inactivePlayerObjectDiv;

        $(`${inactivePlayerObjectDiv} .player-state`).css('backgroundImage', +'url('+ activeState + ')');
        $(`${activePlayerObjectDiv} .player-state`).css('backgroundImage', +'url('+ inactiveState + ')');
    }

    /**
     * Checks and set a new active player
    */
    checkActivePlayer() {
        if (isMufasaActivePlayer) {
            this.#setActivePlayer(playerMufasa, playerScar, '#player-mufasa', '#player-scar', playerScar.playerActiveStateImage, playerMufasa.playerInactiveStateImage);
        } else {
            this.#setActivePlayer(playerScar, playerMufasa, '#player-scar', '#player-mufasa', playerMufasa.playerActiveStateImage, playerScar.playerInactiveStateImage);
        }
    }

    showMessage(activePlayerDiv, inactivePlayerDiv) {
        $(inactivePlayerDiv + ' .message').text(playerActive.name + ' just hit you  - ' + playerActive.damageValue + ' points');
        $(activePlayerDiv + ' .message').text('You just attacked');
    }

    changeScore(inactivePlayerDiv, activePlayer, inactivePlayer) {
        if (hasDefended) {
            inactivePlayer.gameScore -= 10 - activePlayer.damage * 0.5;
            hasDefended = false;
        } else {
            inactivePlayer.score -= 10 - activePlayer.damage;
        }

        $(inactivePlayerDiv + ' .player-score').text(inactivePlayer.gameScore);
    }

    playerAttacksAndDefends(activePlayerDiv, inactivePlayerDiv) {
        $(inactivePlayerDiv + ' .player-attacks').show();
        $(inactivePlayerDiv + ' .player-defends').show();
        $(activePlayerDiv + ' .player-attacks').hide();
        $(activePlayerDiv + ' .player-defends').hide();
        $(' .message1').hide();
        $(' .message2').hide();
    }

    playerOnlyAttacks(activePlayerDiv, inactivePlayerDiv) {
        $(inactivePlayerDiv + ' .attack').show();
        $(activePlayerDiv + ' .attack').show();
        $(inactivePlayerDiv + ' .defend').hide();
        $(activePlayerDiv + ' .defend').hide();
    }


    flipImage(htmlClass) {
        htmlClass.addClass('flip-image');
    }

}

/* 
WEAPON
*/
class Weapon {

    static #weaponsBoxImagePath = "./images/weapons/treasures/"
    static #weaponsImagePath = "./images/weapons/"

    constructor(weaponType, weaponValue, htmlClass, weaponImage, boxImage) {
        this.weaponType = weaponType;
        this.weaponValue = weaponValue;
        this.htmlClass = htmlClass;
        this.weaponImage = weaponImage;
        this.weaponBoxImage = boxImage;
    }

    addWeaponToGameMap() {
        game.addItemToGameMap(this.htmlClass);
    }

    /**
     * Sets a div element to the new weapon damage value/level for the current player
     * when it changes (clicks on a new) weapon.
     * @param {string} playerDiv 
     * @param {object} activePlayer 
     * @param {object} weapon 
    */
    changeWeaponValue(playerDiv, activePlayer, weapon) {
        activePlayer.damageValue = weapon.weaponValue;
        $(`${playerDiv} .weapon-weight`).text(activePlayer.damageValue);
    }

    removePlayerWeapon(activePlayerDiv, activePlayer) {
        console.log(`Remove default weaponClass '.${treasureBoxClass}'`);
        console.log(`Add current weaponClass '${activePlayer.currentWeapon}'`);

        $(`${activePlayerDiv} .${treasureBoxClass}` ).removeClass(activePlayer.currentWeapon);
    }

    addPlayerWeapon(activePlayerDiv, activePlayer) {
        $(`${activePlayerDiv} .${treasureBoxClass}`).addClass(activePlayer.currentWeapon);
    }

    /**
    * Sets a new weapon for the active player
    * @param {number} mapBoxIDvalue 
    * @param {string} treasureBoxClass 
    * @param {string} weaponType 
   */
    changeWeapon(mapBoxIDvalue, treasureBoxClass, typeOfWeapon) {

        let mapBox = $('.map-box[mapboxID = ' + mapBoxIDvalue + ']'); // $(`.map-box[mapboxID = '${weaponValue}']`);

        game.checkActivePlayer();

        // remove the weapon class from the box which is clicked and add the 
        // active player's class
        mapBox.removeClass(treasureBoxClass).addClass(activePlayer.htmlClass);

        this.removePlayerWeapon(activePlayerDiv, activePlayer);

        activePlayer.currentWeapon = treasureBoxClass;

        this.addPlayerWeapon(activePlayerDiv, activePlayer);
        this.changeWeaponValue(activePlayerDiv, activePlayer, typeOfWeapon)
    }

    extraPoints(activePlayer, activePlayerDiv, boxItem, htmlClass, isGained, text1, text2) {
        if (isGained) {
            activePlayer.playerScore += boxItem.value;
        } else {
            activePlayer.playerScore -= boxItem.value;
        }

        $(`${activePlayerDiv} '.player-score'`).text(activePlayer.playerScore);
        $(`.${htmlClass}`).removeClass(`${htmlClass} ${gameWeaponClass}`);
        $(`${activePlayerDiv} .message`).text(`${text1} ${text2} ${boxItem.value}`);
    }

    checkWeapon(mapBoxIDvalue) {

        let mapBox = $('.map-box[mapboxID = ' + mapBoxIDvalue + ']'); //$(`.map-box[mapboxid = '${mapBoxSquareValue}']`);

        if (mapBox.hasClass(`${gameWeaponClass}`)) {

            // check for weapon if it is a gun
            if (mapBox.hasClass(`${gameWeaponGunClass}`)) {
                this.changeWeapon(mapBoxIDvalue, gunWeaponBox.htmlClass, gunWeaponBox);
                return;
            }

            // check for a weapon if it is a bow
            if (mapBox.hasClass(`${gameWeaponBowClass}`)) {
                this.changeWeapon(mapBoxIDvalue, bowWeaponBox.htmlClass, bowWeaponBox);
                return;
            }

            // check for a weapon if it is a cutlass
            if (mapBox.hasClass(`${gameWeaponCutlassClass}`)) {
                this.changeWeapon(mapBoxIDvalue, cutlassWeaponBox.htmlClass, cutlassWeaponBox);
                return;
            }

            // check for a weapon if it is an axe
            if (mapBox.hasClass(`${gameWeaponAxeClass}`)) {
                this.changeWeapon(mapBoxIDvalue, axeWeaponBox.htmlClass, axeWeaponBox);
                return;
            }

            // check for a weapon if it is a life
            if (mapBox.hasClass(`${gameWeaponLifeClass}`)) {
                this.changeWeapon(mapBoxIDvalue, lifeWeaponBox.htmlClass, lifeWeaponBox);
                return;
            }
        }
    }

    // an object for all the weapon definitions
    static weaponBoxDefinition = {
        gun: {
            name: "Gun",
            value: 55,
            class: `${gameWeaponClass} ${gameWeaponGunClass}`,
            boxImage: `${this.#weaponsBoxImagePath}gun-box-x120.png`,
            weaponImage: `${this.#weaponsImagePath}gun-x120.png`
        },
        cutlass: {
            name: "Sword",
            value: 45,
            class: `${gameWeaponClass} ${gameWeaponCutlassClass}`,
            boxImage: `${this.#weaponsBoxImagePath}cutlass-box-x120.png`,
            weaponImage: `${this.#weaponsImagePath}cutlass-x120.png`
        },
        bow: {
            name: "Bow",
            value: 35,
            class: `${gameWeaponClass} ${gameWeaponBowClass}`,
            boxImage: `${this.#weaponsBoxImagePath}bow-box-x120.png`,
            weaponImage: `${this.#weaponsImagePath}bow-x120.png`
        },
        axe: {
            name: "Axe",
            value: 35,
            class: `${gameWeaponClass} ${gameWeaponAxeClass}`,
            boxImage: `${this.#weaponsBoxImagePath}axe-box-x120.png`,
            weaponImage: `${this.#weaponsImagePath}axe-x120.png`
        },
        life: {
            name: "Life",
            value: 70,
            class: `${gameWeaponClass} ${gameWeaponLifeClass}`,
            boxImage: `${this.#weaponsBoxImagePath}life-box-x120.png`,
            weaponImage: `${this.#weaponsImagePath}life-x120.png`
        }
    }



}


// create new weapon object for all the 4 weapons inside a box
let gunWeaponBox = new Weapon(Weapon.weaponBoxDefinition.gun.name, Weapon.weaponBoxDefinition.gun.value,
    Weapon.weaponBoxDefinition.gun.class, Weapon.weaponBoxDefinition.gun.weaponImage, Weapon.weaponBoxDefinition.gun.boxImage);

let cutlassWeaponBox = new Weapon(Weapon.weaponBoxDefinition.cutlass.name, Weapon.weaponBoxDefinition.cutlass.value,
    Weapon.weaponBoxDefinition.cutlass.class, Weapon.weaponBoxDefinition.cutlass.weaponImage, Weapon.weaponBoxDefinition.cutlass.boxImage);

let bowWeaponBox = new Weapon(Weapon.weaponBoxDefinition.bow.name, Weapon.weaponBoxDefinition.bow.value,
    Weapon.weaponBoxDefinition.bow.class, Weapon.weaponBoxDefinition.bow.weaponImage, Weapon.weaponBoxDefinition.bow.boxImage);

let axeWeaponBox = new Weapon(Weapon.weaponBoxDefinition.axe.name, Weapon.weaponBoxDefinition.axe.value,
    Weapon.weaponBoxDefinition.axe.class, Weapon.weaponBoxDefinition.axe.weaponImage, Weapon.weaponBoxDefinition.axe.boxImage);

let lifeWeaponBox = new Weapon(Weapon.weaponBoxDefinition.life.name, Weapon.weaponBoxDefinition.life.value,
    Weapon.weaponBoxDefinition.life.class, Weapon.weaponBoxDefinition.life.weaponImage, Weapon.weaponBoxDefinition.life.boxImage);


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ******************************++++++++++++++++++++*************************
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// create a new object of Game
let game = new Game();

/**
 * Returns the X and Y values when a player's position is determined by converting the XY values to square
 * @param {*} define_map_square 
 */
function getXYPosition(define_map_square) {
    return {
        x: (define_map_square) % 10,
        y: Math.floor(define_map_square / 10)
    }
}

/**
* Returns the active playter position on the X n Y axis and returns it
* aka getPosition()
*/
const getPosition = (htmlClass) => {
    return $(htmlClass).attr('mapboxid');
};

// playerPosition = getPosition('.player-mufasa');

// get the xy positions of the default active player - Mufasa
// let oldXYPos = getXYPosition(playerPosition);

/**
 * Returns the x and y axis values of particular game box
 * @param {*} xPosValue 
 * @param {*} yPosValue 
 * aka getSquareVlaue()
 */
function getMapBoxSquareValue(xPosValue, yPosValue) {
    return yPosValue * 10 + xPosValue;
}
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ******************************++++++++++++++++++++*************************
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



/* 
THE PLAYER CLASS AND OTHERS
 */
class Player {

    #playerStates = ['active', 'inactive', 'attack', 'win', 'dead']
    // playrName, playrScore, htmlClass, uniqPlayerNumber, playrWeapon, palyrDamage

    constructor() {
        this.name; //= playrName;
        this.scoreValue; // = playrScore;
        this.htmlClass; // = htmlClass;
        this.uniqNumber; // = uniqPlayerNumber;
        this.currentWeapon = ""; // = playrWeapon;
        this.damageValue; // = palyrDamage;
        this.activeState = this.#playerStates[0];
        this.inactiveState = this.#playerStates[1];
        this.attackState = this.#playerStates[2];
        this.winState = this.#playerStates[3];
        this.deadState = this.#playerStates[4];
    }

    //#region "GETTERS AND SETTERS FOR playerActiveStateImage property"
    set playerActiveStateImage(value) {
        this._activeStateImage = value;
    }

    get playerActiveStateImage() {
        return this._activeStateImage;
    }

    set playerInactiveStateImage(value) {
        this._playerInactiveStateImage = value;
    }

    get playerInactiveStateImage() {
        return this._playerInactiveStateImage;
    }
    //#endregion

    /**
     * Adds a player to the game map board by calling another internal method or function
     * based on the parsed parameters
     * @param {string} htmlClass 
     * @param {string} uniqNumber 
     */
    addPlayer(htmlClass, uniqNumber) {
        game.addItemToGameMap(htmlClass, uniqNumber);
    }


    /**
     * Activates the player to move, fight, attack, defend etc
     */
    startPlayerActions() {

        let _applyCSS = (backgroundImage) => ({
            'background-image': 'url(' + backgroundImage + ')',
            'z-index': '100',
            // 'dosition': 'relative',
            'min-height': '75px',
            'max-height': '75px',
            'background-size': 'contain',
            'margin': 'auto',
            'cursor': 'pointer'
        })

        //mouseover the squares
        let boxClass = $('.map-box');

        boxClass.hover(function () {

            isBoxHovered = true;
            let boxHovered = $(this).attr('mapboxID');
            newXYPos = getXYPosition(boxHovered);

            //The squares in the board will be based of x and y values.
            //from x to x
            for (let i = Math.min(oldXYPos.x, newXYPos.x); i <= Math.max(oldXYPos.x, newXYPos.x); i++) {
                let boxIDValue = getMapBoxSquareValue(i, oldXYPos.y);
                let mapSquare = $('.map-box[mapboxID = ' + boxIDValue + ']');

                if (mapSquare.hasClass('game-obstacles')) {
                    return;
                }
                if (isMufasaActivePlayer) {
                    if (mapSquare.hasClass('player-scar')) {
                        return;
                    }
                } else {
                    if (mapSquare.hasClass('player-mufasa')) {
                        return;
                    }
                }

            }

            //from y to y
            for (let i = Math.min(oldXYPos.y, newXYPos.y); i <= Math.max(oldXYPos.y, newXYPos.y); i++) {
                let boxIDValue = getMapBoxSquareValue(oldXYPos.x, i);
                let mapSquare = $('.map-box[mapboxID = ' + boxIDValue + ']');
                if (mapSquare.hasClass('game-obstacles')) {
                    return;
                }
                if (isMufasaActivePlayer) {
                    if (mapSquare.hasClass('player-scar')) {
                        return;
                    }
                } else {
                    if (mapSquare.hasClass('player-mufasa')) {
                        return;
                    }
                }
            }

            //if attacked
            if (!isPlayerAttacked) {

                if (newXYPos.y === oldXYPos.y && newXYPos.x <= oldXYPos.x + maximumMoves && newXYPos.x >= oldXYPos.x - maximumMoves
                    || newXYPos.x === oldXYPos.x && newXYPos.y <= oldXYPos.y + maximumMoves && newXYPos.y >= oldXYPos.y - maximumMoves) {

                    if (isMufasaActivePlayer) {
                        $(this).css(_applyCSS(playerMufasa.playerActiveStateImage))

                    } else {
                        $(this).css(_applyCSS(playerScar.playerActiveStateImage))
                    }
                }
            }

        },

            // hide character's extra on mouseover
            function () {
                isBoxHovered = false;
                $(this).css('backgroundImage', '');
            }
        );

        // onClick event of the map-box class
        boxClass.on('click', function () {

            isBoxHovered = false;
            let boxClicked = $(this).attr('mapboxID');
            newXYPos = getXYPosition(boxClicked);


            //The squares in the board will be based of x and y values.
            //from x to x
            for (let i = Math.min(oldXYPos.x, newXYPos.x); i <= Math.max(oldXYPos.x, newXYPos.x); i++) {

                let boxIDValue = getMapBoxSquareValue(i, oldXYPos.y);
                let mapSquare = $('.map-box[mapboxID = ' + boxIDValue + ']');

                if (mapSquare.hasClass('game-obstacles')) {
                    // alertMessage(alertMove);
                    return;
                }
                if (isMufasaActivePlayer) {
                    if (mapSquare.hasClass('player-scar')) {
                        // alertMessage(alertPlayer);
                        return;
                    }
                } else {
                    if (mapSquare.hasClass('player-mufasa')) {
                        // alertMessage(alertPlayer);
                        return;
                    }
                }
            }

            //from y to y
            for (let i = Math.min(oldXYPos.y, newXYPos.y); i <= Math.max(oldXYPos.y, newXYPos.y); i++) {

                let boxIDValue = getMapBoxSquareValue(oldXYPos.x, i);
                let mapSquare = $('.map-box[mapboxID = ' + boxIDValue + ']');

                if (mapSquare.hasClass('game-obstacles')) {
                    // alertMessage(alertMove);
                    return;
                }

                if (isMufasaActivePlayer) {
                    if (mapSquare.hasClass('player-scar')) {
                        // alertMessage(alertPlayer);
                        return;
                    }
                } else {
                    if (mapSquare.hasClass('player-mufasa')) {
                        // alertMessage(alertPlayer);
                        return;
                    }
                }
            }

            // alert players to move
            if (isMufasaActivePlayer) {
                if ($(this).hasClass('player-mufasa')) {
                    // alertMessage(alertMustMove);
                    return;
                }
            } else {
                if ($(this).hasClass('player-scar')) {
                    // alertMessage(alertMustMove);
                    return;
                }
            }

            // move only the active player and generate message to let know active player it is their turn
            if (isPlayerActiveToMove) {

                let weapon = new Weapon('');

                if (newXYPos.y === oldXYPos.y && newXYPos.x <= oldXYPos.x + maximumMoves && newXYPos.x >= oldXYPos.x - maximumMoves
                    || newXYPos.x === oldXYPos.x && newXYPos.y <= oldXYPos.y + maximumMoves && newXYPos.y >= oldXYPos.y - maximumMoves) {

                    for (let i = Math.min(oldXYPos.x, newXYPos.x); i <= Math.max(oldXYPos.x, newXYPos.x); i++) {
                        let boxIDValue = getMapBoxSquareValue(i, oldXYPos.y);
                        weapon.checkWeapon(boxIDValue);
                    }
                    for (let i = Math.min(oldXYPos.y, newXYPos.y); i <= Math.max(oldXYPos.y, newXYPos.y); i++) {
                        let boxIDValue = getMapBoxSquareValue(oldXYPos.x, i);
                        weapon.checkWeapon(boxIDValue);
                    }

                    game.checkActivePlayer();

                    if (isMufasaActivePlayer) {

                        playerPosition = getPosition('.player-scar');
                        oldXYPos = getXYPosition(playerPosition);

                        $('.player-mufasa').removeClass('player-mufasa').removeClass('active-player');
                        $(this).addClass("player-mufasa");
                        $('.player-scar').addClass('active-player');

                        player.fight(newXYPos, oldXYPos);

                        isMufasaActivePlayer = false;

                        $(' .message1').text('Mufasa, it is your turn!');
                        $(' .message2').text('Scar, it is your turn!');
                        $(' .message1').hide();
                        $(' .message2').show();
                    }
                    else {

                        playerPosition = getPosition('.player-mufasa');
                        oldXYPos = getXYPosition(playerPosition);

                        $('.player-scar').removeClass('player-scar').removeClass('active-player');
                        $(this).addClass("player-scar");
                        $('.player-mufasa').addClass('active-player');

                        player.fight(newXYPos, oldXYPos);

                        isMufasaActivePlayer = true;

                        $(' .message1').text('Mufasa, it is your turn!');
                        $(' .message2').text('Scar, it is your turn!');
                        $(' .message1').show();
                        $(' .message2').hide();
                    }
                }
            }
        });


    }


    fight(newXYPos, oldXYPos) {
        if (newXYPos.y === oldXYPos.y && newXYPos.x <= oldXYPos.x + 1 && newXYPos.x >= oldXYPos.x - 1 ||
            newXYPos.x === oldXYPos.x && newXYPos.y <= oldXYPos.y + 1 && newXYPos.y >= oldXYPos.y - 1) {

            isPlayerActiveToMove = false;
            isBoxHovered = false;

            $('.life-weapon').css('cursor', 'not-allowed');
            $(this).css('backgroundImage', '');

            for (let i = Math.min(oldXYPos.x, newXYPos.x); i <= Math.max(oldXYPos.x, newXYPos.x); i++) {

                let mapBoxValue = getMapBoxSquareValue(i, oldXYPos.y);
                let mapBox = $(`.map-box[mapboxid = '${mapBoxValue}']`);

                if (isMufasaActivePlayer) {

                    if (mapBox.hasClass('player-scar')) {

                        let mufasaMapBox = $('.player-mufasa');

                        if ($('.player-scar').attr('mapboxID') < mufasaMapBox.attr('mapboxID')) {

                            flipImage(mapBox);
                            flipImage(mufasaMapBox);
                        }

                        isPlayerAttacked = true;
                        playerattacks(newXYPos, oldXYPos);

                        return;
                    }

                } else {

                    if (mapBox.hasClass('player-mufasa')) {

                        let scarMapBoxSquare = $('.player-scar');

                        if ($('.player-mufasa').attr('mapboxID') < scarMapBoxSquare.attr('mapboxID')) {

                            flipImage(mapBox);
                            flipImage(scarMapBoxSquare);
                        }
                    }

                }
            }
        }
    }

    attack() {
        if (isPlayerAttacked) {

            game.checkActivePlayer();

            changeScore(playerNotActiveDiv, playerActive, playerNotActive);
            canAttackAndDefend(playerActiveDiv, playerNotActiveDiv);
            messagePlayer(playerActiveDiv, playerNotActiveDiv, playerActive, playerNotActive);

            if (isMufasaActivePlayer) {
                activeClass('.player-mufasa', '.player-scar');
                player1Defended = false;
                isMufasaActivePlayer = false;
            } else {
                activeClass('.player-scar', '.player-mufasa');
                player2Defended = true;
                isMufasaActivePlayer = true;
            }

            if (playerNotActive.score <= 0) {
                gameOver(playerActiveDiv, playerNotActiveDiv, playerActive, playerNotActive);
            }
        }
    }

    setActiveClass(activePlayerClass, inactivePlayerClass) {
        $(inactivePlayerClass).removeClass('player-active');
        $(activePlayerClass).removeClass('player-attack');
        $(inactivePlayerClass).removeClass('player-attack');
    }

    defend() {
        defended = true;
        game.checkActivePlayer();

        if (isMufasaActivePlayer) {
            activeClass('.player-mufasa', '.player-scar');
            player1Defended = true;
            isMufasaActivePlayer = false;
        } else {
            activeClass('.player-scar', '.player-mufasa');
            player2Defended = true;
            isMufasaActivePlayer = true;
        }

        if (player1Defended && player2Defended) {
            canOnlyAttack(activePlayerDiv, inactivePlayerDiv)
        } else {
            canOnlyAttackAndDefend(activePlayerDiv, inactivePlayerDiv)
        }

        $(activePlayerDiv + '.message').text('you just defended');
    }

}

function attackNow() {
    player.attack(newXYPos, oldXYPos);
    isPlayerAttacked = true;
}

function defendNow() {
    player.defend(newXYPos, oldXYPos);
    isPlayerDefended = true;
}

// create a generic player object
let player = new Player();

// create the 1st player object - Mufasa
let playerMufasa = new Player();
playerMufasa.name = playerName[0];
playerMufasa.scoreValue = defaultScore;
playerMufasa.htmlClass = playerHtmlClass[0];
playerMufasa.uniqNumber = playerUniqNo[0];
playerMufasa.damageValue = defaultDamage;
playerMufasa.playerActiveStateImage = './images/players/mufasa-move-x120.png';

// create the 2nd player object - Scar
let playerScar = new Player();
playerScar.name = playerName[1];
playerScar.scoreValue = defaultScore;
playerScar.htmlClass = playerHtmlClass[1];
playerScar.uniqNumber = playerUniqNo[1];
playerScar.damageValue = defaultDamage;
playerScar.playerActiveStateImage = './images/players/scar-move-x120.png';


// set player default state after creating then
let setPlayerMufasaState = playerMufasa.activeState;
let setPlayerScarState = playerScar.inactiveState;

// create the boxes/squares
function setPlayerGameInfo(playerDiv, player) {
    $(`${playerDiv} .player-name`).text(player.name);
    $(`${playerDiv} .player-score`).text(player.scoreValue);
    $(playerDiv + ' .fake-weapon').removeClass().addClass('game-weapon-fake ' + player.currentWeapon);
    $(`${playerDiv} .weapon-weight`).text(player.damageValue);
}


/**
 * Shows an image and name of an object when the mouse is overed on
 */
function showOjectInfo() {

    const genericSpan = function () {
        $(this).find('span').last().remove();
    }

    $('.map-box.game-weapon.game-weapon-gun').hover(

        function () {
            // console.log(this);
            $(this).append(
                `<span class="hover-effect">
                <img src="${gunWeaponBox.weaponImage}" style="height: 25px !important; text-align: center;" alt="${gunWeaponBox.weaponType}" />
                </span>`
            );
        },
        genericSpan
    );

    $('.map-box.game-weapon.game-weapon-cutlass').hover(

        function () {
            $(this).append(
                `<span class="hover-effect">
                <img src="${cutlassWeaponBox.weaponImage}" alt="${cutlassWeaponBox.weaponType}" />
                </span>`
            );
        },
        genericSpan
    );

    $('.map-box.game-weapon.game-weapon-bow').hover(

        function () {
            $(this).append(
                `<span class="hover-effect">
                <img src="${bowWeaponBox.weaponImage}" alt="${bowWeaponBox.weaponType}" />
                </span>`
            );
        },
        genericSpan
    );

    $('.map-box.game-weapon.game-weapon-axe').hover(

        function () {
            $(this).append(
                `<span class="hover-effect">
                <img src="${axeWeaponBox.weaponImage}" alt="${axeWeaponBox.weaponType}" />
                </span>`
            );
        },
        genericSpan
    );

    $('.map-box.game-weapon.game-weapon-life').hover(
        function () {
            $(this).append(
                `<span class="hover-effect">
                <img src="${lifeWeaponBox.weaponImage}" alt="${lifeWeaponBox.weaponType}" />
                </span>`
            );
        },
        genericSpan
    );

    $('#game-board-map .game-obstacles').hover(
        function () {
            $(this).append(
                `<span class="hover-effect">
                <small>Obstacle</small>
                </span>`
            );
        },
        genericSpan
    );

    $('.map-box.player-mufasa').hover(

        function () {
            $(this).append(
                `<span class="hover-effect">
                <small>Mufasa</small>
                </span>`
            );
        },
        function () {
            $(this).find('span').last().remove();
        }
    );

    $('.map-box.player-scar').hover(

        function () {

            $(this).append(
                `<span class="hover-effect">
                <small>Scar</small>
                </span>`
            );

        },
        genericSpan
    );
}

function runGame() {

    // clear the game map board div contents
    gameBoardMap.empty();

    // show game map board

    // generate the gameboard
    game.startLoadingGame();

    // add players to the game map
    player.addPlayer(playerMufasa.htmlClass, playerMufasa.uniqNumber);
    player.addPlayer(playerScar.htmlClass, playerScar.uniqNumber);


    // add weapons to the game map
    gunWeaponBox.addWeaponToGameMap();
    cutlassWeaponBox.addWeaponToGameMap();
    bowWeaponBox.addWeaponToGameMap();
    axeWeaponBox.addWeaponToGameMap();
    lifeWeaponBox.addWeaponToGameMap();

    // set player default scores et al
    setPlayerGameInfo('#player-mufasa', playerMufasa);
    setPlayerGameInfo('#player-scar', playerScar);

    // set player-mufasa class to be the active palyer
    $('.player-mufasa').addClass('active-player');


    showOjectInfo();

    playerPosition = getPosition('.player-mufasa');

    oldXYPos = getXYPosition(playerPosition);

    player.startPlayerActions();

}

$(document).ready(function () {


})