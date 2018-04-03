// 0: A Carrier, which is 5 tiles long
// 1: A Battleship, which is 4 tiles long
// 2: A Cruiser, which is 3 tiles long
// 3: A Submarine, which is 3 tiles long
// 4: A Destroyer, which is 2 tiles long
const rowArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let rotate = false;
let ships = 0;
let compShips = 0;
const shipSize = [5, 4, 3, 3, 2];
const shipName = ['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer'];
let badPlacement = false;
let placementComplete = false;
let overlap = false;
let gameStart = false;
let gameOver = false;
let playerTurn = true;
let interval_ID = 2;

$(document).ready(function () {
  generateBoard();
  setInterval(function () { blinkButton() }, 1000);
  $('button').on('click', function () {
    $(this).fadeOut();
    newGameFeed("Place your Battleships (click to place, right click to rotate)")
    gameStart = true;
  });
  $('.grid-item').mouseenter(function () {
    //show where boats will go
    if (gameStart && !placementComplete) {
      shipShadows(this);
    }
  });
  $('.grid-item').on('mousedown', function (event) {
    if (gameStart && !placementComplete) {
      switch (event.which) {
        case 1: //left click
          placeShips(this);
          if (placementComplete) {
            // computerPlace()
            newGameFeed("Your turn, fire when ready!")
          }
          break;
        case 3: //right click
          event.preventDefault();
          rotateShip();
          shipShadows(this);
          break;
      }
    } else if (placementComplete && !gameOver && playerTurn) {
      switch (event.which) {
        case 1: //left click
          fireOnTile()
          computerFire()
      }
    }
  });
});

function fireOnTile() {

  playerTurn = false;
  newGameFeed('Player one fired at ${XXX} for a ${YYYY}');
  return;
}
function computerFire() {

  playerTurn = true;
  newGameFeed('Player two fired at ${XXX} for a ${YYYY}');
  newGameFeed('Your turn, fire when ready!');
  return;
}

