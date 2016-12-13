'use strict';

var game = new Phaser.Game(700, 700, Phaser.AUTO, 'game');

var frog, cursors, stats, topGroup, health, dieSound, shootSound;
var collisionSprites = [];
var enemies = [];
var currentRoom = [0, 0];
var roomsExplored = [currentRoom.toString()];
var heart;

game.state.add('play', {
  init: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2100, 2100);
  },

  preload: function() {
    game.load.image('bookShelf', 'images/book_shelf.png');
    game.load.image('bullet', 'images/bullet.png');
    game.load.image('lamp', 'images/lamp.png');
    game.load.image('piano', 'images/piano.png');
    game.load.image('room', 'images/room.png');
    game.load.spritesheet('bug', 'images/bug.png', 40, 40);
    game.load.spritesheet('frog', 'images/frog.png', 40, 40);
    game.load.spritesheet('soldier', 'images/soldier.png', 40, 40);
    game.load.audio('backgroundMusic', 'sounds/background_music.mp3');
    game.load.audio('shoot', 'sounds/shoot.mp3');
    game.load.audio('die', 'sounds/die.mp3');
  },

  create: function() {
    game.background = game.add.tileSprite(0, 0, 2100, 2100, 'room');

    frog = {direction: 'up', sprite: {}, lastShootTime: 0};
    frog.sprite = game.add.sprite(1050, 1270, 'frog');
    frog.sprite.anchor.set(.5, .5);
    game.camera.follow(frog.sprite);
    frog.sprite.animations.add('run');
    frog.sprite.animations.play('run', 10, true);
    game.physics.enable(frog.sprite);
    collisionSprites.push(frog.sprite);

    var piano = game.add.sprite(910, 870, 'piano');
    game.physics.arcade.enable(piano);
    piano.body.immovable = true;
    collisionSprites.push(piano);
    game.add.sprite(1610, 870, 'piano');
    game.add.sprite(910, 1570, 'piano');
    game.add.sprite(1610, 1570, 'piano');
    var bookShelf = game.add.sprite(1150, 1110, 'bookShelf');
    game.physics.arcade.enable(bookShelf);
    bookShelf.body.immovable = true;
    collisionSprites.push(bookShelf);
    game.add.sprite(1130, 1094, 'lamp');

    game.add.sprite(1150+700, 1110, 'bookShelf');
    game.add.sprite(1130+700, 1094, 'lamp');
    game.add.sprite(1150, 1110+700, 'bookShelf');
    game.add.sprite(1130, 1094+700, 'lamp');
    game.add.sprite(1150+700, 1110+700, 'bookShelf');
    game.add.sprite(1130+700, 1094+700, 'lamp');
    game.add.sprite(1150-700, 1110, 'bookShelf');
    game.add.sprite(1130-700, 1094, 'lamp');
    game.add.sprite(1150, 1110-700, 'bookShelf');
    game.add.sprite(1130, 1094-700, 'lamp');
    game.add.sprite(1150-700, 1110-700, 'bookShelf');
    game.add.sprite(1130-700, 1094-700, 'lamp');
    game.add.sprite(1150-700, 1110+700, 'bookShelf');
    game.add.sprite(1130-700, 1094+700, 'lamp');
    game.add.sprite(1150+700, 1110-700, 'bookShelf');
    game.add.sprite(1130+700, 1094-700, 'lamp');

    var backgroundMusic = game.add.audio('backgroundMusic');
    backgroundMusic.loop = true;
    backgroundMusic.play();
    dieSound = game.add.audio('die');
    dieSound.volume = .25;
    shootSound = game.add.audio('shoot');
    shootSound.volume = .25;

    health = 3;
    var invisibleWallCoords = [
      [790, 490, 220, 300],
      [490, 790, 300, 220],
      [1090, 490, 220, 300],
      [1310, 790, 300, 220],
      [490, 1090, 300, 220],
      [790, 1310, 220, 300],
      [1310, 1090, 300, 220],
      [1090, 1310, 220, 300]
    ];
    for (var i = 0; i < invisibleWallCoords.length; i++) {
      var invisibleWall = game.add.sprite(
        invisibleWallCoords[i][0],
        invisibleWallCoords[i][1]
      );
      game.physics.enable(invisibleWall);
      invisibleWall.width = invisibleWallCoords[i][2];
      invisibleWall.height = invisibleWallCoords[i][3];
      invisibleWall.body.immovable = true;
      collisionSprites.push(invisibleWall);
    }

    topGroup = game.add.group();

    var darknessSquare = game.add.bitmapData(100, 100);
    darknessSquare.ctx.fillStyle = '#362d10';
    darknessSquare.ctx.fillRect(0, 0, 100, 100);
    topGroup.add(game.add.sprite(650, 1000, darknessSquare));
    topGroup.add(game.add.sprite(1350, 1000, darknessSquare));
    topGroup.add(game.add.sprite(1000, 650, darknessSquare));
    topGroup.add(game.add.sprite(1000, 1350, darknessSquare));

    stats = game.add.text(0, 0, '', {
      font: '20px monospace',
      fill: '#b7b4ae',
      backgroundColor: 'black'});
    topGroup.add(stats);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
  },

  update: function() {
    if (cursors.up.isDown) {
      frog.direction = 'up';
      frog.sprite.rotation = 0;
    }
    else if (cursors.down.isDown) {
      frog.direction = 'down';
      frog.sprite.rotation = Math.PI;
    }
    else if (cursors.left.isDown) {
      frog.direction = 'left';
      frog.sprite.rotation = Math.PI * 1.5;
    }
    else if (cursors.right.isDown) {
      frog.direction = 'right';
      frog.sprite.rotation = Math.PI * .5;
    }

    frog.sprite.body.velocity.x = 0;
    frog.sprite.body.velocity.y = 0;
    switch (frog.direction) {
      case 'up':
        frog.sprite.body.velocity.y = -150;
        break;
      case 'down':
        frog.sprite.body.velocity.y = 150;
        break;
      case 'left':
        frog.sprite.body.velocity.x = -150;
        break;
      case 'right':
        frog.sprite.body.velocity.x = 150;
        break;
    }

    checkSpacebar();

    for (var i = 0; i < enemies.length; i++) {
      if (game.physics.arcade.overlap(enemies[i], frog.sprite) &&
          !frog.invincible) {

        frog.sprite.tint = 0xff0000;
        frog.invincible = true;
        health--;
        dieSound.play();
        game.time.events.add(1000, function() {
          frog.sprite.tint = 0xffffff;
          frog.invincible = false;
        });
        if (health < 1) {
          var gameOverText = game.add.text(frog.sprite.body.x,
            frog.sprite.body.y,
            'ur dead\n\nrooms explored:' + roomsExplored.length,
            {
              font: '40px monospace',
              fill: '#b7b4ae',
              backgroundColor: 'black'
            }
          );
          gameOverText.anchor.set(.5, .5)
          game.paused = true;
          setTimeout(function() { location.reload(); }, 3000);
        }
        break;
      }
      game.physics.arcade.moveToObject(enemies[i], frog.sprite, 70);
    }

    for (var sprite = 0; sprite < collisionSprites.length; sprite++)
      for (var otherSprite = 0; otherSprite < collisionSprites.length; otherSprite++)
        if (sprite != otherSprite)
          game.physics.arcade.collide(collisionSprites[sprite],
                                      collisionSprites[otherSprite]);

    if (frog.sprite.body.x < 700) {
      currentRoom[0]--;
      switchRoom();
    }
    else if (frog.sprite.body.y < 700 ) {
      currentRoom[1]--;
      switchRoom();
    }
    else if (frog.sprite.body.x >= 1400) {
      currentRoom[0]++;
      switchRoom();
    }
    else if (frog.sprite.body.y >= 1400) {
      currentRoom[1]++;
      switchRoom();
    }

    if (
      heart &&
      Phaser.Rectangle.intersects(frog.sprite.getBounds(), heart.getBounds())
    ) {
      heart.destroy();
      heart = null;
      if (health < 3) health++;
    }

    stats.text = 'current room: ' + currentRoom[0] + ',' + currentRoom[1] + '\nrooms explored: ' + roomsExplored.length + '\nhealth: ';
    for (var i = 0; i < health; i++) stats.text += '❤'
    stats.x = frog.sprite.body.x - 300;
    stats.y = frog.sprite.body.y - 300;

    game.world.bringToTop(topGroup);
    if (gameOverText) game.world.bringToTop(gameOverText);
  }
}, true);

