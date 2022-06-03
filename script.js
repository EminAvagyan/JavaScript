const EMPTY_CELL = 0;
const WOLF = 1;
const FENCE = 2;
const HOUSE = 3;
const RABBIT = 4;

const gallery = new Array();

gallery[1] = "images/gamewolf.png";
gallery[2] = "images/ban.png";
gallery[3] = "images/home.png";
gallery[4] = "images/rabbit.png";

function gameStart() {
  const gameAreaSize = parseInt(document.getElementById("select").value);
  const matrix = createGameArray(gameAreaSize);
  
  setGameAreWidth(gameAreaSize);

  insertAllCharacters(matrix, gameAreaSize);
  hideGameMessages();
  clearGameArea()
  
  createGameArea(matrix, gameAreaSize);
  eventListenersForRabbit(matrix, gameAreaSize);
}

function setGameAreWidth(gameAreaSize) {
  const width = gameAreaSize * 60 + 20 + "px";
  const gameAreaDiv = document.getElementById("game_area");
  gameAreaDiv.style.width = width;
}
function eventListenersForRabbit(array, gameAreaSize) {
  window.onkeydown = (event) => {
    if (event.key === "ArrowUp") {
      moveRabbitUp(array);
    }
    if (event.key === "ArrowDown") {
      moveRabbitDown(array);
    }
    if (event.key === "ArrowLeft") {
      moveRabbitLeft(array);
    }
    if (event.key === "ArrowRight") {
      moveRabbitRight(array);
    }
    changeWolvesPositions(array);
    clearGameArea();
    createGameArea(array, gameAreaSize);
  };
}

function changeWolvesPositions(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const wolvesCords = findCharacterCords(array, WOLF);
  wolvesCords.forEach((singleWolf) => {
    const freeCells = findEmptyCellsArroundWolf(array, singleWolf);
    if (freeCells != undefined) {
      calculateDistanceFromRabbitandPlace(array,freeCells,rabbitCords,singleWolf);
    }
  });
}

function findEmptyCellsArroundWolf(array, wolvesCords) {
  const [x, y] = wolvesCords;
  let movementDirections = [];

  if (x === array.length - 1) {
    movementDirections = [
      [x - 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    return gil(wolvesCords, array, movementDirections);
  }
  if (x === 0) {
    movementDirections = [
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    return gil(wolvesCords, array, movementDirections);
  }
  if (y === 0) {
    movementDirections = [
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
    ];
    return gil(wolvesCords, array, movementDirections);
  }
  if (y === array.length - 1) {
    movementDirections = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
    ];
    return gil(wolvesCords, array, movementDirections);
  } else {
    movementDirections = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    return gil(wolvesCords, array, movementDirections);
  }
}

function gil(wolvesCords, array, movementDirections) {
  const findInMatrix = function (accumulator, wolf) {
    const [z, k] = wolf;
    if (array[z][k] === RABBIT && array[z][k] != HOUSE) {
      showGameMessages("over")
    } else if (array[z][k] === EMPTY_CELL) {
      accumulator.push([z, k]);
    }
    return accumulator;
  };

  return movementDirections.reduce(findInMatrix, []);
}

function calculateDistanceFromRabbitandPlace(array,freeVellsArray,rabbitCords,item
) {
  const distanceArray = [];
  freeVellsArray.forEach((item) => {
    const distance = calculateDistanceFromRabbit(item, rabbitCords);
    distanceArray.push(distance);
  });

  const max = Math.min(...distanceArray);
  const index = distanceArray.indexOf(max);

  placeWolvesIntoNewCells(array, freeVellsArray[index], item);
}

const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function placeWolvesIntoNewCells(array, wolvesCords, item) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const [x, y] = wolvesCords;
  const [k, p] = item;
  if (equals([x, y], rabbitCords)) {
    showGameMessages("over")
  } else {
    array[x][y] = WOLF;
    array[k][p] = EMPTY_CELL;
  }
}

function calculateDistanceFromRabbit(arrayItem, rabbitCords) {
  let [x, y] = arrayItem;
  let [z, k] = rabbitCords[0];

  return Math.round(Math.sqrt(Math.pow(x - z, 2) + Math.pow(y - k, 2)));
}

function moveRabbitUp(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[0][0] === 0) {
    directions.up[0] = array.length - 1;
  }
  checkDir(directions.up, rabbitCords, array);
}

function moveRabbitDown(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[0][0] === array.length - 1) {
    directions.down[0] = 0;
  }
  checkDir(directions.down, rabbitCords, array);
}

