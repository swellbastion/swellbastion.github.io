if (!localStorage.safariMessage && navigator.userAgent.toLowerCase().indexOf('safari') != -1 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1) {
  alert('hello my dear safari user, if the music doesnt play try refreshing')
  localStorage.safariMessage = 'true'
}

blockPositions = [
  [4, 2],
  [10, 2],
  [12, 2],
  [13, 2],
  [14, 2],
  [15, 0],
  [17, 0],
  [39, -1],
  [39, 2],
  [33, -1],
  [36.5, -4],

  [36, -5],
  [36, -6],
  [36, -7],

  [47.6, 0],
  [48.3, -1],
  [49, -2],
  [49.7, -3],

  [92.77, -3],
  [88.5, -10],

  // ammo
  [94, -9.5],
  [94, -10.5],
  [94, -11.5],
  [94, -12.5],
  [94, -113.5],
  //
  // also ammo
  [95, -10.5],
  [95, -11.5],
  [95, -12.5],
  [95, -113.5],

  [116, -10],
  [117, -10],
  [118, -10],
  [119, -10],
  [120, -10],
  [117, -11],
  [118, -11],
  [119, -11],
  [118, -12]
]

witchPositions = [
  [16, 0],
  [24, 2],
  [24, -1],
  [46, -1],
  [46, 2],
  [36.5, -1],
  [76, 2],
  [76, 1],

  [89, 2],
  [89, 1],
  [89, 0],
  [89, -1],
  [89, -2],
  [89, -3],
  [89, -4],
  [89, -5],
  [89, -6],
  [89, -7],

  [100, 2],
  [101, 2],
  [102, 2],
  [103, 2],
  [104, 2],

  [121, -10],
  [121, -11],
  [121, -15],
  [121, -16],
  [121, -17],
  [122, -16],
  [122, -17],
  [122, -18],
]

invisibleWallCoordinates = [
  [-100, 3, 408, 1],
  [22, 0, 2, 1],
  [29.5, 0, 13, 1],
  [99, 2, 1, 1],

  //arrow
  [47, 6, 5, 1],
  [48, 5, 1, 1],
  [47, 4, 1, 1],
  [48, 7, 1, 1],
  [47, 8, 1, 1],

  [95, 0, 9.5, 1],
  [95, -1, 7.5, 1],
  [95, -2, 5.5, 1],
  [95, -3, 3.5, 1],

  [88.5, -4, 5, 1],
  [111, -8.5, 40, 1],
  [95.6, -9.5, 1, 1],
  [96.6, -9.5, 1, 1],
  [96.6, -11, 1, 2],
  [96.6, -12.5, 1, 1],
]

game = new Phaser.Game(
  innerWidth,
  innerHeight,
  Phaser.WEBGL,
  document.body,
  {
    preload: preload,
    create: create,
    update: update,
    render: render
  }
)

dead = false
soundsLoaded = false

function preload() {
  game.load.image('block', 'block.png')
  game.load.image('ground', 'ground.png')
  game.load.spritesheet('thank', 'thank.png', 32, 32)
  game.load.spritesheet('cowboy', 'cowboy.png', 16, 16)
  game.load.spritesheet('witch', 'witch.png', 16, 16)
  game.load.audio('jump', 'jump.mp3')
  game.load.audio('witchKill', 'witchKill.mp3')
  game.load.audio('enflate', 'enflate.mp3')
  game.load.audio('deflate', 'deflate.mp3')
  game.load.audio('music', 'ldmusic2.mp3')
}

function create() {
  sounds = {
    jump: game.add.audio('jump'),
    witchKill: game.add.audio('witchKill'),
    enflate: game.add.audio('enflate'),
    deflate: game.add.audio('deflate'),
    music: game.add.audio('music'),
  }
  var soundKeys = []
  for (var key in sounds) soundKeys.push(key)
  game.add.text(-200, 0, 'arrows: move\nr: reset')
  var rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
  rKey.onDown.add(resetGame)
  game.sound.setDecodedCallback(soundKeys, onAudioReady)
}

function onAudioReady() {
  soundsLoaded = true
  game.physics.startSystem(Phaser.Physics.P2JS)
  game.physics.p2.gravity.y = 1250
  game.world.setBounds(-1000, -1000, 10000, 2000)
  // game.physics.p2.setBounds(-1000, -1000, 10000, 2000)
  game.stage.backgroundColor = '#999999'
  cursors = game.input.keyboard.createCursorKeys()

  createSprites()
}

