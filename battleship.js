const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

$(document).ready(function () {
  generateBoard();
  setInterval(blinkButton, 1000);
  $('button').on('click', function () {
    $(this).fadeOut();
    $('#gamefeed').append('<li>Place Your Battleships</li>');
    $('li').last().text("Place your Battleships (click to place, right click to rotate)").addClass('blink_white');
    setInterval(blinkLi, 1000);
    placeShips();
    
    $('.grid-item').on("click", function () {
      $(this).addClass('ship');
      $(this).next().addClass('ship');

    });
  });
});


function placeShips() {
  let ships = 0;
  let rotate = 1; // 0-vertical 1-horizontal
  let shipSize = [5, 4, 3, 3, 2];
  //while (ships < 5) {
    $('.grid-item').on('hover', function (event) {
      //highlight all places where ship would go
      if (rotate === 1){
       let tokenList = this.classList();
        console.log(tokenList);
        ships = 5;
      } else {

      }
      
    });
    $('.grid-item').on('mousedown', function (event) {
      switch (event.which) {
        case 1: //left click
          //place boat
          break;
        case 3: //right right
          //rotate boat
          break;
      }
    });
 // };
}


// A Carrier, which is 5 tiles long
// A Battleship, which is 4 tiles long
// A Cruiser, which is 3 tiles long
// A Submarine, which is 3 tiles long
// A Destroyer, which is 2 tiles long


function blinkButton() {
  $('button').first().toggleClass('blink_red_button');
};
function blinkLi() {
  $('li').last().toggleClass('blink_red');
};

function generateBoard() {

  for (let player = 1; player <= 2; player++) {
    for (let rowIndex = 0; rowIndex <= 9; rowIndex++) {
      for (let column = 1; column <= 10; column++) {
        const cell = $(`<div>${row[rowIndex]}${column}</div>`)
          .addClass(`row${row[rowIndex]}`)
          .addClass(`column${column}`)
          .addClass('grid-item');
        $(`#P${player}-grid-container`).append(cell);
      }
    }
  }
};
