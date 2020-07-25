'use strict'

const BOMB = '💣'
const FLAG = '🚩'
const EMPTY = ' '
// const ZERO = '0️⃣'
// const ONE = '1️⃣ '
// const TWO = '2️⃣ '
// const THREE = '3️⃣ '
// const FOUR = '4️⃣'



var gBoard;
var gLvl;
var gBombsOnBoard;
var gInterval;
var gStart;
var gGame;
var gEndGame;

function initGame(lvl = 'Beginner') {
    gEndGame = false
    restartTime();
    clearInterval(gInterval);
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    };
    gLvl = setGameDiff(lvl)
    gBoard = buildBoard(gLvl);
    renderBoard(gBoard);
    // console.table(gBoard);
    // gGame.isOn = true;

}


// making the game in console
function buildBoard() {
    var board = [];
    // var boombsPos = randomMinesPos();
    // var currBombsPos;
    for (var i = 0; i < gLvl.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLvl.SIZE; j++) {

            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell;
            // // active bombs (manual)
            // if (i === 0 && j === 0) cell.isMine = true;
            // if (i === 1 && j === 1) cell.isMine = true;
        }
    }
    // // active bombs (automatic)
    // for (var i = 0; i < boombsPos.length; i++) {
    //     currBombsPos = boombsPos[i];
    //     board[currBombsPos.i][currBombsPos.j].isMine = true;
    //     // bombsOnBoard++;
    // }

    // // console.log(bombsOnBoard);
    // // bombsOnBoard = 0 ;
    // setMinesNegsCount(board);
    // // console.log(board);
    return board;
}

// show it in HTML
function renderBoard(board) {
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>' //start
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var cellContent = '';


            var cellStr = ''
            strHtml += cellStr;
            if (cell.isMine) {
                cellStr += 'Bomb'
                cellContent = BOMB;

            } else if (cell.minesAroundCount === 0) {
                cellContent = EMPTY

            } else {
                cellContent = cell.minesAroundCount;
            }
            strHtml += `<td id="cell-${i}-${j}" class="${cellStr}" onmousedown="cellMarked(this,event, ${i}, ${j})" onclick="cellClicked(this,${i},${j})"><span class="span-${i}-${j}">${cellContent}</span></td>`;
        }
        strHtml += '</tr>' // end
    }
    var elBoard = document.querySelector('.mine-sweeper');
    elBoard.innerHTML = strHtml;
    var bombCounter = document.querySelector('.counting-numbers');
    var counter = bombCounter.querySelector('.bomb-counter');
    counter.querySelector('span').innerText = gLvl.BOMBS;
}

// change difficuluty
function setGameDiff(lvl) {
    gLvl = {
        SIZE: 4,
        BOMBS: 2,
        NORMALCELLS: 14
    };
    if (lvl === 'Beginner') return gLvl;
    switch (lvl) {
        case 'Beginner':
            gLvl.SIZE = 4
            gLvl.BOMBS = 2
            gLvl.NORMALCELLS = 14
            break;
        case 'Medium':
            gLvl.SIZE = 8
            gLvl.BOMBS = 12
            gLvl.NORMALCELLS = 52
            break;
        case 'Expert':
            gLvl.SIZE = 12
            gLvl.BOMBS = 30
            gLvl.NORMALCELLS = 114
            break;
        default: break
    }
    return gLvl
}


// count mines around cell
function setMinesNeighborsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            var cellMinesNegs = findMinesNeighborsCount(board, i, j);
            cell.minesAroundCount = cellMinesNegs;
        }
    }
    // console.log(board);
}

function findMinesNeighborsCount(board, row, column) {
    var numOfNegsAroundMines = 0;
    var neighbors;
    for (var i = row - 1; i <= row + 1; i++) {
        // find bombs from row
        if (i < 0 || i > (board.length - 1)) continue;
        for (var j = column - 1; j <= column + 1; j++) {
            // find bombs from col
            if ((i === row && j === column) ||
                j < 0 ||
                j > (board[i].length - 1)) continue;
            neighbors = board[i][j];
            if (neighbors.isMine) numOfNegsAroundMines++;
        }
    }
    return numOfNegsAroundMines;
}