function createSprites() {
  cowboy = game.add.sprite(64, 64, 'cowboy')
  cowboy.scale.setTo(4, 4)
  cowboy.smoothed = false
  cowboy.animations.add('walk', [0, 1])
  cowboy.animations.add('die', [2, 3, 4])
  game.physics.p2.enable(cowboy)
  cowboy.body.fixedRotation = true
  game.camera.follow(cowboy)
  cowboy.body.onBeginContact.add(onPlayerCollision)

  thank = game.add.sprite(8136, -708, 'thank')
  thank.scale.setTo(4, 4)
  thank.smoothed = false
  thank.animations.add('party')
  thank.play('party', 4, true)
  game.physics.p2.enable(thank)

  invisibleWalls = []
  for (var i in invisibleWallCoordinates) {
    var invisibleWall = game.add.tileSprite(invisibleWallCoordinates[i][0] * 64, invisibleWallCoordinates[i][1] * 64, invisibleWallCoordinates[i][2] * 64, invisibleWallCoordinates[i][3] * 64, 'ground')
    game.physics.p2.enable(invisibleWall)
    invisibleWall.body.static = true
    invisibleWalls.push(invisibleWall)
  }

  blocks = []
  for (var i in blockPositions) {
    var block = game.add.sprite(blockPositions[i][0] * 64, blockPositions[i][1] * 64, 'block')
    block.anchor.set(0.5, 0.5)
    block.smoothed = false
    block.scale.setTo(4, 4)
    game.physics.p2.enable(block)
    block.body.fixedRotation = true
    blocks.push(block)
  }

  witches = []
  for (var i in witchPositions) {
    var witch = game.add.sprite(witchPositions[i][0] * 64, witchPositions[i][1] * 64, 'witch')
    witch.anchor.set(0.5, 0.5)
    witch.smoothed = false
    witch.animations.add('walk', [0, 1])
    witch.play('walk', 6, true)
    witch.scale.setTo(4, 4)
    game.physics.p2.enable(witch)
    witch.body.fixedRotation = true
    witch.gameType = 'witch'
    witches.push(witch)
  }
  sounds.music.play('', 0, 1, true, true)
}

function killAllSprites() {
  cowboy.destroy()
  thank.destroy()
  for (var i in witches) witches[i].destroy()
  for (var i in invisibleWalls) invisibleWalls[i].destroy()
  for (var i in blocks) blocks[i].destroy()
  blocks = invisibleWalls = witches = []
}

function update() {
  // game.scale.setGameSize(innerWidth, innerHeight)
  if (soundsLoaded) {

  for (var i in blocks) blocks[i].body.setRectangleFromSprite()
  thank.body.setRectangleFromSprite()
  for (var i in witches) if (!dead) witches[i].body.moveLeft(100)
  var cowboyTouchingDown = touchingDown(cowboy)

  if (cowboyTouchingDown) cowboy.body.velocity.x *= 0.86
  if (cursors.left.isDown && !cursors.right.isDown && !dead) cowboy.body.moveLeft(200)
  else if (cursors.right.isDown && !cursors.left.isDown && !dead) cowboy.body.moveRight(200)
  if (cursors.up.isDown && cowboyTouchingDown && !dead) {
    cowboy.body.moveUp(580)
    sounds.jump.play()
  }

  if (cowboy.body.velocity.x > 100 && cowboyTouchingDown && !dead) {
    cowboy.scale.x = 4
    cowboy.play('walk', 10, true)
  }
  else if (cowboy.body.velocity.x < -100 && cowboyTouchingDown && !dead) {
    cowboy.scale.x = -4
    cowboy.play('walk', 10, true)
  }
  else if (!dead) {
    cowboy.animations.stop()
    cowboy.frame = 0
  }

  }
}

function render() {

}

function touchingDown(someone) {
  var yAxis = p2.vec2.fromValues(0, 1)
  var result = false
  for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
    var c = game.physics.p2.world.narrowphase.contactEquations[i]
    if (c.bodyA === someone.body.data || c.bodyB === someone.body.data) {
      var d = p2.vec2.dot(c.normalA, yAxis)
      if (c.bodyA === someone.body.data) d *= -1
      if (d > 0.5) result = true
    }
  } return result;
}

function onPlayerCollision(body) {
  if (body) {

    if (body.sprite.gameType == 'witch' && !dead) {
      body.sprite.animations.stop()
      body.sprite.frame = 2
      if (cowboy.x > body.sprite.x) body.sprite.scale.x = -4
      dead = true
      sounds.witchKill.play()
      cowboy.play('die', 10)
      setTimeout(function() {
        cowboy.body.moveLeft(400)
        cowboy.body.moveUp(400)
        setTimeout(resetGame, 700)
      }, 700)
    }
    else if (Math.abs(cowboy.x - body.x) - 10 > Math.abs(cowboy.y - body.y) && !dead) {
      if (body.sprite.scale.x == 4) {
        game.add.tween(body.sprite.scale).to({x: 12, y: 12}, 1000, 'Elastic', true)
        sounds.enflate.play()
      }

      else if (body.sprite.scale.x == 12) {
        game.add.tween(body.sprite.scale).to({x: 4, y: 4}, 1000, 'Elastic', true)
        sounds.deflate.play()
      }
    }

  }
}

function resetGame() {
  killAllSprites()
  createSprites()
  dead = false
}
