var canvas;
var backgroundImage, bgImg, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2,fuels, powerCoins;
var cars = [];
var fuelImage, powerCoinImage;


function preload() {
  backgroundImage = loadImage("assets/background.png");
  car1_img = loadImage("assets/car1.png");
  car2_img = loadImage("assets/car2.png");
  track = loadImage("assets/track.jpg");
  fuelImage = loadImage("assets/fuel.png");
  powerCoinImage = loadImage("assets/goldCoin.png");
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  // Adding the reference to the database by using the firebase.database() command
  database = firebase.database();
  // The game object is created from the Game class and calls the start() function
  game = new Game();
  game.getState();
  game.start();
 
}


function draw() {
  background(backgroundImage);
   // condition to updating the gameState 
  if (playerCount === 2) {
    game.update(1);
  }
// condition to  change the gameState to play
  if (gameState === 1) {
    game.play();
  }
}
//customised function to resise the game according to the screen 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// open the output in two different browsers
//add 2 different player's names to see the output
// use upward arrow key to move the car forward