// place mines at random places
function randomMinesPos(spaceOne, SpaceTwo) {
    var nums = []
    var pos = { i: 0, j: 0 }
    var idx;
    var numsOnBoard = []
    var minesPos = []
    for (var i = 0; i < (gLvl.SIZE ** 2); i++) {
        nums.push(i);
    }
    nums.splice((spaceOne * gLvl.SIZE + SpaceTwo), 1);
    for (var i = 0; i < gLvl.BOMBS; i++) {
        idx = getRandomInt(0, nums.length);
        numsOnBoard = nums.splice(idx, 1);
        pos = { i: Math.floor(numsOnBoard / gLvl.SIZE), j: (numsOnBoard % gLvl.SIZE) }
        minesPos.push(pos)
    }
    return minesPos;
}

// see the amount of bombs near cell 
function cellClicked(elCell, i, j) {
    if (gEndGame) return
    var cell = gBoard[i][j];
    if (cell.isMarked) return;
    if (!gGame.isOn) {
        var bombsCoord;
        gGame.isOn = !gGame.isOn
        gStart = Date.now()
        setTime(gStart)
        gBombsOnBoard = randomMinesPos(i, j)

        for (var idx = 0; idx < gBombsOnBoard.length; idx++) {
            bombsCoord = gBombsOnBoard[idx]
            gBoard[bombsCoord.i][bombsCoord.j].isMine = true;
        }
        setMinesNeighborsCount(gBoard);
        renderBoard(gBoard)
    }
    cell.isShown = true;
    if (cell.isShown) gGame.shownCount++
    // if(cell.isMine) alert('game over');
    if (cell.isMine) {
        gGame.isOn = false;
        gameOver();
        return;
    }

    // if (cell.minesAroundCount === 0) {
    //     showCells(gBoard, i, j);
    //     revealShown(gBoard);
    // }
    // if (cell.isShown) startTimer();
    // console.log(cell);
    elCell.classList.add('clicked');
    var elCellSpan = elCell.querySelector('span');
    elCellSpan.style.visibility = 'visible';
    gameOver();

    // return cell;
}


function gameOver() {
    if (gGame.isOn) {
        if ((gGame.shownCount + gGame.markedCount === gLvl.SIZE ** 2)) {
            gGame.isOn = false;
            gEndGame = true;
            console.log('you won');
            document.querySelector('h2 span').innerText = 'YOU WON!!'
            clearInterval(gInterval);

        }
    } else {
        showBombs();
        clearInterval(gInterval);
        gGame.isOn = false;
        gEndGame = true;
        console.log('you lost');
        document.querySelector('h2 span').innerText = 'YOU LOST!!'
        var markedCell = showFlagedBombs()
        for (var i = 0; i < markedCell.length; i++) {
            var classStr = '.span-' + markedCell[i].i + '-' + markedCell[j].j;
            var elSpan = document.querySelector(classStr);
            elSpan.innerText = '@';

        }

    }
}



function cellMarked(elCell, event, i, j) {
    if (gEndGame) return
    if (event.button === 0) return
    if (!gGame.isOn) return
    var elSpan = elCell.querySelector('span');
    var cell = gBoard[i][j];
    if (!cell.isMarked && ((gGame.markedCount + 1) > gLvl.BOMBS)) return
    if (!cell.isMarked) {
        elSpan.innerText = FLAG
        elSpan.classList.add('marked');
        cell.isMarked = !cell.isMarked;
        gGame.markedCount++;
    } else if (cell.isMarked) {
        elSpan.innerText = cell.minesAroundCount;
        elSpan.classList.remove('marked');
        cell.isMarked = !cell.isMarked;
        gGame.markedCount--;
    }
    var bombCounter = document.querySelector('.counting-numbers');
    var counter = bombCounter.querySelector('.bomb-counter');
    counter.querySelector('span').innerText = (gLvl.BOMBS - gGame.markedCount);
    gameOver();
}

function showBombs() {
    var elBombs = document.querySelectorAll('.Bomb span')
    for (var i = 0; i < gBombsOnBoard.length; i++){
        elBombs[i].classList.add('marked');
        // console.log(bombs);
    }
}

function showFlagedBombs() {
    var cell;
    var array = []
    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[i].length; j++) {
            cell = gBoard[i][j];
            if (!cell.isMine && cell.isMarked) {
                array.push({ i: i, j: j })
            }
        }
    }
    return array;
}

function showEmptyCells(){
    
}

function setTime() {
    gInterval = setInterval(timer, 1000);
}

function timer() {
    var date = new Date() - gStart;
    date = Math.floor(date / 1000);
    var elTimer = document.querySelector('.timer');
    elTimer.querySelector('span').innerText = date;
}
function restartTime() {
    var time = document.querySelector('.timer')
    time.querySelector('span').innerText = '0'
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// need to do "first click = not bomb"
// need to do "when empty space clikced , show other empty spaces"
