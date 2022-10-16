class Game {
  constructor() {
     // declare properties for resetTitle and resetButton
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    
    //Creating elements for leaderboardTitle, leader1, and leader2.
    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }
// defining functions to get,set and update the data to the database:
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // when should the game begin
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    //creating groups for fuels and powercoins
    fuels = new Group();
    powerCoins = new Group();

    // Adding fuel sprite in the game
    this.addSprites(fuels, 4, fuelImage, 0.02);

    // Adding coin sprite in the game
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
  }

  // adding Sprites
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //to give position, and text/image to resetTitle and resetButton
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);
// creating the resetButton
    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

//Assigning position and text to leaderboardTitle, leader1, and leader2.
    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    // getting players info & adding track image
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

       
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.handleFuel(index);
          this.handlePowerCoins(index);
          
          // Changing camera position in y direction
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;

        }
      }

      // condition to move the car upwards
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }
      this.handlePlayerControls();

      drawSprites();
    }
  }

    //  code for the overlap function i.e; handleFuel
  handleFuel(index) {
    // Adding fuel
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

   //  code for the overlap function i.e; handlePowerCoins
  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      //Increment the score whenever the car touches the powercoins.
      player.score += 21;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  //Create handleResetButton() to reset all fields in the database and reload the game.
handleResetButton() {
  this.resetButton.mousePressed(() => {
    database.ref("/").set({
      playerCount: 0,
      gameState: 0,
      players: {}
    });
    window.location.reload();
  });
}

// Create showLeaderboard() to display Player’s rank, name & score.
showLeaderboard() {
  var leader1, leader2;
  var players = Object.values(allPlayers);
  // creating e leader1 and leader2 variables in the HTML so that they 
      //can be displayed on the canvas.
  if (
    (players[0].rank === 0 && players[1].rank === 0) ||
    players[0].rank === 1
  ) {
    // &emsp;    This tag is used for displaying four spaces.
    leader1 =
      players[0].rank +
      "&emsp;" +
      players[0].name +
      "&emsp;" +
      players[0].score;

    leader2 =
      players[1].rank +
      "&emsp;" +
      players[1].name +
      "&emsp;" +
      players[1].score;
  }

  if (players[1].rank === 1) {
    leader1 =
      players[1].rank +
      "&emsp;" +
      players[1].name +
      "&emsp;" +
      players[1].score;

    leader2 =
      players[0].rank +
      "&emsp;" +
      players[0].name +
      "&emsp;" +
      players[0].score;
  }

  this.leader1.html(leader1);
  this.leader2.html(leader2);
}

//add conditions to move the car with Left and Right Arrow keys.
handlePlayerControls() {
  if (keyIsDown(UP_ARROW)) {
    player.positionY += 10;
    player.update();
  }

  if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
    player.positionX -= 5;
    player.update();
  }

  if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
    player.positionX += 5;
    player.update();
  }
}
}