function moveRabbitLeft(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[0][1] === 0) {
    directions.left[1] = array.length - 1;
  }
  checkDir(directions.left, rabbitCords, array);
}
function moveRabbitRight(array) {
  const rabbitCords = findCharacterCords(array, RABBIT);
  const directions = getEventDirection(rabbitCords);
  if (rabbitCords[0][1] === array.length - 1) {
    directions.right[1] = 0;
  }
  checkDir(directions.right, rabbitCords, array);
}

function checkDir(newCords, napCords, array) {
  const [j, k] = newCords;
  const [x, y] = napCords[0];
  if (array[j][k] == EMPTY_CELL) {
    array[j][k] = RABBIT;
    array[x][y] = EMPTY_CELL;
  } else if (array[j][k] === HOUSE) {
    showGameMessages("win")
  } else if (array[j][k] === FENCE) {
    return;
  }
  if (array[j][k] === WOLF) {
    showGameMessages("over")
  }
}

function getEventDirection(rabbitCords) {
  let [x, y] = rabbitCords[0];
  const direction = {
    up: [x - 1, y],
    down: [x + 1, y],
    right: [x, y + 1],
    left: [x, y - 1],
  };

  return direction;
}

function findCharacterCords(array, character) {
  const findInMatrix = function (accumulator, row, x) {
    row.forEach((element, y) => {
      if (element === character) {
        accumulator.push([x, y]);
      }
    });

    return accumulator;
  };

  return array.reduce(findInMatrix, []);
}

function insertAllCharacters(array, gameAreaSize) {
  const wolvesCount = (gameAreaSize / 100) * 60;
  const fenceCount = (gameAreaSize / 100) * 40;
  insertCharactersIntoArray(array, WOLF, wolvesCount);
  insertCharactersIntoArray(array, FENCE, fenceCount);
  insertCharactersIntoArray(array, HOUSE, 1);
  insertCharactersIntoArray(array, RABBIT, 1);
}

function createGameArray(gameAreaSize) {
  const gameCondition = new Array(gameAreaSize)
    .fill(EMPTY_CELL)
    .map(() => new Array(gameAreaSize).fill(EMPTY_CELL));

  return gameCondition;
}

function insertSingleCharacter(cord, myArray, character) {
  const x = cord[0];
  const y = cord[1];
  myArray[x][y] = character;
}

function findEmptyCell(myArray) {
  const randomX = Math.floor(Math.random() * myArray.length);
  const randomY = Math.floor(Math.random() * myArray.length);
  if (myArray[randomX][randomY] === EMPTY_CELL) {
    return [randomX, randomY];
  } else {
    return findEmptyCell(myArray);
  }
}

function insertCharactersIntoArray(myArray, character, count) {
  for (let i = 0; i < count; i++) {
    const cords = findEmptyCell(myArray);
    insertSingleCharacter(cords, myArray, character);
  }
  return myArray;
}

function clearGameArea() {
  const containerNode = document.getElementById("game_area");
  containerNode.innerHTML = "";
}

function createInnerDivs(cellIndex) {
  const containerNode = document.getElementById("game_area");

  const div = document.createElement("div");
  div.setAttribute("id", cellIndex);
  containerNode.append(div);
}
function insertCharacterImage(character, cellIndex) {
  const div = document.getElementById(cellIndex);
  const img = document.createElement("img");
  img.src = gallery[character];
  img.style.width = "60px";
  div.append(img);
}

function createGameArea(array, gameAreaSize) {
  array.forEach((row, i) => {
    row.forEach((column, j) => {
      const cellIndex = i.toString() + j.toString();
      if (column === EMPTY_CELL) {
        createInnerDivs(cellIndex);
      }
      if (column === RABBIT) {
        createInnerDivs(cellIndex);
        insertCharacterImage(RABBIT, cellIndex);
      }
      if (column === WOLF) {
        createInnerDivs(cellIndex);
        insertCharacterImage(WOLF, cellIndex);
      }
      if (column === FENCE) {
        createInnerDivs(cellIndex);
        insertCharacterImage(FENCE, cellIndex);
      }
      if (column === HOUSE) {
        createInnerDivs(cellIndex);
        insertCharacterImage(HOUSE, cellIndex);
      }
    });
  });
}
function hideGameMessages(){
  const mainDiv = document.getElementById("message_div")
  mainDiv.style.display = "none"
  const gameBoard = document.getElementById("wrapper")
  gameBoard.style.display = "block"
}
function showGameMessages(gameStatus){
  
  const mainDiv = document.getElementById("message_div")
  const message = document.querySelector("#message_div>h2")
  const gameBoard = document.getElementById("wrapper")
  gameBoard.style.display = "none"
  if(gameStatus === "over"){
    message.innerText = "Game over"
  } else if(gameStatus === "win"){
    message.innerText = "You win"
  }

  mainDiv.style.display = "block"
}