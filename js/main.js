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
var bombsOnBoard ;

function initGame() {
    gLvl = {
        SIZE: 4,
        BOMBS: 2
    };
    gBoard = buildBoard(gLvl);
    renderBoard(gBoard);
    // console.table(gBoard);

}

// making the game in console
function buildBoard(gLvl) {
    var board = [];
    var boombsPos = randomMinesPos();
    var currBombsPos;
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
    // active bombs (automatic)
    for (var i = 0; i < boombsPos.length; i++) {
        currBombsPos = boombsPos[i];
        board[currBombsPos.i][currBombsPos.j].isMine = true;
        // bombsOnBoard++;
    }
    
    // console.log(bombsOnBoard);
    // bombsOnBoard = 0 ;
    setMinesNegsCount(board);
    // console.log(board);
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
                cellStr += ' Bomb'
                cellContent = BOMB;
            }
            else {
                cellStr += ' Empty';
                cellContent = cell.minesAroundCount;
            }
            strHtml += `<td class="${cellStr}"  onclick="cellClicked(this,${i},${j})"><span>${cellContent}</span></td>`;
        }
        strHtml += '</tr>' // end
    }
    var elBoard = document.querySelector('.mine-sweeper');
    elBoard.innerHTML = strHtml;
}


// count mines around cell
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j];
            var cellMinesNegs = findMinesNegsCount(board, i, j);
            cell.minesAroundCount = cellMinesNegs;
        }
    }
    // console.log(board);
}

function findMinesNegsCount(board, row, column) {
    var numOfNegsAroundMines = 0;
    for (var i = row - 1; i <= row + 1; i++) {
        // find bombs from row
        if (i < 0 || i > (board.length - 1)) continue;
        for (var j = column - 1; j <= column + 1; j++) {
            // find bombs from col
            if ((i === row && j === column) ||
                j < 0 ||
                j > (board[i].length - 1)) continue;
            var curr = board[i][j];
            if (curr.isMine) numOfNegsAroundMines++;
        }


    }
    return numOfNegsAroundMines;
}

// place mines at random places
function randomMinesPos() {
    var nums = []
    var pos = { i: 0, j: 0 }
    var idx;
    var numsOnBoard = []
    var minesPos = []
    for (var i = 0; i < (gLvl.SIZE ** 2); i++) {
        
        nums.push(i);
    }
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
    var cell = gBoard[i][j];
    cell.isShown = true;
    // if(cell.isMine) alert('game over');

    // console.log(cell);

    var elCellSpan = elCell.querySelector('span');
    elCellSpan.style.visibility = 'visible';
    return cell;
}



function cellMarked(elCell) {

}







function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


