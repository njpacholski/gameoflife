/*
 * Conway's Game of Life implementation
 * By Nicholas Pacholski 
 */

var canvas;
var context;
var lifeIteration;
var gridSize = 100;
var cells; 
var cellSize = 25;

var colours = new Array({r:43, g:101, b:236},
                        {r:76, g:196, b:23},
                        {r:255, g:165, b:0},
                        {r:205, g:0, b:0},
                        {r:205, g:0, b:205});
                            
var glows = new Array({r:0, g:255, b:255},
                      {r:0, g:255, b:0},
                      {r:255, g:235, b:70},
                      {r:255, g:0, b:0},
                      {r:255, g:0, b:255});

/* hard-coded lifeforms */
var lifeForms = [
    [1741, 1742, 1840, 1740, 1840, 1740, 1940, 1842, 1942], //Arch
    [1741, 1842, 1942, 1941, 1940], //Glider
    [1841, 1941, 1840, 1742, 1741], //R-pentomino
    [1837, 1838, 1938, 1942, 1943, 1944, 1743] //Diehard
];
                     
function Cell(row, column, isPopulated, colour, glow) {
    this.row = row;
    this.column = column;
    this.isPopulated = isPopulated;
    this.colour = colour; 
    this.glow = glow;
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if(e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    var colour = ~~(Math.random() * colours.length); 
    var cell = new Cell(Math.floor(y/cellSize), Math.floor(x/cellSize), false, colours[colour], glows[colour]);
    return cell;
}

function drawCells() {
    canvas = document.getElementById("cvs");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext("2d");
    context.strokeStyle = "rgba(10, 10, 10, 0.5)";
    for(var i = 0; i < cells.length; i++) {
        if(!cells[i].isPopulated) {
            context.fillStyle = "rgba(2, 2, 2, 0.9)";
            context.fillRect(cells[i].column*cellSize, cells[i].row*cellSize, cellSize, cellSize);
            context.strokeRect(cells[i].column*cellSize, cells[i].row*cellSize, cellSize, cellSize);
        } else {
            context.fillStyle = "rgba(2, 2, 2, 0.9)";
            context.fillRect(cells[i].column*cellSize, cells[i].row*cellSize, cellSize, cellSize);
            context.strokeRect(cells[i].column*cellSize, cells[i].row*cellSize, cellSize, cellSize);
            fadeIn(i);
            context.shadowBlur = 0;
        }
    }
}

function fadeIn(i) {
    var alpha = 0.0,
        interval = setInterval(function () {
            context.fillStyle = "rgba("+cells[i].colour["r"]+", "+cells[i].colour["g"]+", "+cells[i].colour["b"]+", "+alpha+")";
            //context.beginPath();
            //context.arc(cells[i].column*cellSize + cellSize/2, cells[i].row*cellSize + cellSize/2, 6, 0, Math.PI*2, true);
            context.shadowColor = "rgba("+cells[i].glow["r"]+", "+cells[i].glow["g"]+", "+cells[i].glow["b"]+", 0.4)";
            context.shadowBlur = 20;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.fillRect(cells[i].column*cellSize + cellSize/4, cells[i].row*cellSize + cellSize/4, cellSize/2, cellSize/2);
            //context.fill();
            alpha = alpha + 0.1; 
            if (alpha > 0.6) {
                clearInterval(interval);
            }
        }, 25); 
}

function selectCell(e) {
    var cell = getCursorPosition(e);
    for(var i = 0; i < cells.length; i++) {
        if((cells[i].row == cell.row) && 
           (cells[i].column == cell.column)) {
                cells[i].isPopulated = !cells[i].isPopulated;
        }
    }
    drawCells();
}

function createCells() {
    canvas = document.getElementById("cvs");
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    cells = new Array(gridSize*gridSize);
    var k = 0;
    for(var i = 0; i < gridSize; i++) {
        for(var j = 0; j < gridSize; j++) {
            var colour = ~~(Math.random() * colours.length); 
            cells[k] = new Cell(i, j, false, colours[colour], glows[colour]);
            k++;
        }            
    }
}

function life() {
    var newCells = new Array(gridSize*gridSize);
    for(var i = 0; i < cells.length; i++) {
        newCells[i] = new Cell(cells[i].row, cells[i].column, cells[i].isPopulated, cells[i].colour, cells[i].glow);
        /* For a space that is 'populated': */
        if(cells[i].isPopulated) {
            /* Each cell with one or no neighbors dies, as if by loneliness. */
            if(getNeighbours(i) <= 1) {
                newCells[i].isPopulated = false;
            }
            /* Each cell with four or more neighbors dies, as if by overpopulation. */
            if(getNeighbours(i) >= 4) {
                newCells[i].isPopulated = false;
            }
            /* Each cell with two or three neighbors survives. */
        } else {
            /* For a space that is 'empty' or 'unpopulated'
               Each cell with three neighbors becomes populated. */
            
            if(getNeighbours(i) == 3) {
                newCells[i].isPopulated = true;
            }
            
        }
    }
    cells = newCells; 
    drawCells();
}

function getNeighbours(i) {

    /* returns how many neighbours a cell has */
    var count = 0;
    
    /* ignore edge cases */
    if(cells[i].row == 0 || cells[i].column == 0 || cells[i].row == gridSize-1 || cells[i].column == gridSize-1) {
        return count;
    }
    
    if(cells[i+1].isPopulated) {
        count++;
    }
    if(cells[i-1].isPopulated) {
        count++;
    }
    if(cells[i+gridSize].isPopulated) {
        count++;
    }
    if(cells[i-gridSize].isPopulated) {
        count++;
    }
    if(cells[i+gridSize+1].isPopulated) {
        count++;
    }
    if(cells[i-gridSize+1].isPopulated) {
        count++;
    }
    if(cells[i+gridSize-1].isPopulated) {
        count++;
    }
    if(cells[i-gridSize-1].isPopulated) {
        count++;
    }
    
    return count;
}

function randomLife() {
    createCells();
    var life = lifeForms[~~(Math.random() * lifeForms.length)];
    for(var i = 0; i < life.length; i++) {
        var colour = ~~(Math.random() * colours.length); 
        cells[life[i]].isPopulated = true;
    }
    drawCells();
}

function startLife() {
    lifeIteration = setInterval(life, 300);
}

function stopLife() {
    window.clearInterval(lifeIteration);  
    createCells();
    drawCells();
}

createCells();
var start = document.getElementById('start');
var random = document.getElementById('random');
var reset = document.getElementById('reset');
canvas.addEventListener("click", selectCell, false);
start.addEventListener('click', startLife, false);
random.addEventListener('click', randomLife, false);
reset.addEventListener('click', stopLife, false);
drawCells();