function switchRoom() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].destroy();
  }
  for (var i = 0; i < collisionSprites.length; i++)
    if (collisionSprites[i].key == 'bug') {
      collisionSprites.splice(i, 1);
      i--;
    }
    else if (collisionSprites[i].key == 'bullet') {
      collisionSprites[i].destroy();
      collisionSprites.splice(i, 1);
      i--;
    }
  enemies = [];
  var difficulty = Math.abs(currentRoom[0]) + Math.abs(currentRoom[1]);
  for (var i = 0; i < difficulty; i++) spawnBug();
  if (roomsExplored.indexOf(currentRoom.toString()) == -1) roomsExplored.push(currentRoom.toString());
  frog.sprite.body.x = frog.sprite.body.x % 700 + 700;
  frog.sprite.body.y = frog.sprite.body.y % 700 + 700;
  if (heart) heart.destroy();
  heart = null;
  if (difficulty > 2 && Math.random() * 3 < 1) {
    heart = game.add.text(getSpawnPosition(), getSpawnPosition(), '❤', {
      font: '40px monospace',
      fill: '#cc6e9f'});
    game.physics.enable(heart);
  }
}

function getSpawnPosition() {
  return Math.floor(Math.random() * 11) * 40 + 830;
}

function spawnBug() {
  var bug = game.add.sprite(getSpawnPosition(), getSpawnPosition(), 'bug');
  bug.animations.add('run');
  bug.animations.play('run', 5, true);
  game.physics.enable(bug);
  enemies.push(bug);
  collisionSprites.push(bug);
}

function checkSpacebar() {
  if (
    game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) &&
    frog.lastShootTime + 700 < game.time.time
  ){
    switch (frog.direction) {
      case 'up':
        var bulletData = {position: [frog.sprite.body.position.x, frog.sprite.body.position.y-50], direction: [0, -1]};
        break;
      case 'down':
        var bulletData = {position: [frog.sprite.body.position.x, frog.sprite.body.position.y+50], direction: [0, 1]};
        break;
      case 'left':
        var bulletData = {position: [frog.sprite.body.position.x-50, frog.sprite.body.position.y], direction: [-1, 0]};
        break;
      case 'right':
        var bulletData = {position: [frog.sprite.body.position.x+50, frog.sprite.body.position.y], direction: [1, 0]};
        break;
    }
    var bullet = game.add.sprite(bulletData.position[0], bulletData.position[1], 'bullet');
    game.physics.enable(bullet);
    bullet.body.mass = 4.06;
    var bulletSpeed = 400;
    bullet.body.velocity.x = bulletData.direction[0] * bulletSpeed;
    bullet.body.velocity.y = bulletData.direction[1] * bulletSpeed;
    collisionSprites.push(bullet);
    frog.lastShootTime = game.time.time;
    shootSound.play();
  }
}