//half baked function that places ship based on location given by computerPlace
function computerPlace() {
  let computerComplete = false;
  while (computerComplete === false) {
    let spot = computerPlaceCheck();
    if (rotate === false) {
      $('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      for (let i = 1; i < shipSize[compShips]; i++) {
        let rowIndex = rowArray.indexOf(spot[0]) + i
        let row = rowArray[rowIndex];
        let column = spot[1];

        $('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      }
    } else {
      $('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      for (let i = 1; i < shipSize[compShips]; i++) {
        let rowIndex = rowArray.indexOf(spot[0])
        let row = rowArray[rowIndex];
        let column = Number(spot[1]) + i;

        $('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      }
    }
    if (compShips <= 3) {
      compShips += 1;
    } else {
      computerComplete = true;
    }
  }
}
//half baked function that generates random row/column/rotation and checks if that will create overlap or go out of bounds, and returns coords that work
function computerPlaceCheck() {
  let compPlacement = true;
  while (compPlacement === false) {
    badPlacement = false;
    overlap = false;
    tryRow = randomNumber(0, 9);
    tryColumn = randomNumber(1, 10);
    if (randomNumber(0, 1) === 0) {
      rotate = true;
    } else { rotate = false }
    // which rotation am i in
    if (rotate === false) {
      // is there overlap on cursor
      if ($('#P2-grid-container').children(`div [data-id|="${rowArray[tryRow]}${tryColumn}"]`).data('ship') !== undefined) {
        overlap = true;
      }
      for (let i = 1; i < shipSize[compShips]; i++) {
        let rowIndex = rowArray.indexOf(spot[0]) + i
        if (rowIndex > 9) {
          badPlacement = true;
          break;
        }
        let row = rowArray[tryRow];
        let column = tryColumn;
        if ($('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data('ship') !== undefined) {
          overlap = true;
        }
      }
    } else if (rotate === true) {
      // is there overlap on cursor
      if ($('#P2-grid-container').children(`div [data-id|="${rowArray[tryRow]}${tryColumn}"]`).data('ship') !== undefined) {
        overlap = true;
      }
      for (let i = 1; i < shipSize[compShips]; i++) {
        let rowIndex = rowArray.indexOf(spot[0])
        let row = rowArray[tryRow];
        let column = Number(tryColumn) + i;
        if (column > 10) {
          badPlacement = true;
          break;
        }
        if ($('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data('ship') !== undefined) {
          overlap = true;
        }
      }
    }
    if (!overlap && !badPlacement) {
      compPlacement = true;
    }
    console.log('result from placecheck: ', tryRow, tryColumn)
    return ([tryRow, tryColumn]);
  }
}

function newGameFeed(text) {
  clearInterval(interval_ID);
  $('#topFeed').after('<li></li>');
  $('li').first().text(`${text}`);
  $('li').removeClass('blink_red');
  interval_ID = setInterval(function () { blinkLi() }, 1500);
}

function placeShips(tile) {
  let spot = findCoord(tile);
  if (!($(tile).parent('div').is('#P1-grid-container'))) {
    alert('Place on your own board')
    return;
  }
  if (badPlacement === true || overlap === true) {
    alert('Ship needs more space to be placed')
    return;
  } else {
    if (rotate === false) {
      $(tile).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      
      // creates mirror ships on p2 grid for now
      $('#P2-grid-container').children(`div [data-id|="${spot[0]}${spot[1]}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      // creates mirror ships on p2 grid for now
      
      for (let i = 1; i < shipSize[ships]; i++) {
        // increment ships somewhere in here
        badPlacement = false;
        let rowIndex = rowArray.indexOf(spot[0]) + i

        let row = rowArray[rowIndex];
        let column = spot[1];
        $('#P1-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
        // creates mirror ships on p2 grid for now
        $('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
        // creates mirror ships on p2 grid for now
      }
    } else {
      $(tile).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      // creates mirror ships on p2 grid for now
      $('#P2-grid-container').children(`div [data-id|="${spot[0]}${spot[1]}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
      // creates mirror ships on p2 grid for now
      for (let i = 1; i < shipSize[ships]; i++) {
        badPlacement = false;
        let rowIndex = rowArray.indexOf(spot[0])
        let row = rowArray[rowIndex];
        let column = Number(spot[1]) + i;

        $('#P1-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
        // creates mirror ships on p2 grid for now
        $('#P2-grid-container').children(`div [data-id|="${row}${column}"]`).data("ship", `P1${shipName[ships]}`).addClass(`ship`);
        // creates mirror ships on p2 grid for now
      }
    }
  }
  if (ships <= 3) {
    ships += 1;
  } else {
    placementComplete = true;
  }
}

function shipShadows(tile) {
  overlap = false;
  let spot = findCoord(tile);
  //am i in the right grid?
  if (!($(tile).parent('div').is('#P1-grid-container'))) {
    $('.grid-item').removeClass('artificialHover');
    return;
  }
  // which rotation am i in
  if (rotate === false) {
    // clear old hovers
    $('.grid-item').removeClass('artificialHover');
    // is there overlap on cursor
    if ($('#P1-grid-container').children(`div [data-id|="${spot[0]}${spot[1]}"]`).data('ship') !== undefined) {
      overlap = true;
    }
    //apply hover to the length of the ship in direction of rotation
    $(tile).addClass('artificialHover');
    for (let i = 1; i < shipSize[ships]; i++) {
      // increment ships somewhere in here
      badPlacement = false;
      let rowIndex = rowArray.indexOf(spot[0]) + i
      if (rowIndex > 9) {
        badPlacement = true;
        break;
      }
      let row = rowArray[rowIndex];
      let column = spot[1];
      if ($('#P1-grid-container').children(`div [data-id|="${row}${column}"]`).data('ship') !== undefined) {
        overlap = true;
      }
      $('#P1-grid-container').children(`div [data-id|="${row}${column}"]`).addClass('artificialHover');
    }
  } else if (rotate === true) {
    // clear old hovers
    $('.grid-item').removeClass('artificialHover');
    // is there overlap on cursor
    if ($('#P1-grid-container').children(`div [data-id|="${spot[0]}${spot[1]}"]`).data('ship') !== undefined) {
      overlap = true;
    }
    //apply hover to the length of the ship in direction of rotation
    $(tile).addClass('artificialHover');
    for (let i = 1; i < shipSize[ships]; i++) {
      badPlacement = false;
      let rowIndex = rowArray.indexOf(spot[0])
      let row = rowArray[rowIndex];
      let column = Number(spot[1]) + i;
      if (column > 10) {
        badPlacement = true;
        break;
      }
      if ($('#P1-grid-container').children(`div [data-id|="${row}${column}"]`).data('ship') !== undefined) {
        overlap = true;
      }
      $('#P1-grid-container').children(`div [data-id|="${row}${column}"]`).addClass('artificialHover');
    }
  }
}

function rotateShip() {
  if (rotate) {
    rotate = false;
  } else {
    rotate = true;
  }
}

function blinkButton() {
  $('button').first().toggleClass('blink_red_button');
};
function blinkLi() {
  $('li').first().toggleClass('blink_red');
};

function generateBoard() {

  for (let player = 1; player <= 2; player++) {
    for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
      for (let column = 1; column <= 10; column++) {
        const cell = $(`<div data-id ="${rowArray[rowIndex]}${column}" class="grid-item">${rowArray[rowIndex]}${column}</div>`)
        $(`#P${player}-grid-container`).append(cell);
      }
    }
  }
};
const findCoord = (tile) => {
  let id = $(tile).attr("data-id");
  let row = id.substring(0, 1);
  let column = id.substring(1);
  return ([row, column]);
};
const randomNumber = (low, high) => {
  number = Math.floor(Math.random() * (high) + low);
  return number;
}



