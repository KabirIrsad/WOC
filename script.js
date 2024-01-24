import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref, child, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyARJ1qldMhgGK1jNOtlhAkedfaoJ6n69IA",
    authDomain: "blazeburst-a790b.firebaseapp.com",
    databaseURL: "https://blazeburst-a790b-default-rtdb.firebaseio.com",
    projectId: "blazeburst-a790b",
    storageBucket: "blazeburst-a790b.appspot.com",
    messagingSenderId: "958357916417",
    appId: "1:958357916417:web:5a45aeeb902c5dcb2be900"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
const dbRef = ref(db);

function startGame(){

const gameStart = document.getElementById('gameStart');
gameStart.style.display = 'none';
const gameOver1 = document.getElementById('gameOver');
gameOver1.style.display = 'none';

document.body.style.cursor = 'none';

const canvas = document.getElementById("canvas1");
canvas.style.display = 'block';
const ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 700;

let gameFrame = 0;

const background = new Image();
background.src = "background.png";

const backgroundMusic = new Audio();
backgroundMusic.src = "music.wav";

const crosshair = document.getElementById('crosshair');

class Game {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.enemies = [];
    this.enemyInterval = 800;
    this.enemyTimer = 0;
    this.enemyTypes = ['worm', 'ghost', 'spider'];
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'white';
    this.ctx.font = '30px Impact';
    this.ctx.textBaseline = 'middle';
    this.score;
    this.lives;
    this.image = new Image();
    this.image.src = 'lives.png';
    this.gameOver;
    this.time = 0;
    this.timeInterval = 80;
    this.maxTime = 100;

    this.mouse = {
      x : undefined,
      y : undefined,
      width : 10,
      height : 10,
      pressed : false,
      fired : false,
    }

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.start();

    window.addEventListener('mousedown', e => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = true;
      this.mouse.fired = false;
    })
    window.addEventListener('mouseup', e => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = false;
    })
  }
  start() {
    this.score = 0;
    this.lives = 5;
    this.gameOver = false;
  }
  checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
  }
  update(deltaTime) {
      if (gameFrame % this.timeInterval == 0){
        this.time++;
      }
      if (this.time >= this.maxTime) this.gameOver = true;
      this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval){
          this.#addNewEnemies();
          this.enemyTimer = 0;
      } else {
          this.enemyTimer += deltaTime;
      }
      this.enemies.forEach(enemy => enemy.update(deltaTime));
  }
  draw() {
      this.enemies.forEach(enemy => enemy.draw(this.ctx));
  }
  #addNewEnemies() {
      const randomEnemy = this.enemyTypes[Math.floor(Math.random() * 3)];
      if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
      else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
      else if (randomEnemy == 'spider') this.enemies.push(new Spider(this));
  }
  drawStatusText(){
    this.ctx.save();
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('Score: ' + this.score, 20, 40);
    for (let i = 0; i < this.lives; i++){
      this.ctx.drawImage(this.image, 20 + 30 * i, 60, 30, 30);
    }
    this.ctx.fillText('Timer: ' + this.time + 's', 1050, 40);
    this.ctx.restore();
  }
}

let keyA = false;
let keyD = false;

class Player {
  constructor(){
    this.x = 550;
    this.y = 582;
    this.velocity = 0;
    this.image = new Image();
    this.image.src ='pistol.png';
    this.spriteWidth = 100;
    this.spriteHeight = 138;
    this.width = this.spriteWidth * 1.3 ;
    this.height = this.spriteHeight ;
    this.frame = 0;
    this.speed = 2;
    this.sound = new Audio();
    this.sound.src = 'shoot.wav';

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "d":
          keyD = true;
          break;
        case "a":
          keyA = true;
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "d":
          keyD = false;
          break;
        case "a":
          keyA = false;
          break;
      }
    });
  }
  draw() {
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - 22, this.y-138, this.width *1.6, this.height*2);
  }
  update(deltaTime) {
    this.x += this.velocity * deltaTime;
    if (keyD && this.x + this.width < canvas.width + 30) {
      this.velocity = 1;
    } else if (keyA && this.x > 0) {
      this.velocity = -1;
    } else {
      this.velocity = 0;
    }
    if (game.mouse.pressed) {
      if (gameFrame % this.speed == 0) {
        this.frame >= 3 ? (this.frame = 0) : this.frame++;
      }
    } else {
      this.frame = 0;
    }
    if (game.mouse.pressed) this.sound.play();
  }
}

class Enemy {
  constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
      this.frameX;
      this.maxFrame = 5;
      this.frameInterval = 100;
      this.frameTimer = 0;
      this.lives;
      this.x;
      this.y;
      this.width;
      this.height;
  }
  update(deltaTime) {
      this.x -= this.speed * deltaTime;
      if (this.x < 0 - this.width) this.markedForDeletion = true;
      if (this.frameTimer > this.frameInterval){
        if (this.frameX < this.maxFrame) this.frameX++;
        else this.frameX = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      if (this.game.checkCollision(this, this.game.mouse) && this.game.mouse.pressed && !this.game.mouse.fired){
        this.lives--;
        this.game.mouse.fired = true;
      }
      if (this.lives < 1){
        this.markedForDeletion = true;
        this.game.score++;
        explosions.push(new Explosions(this.x, this.y, this.width));
      }
  }
  draw(ctx) {
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        this.game.ctx.fillText(this.lives, this.x + this.width * 0.425, this.y + this.height * 0.01);
  }
}

class Worm extends Enemy {
  constructor(game){
      super(game);
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth/2.5;
      this.height = this.spriteHeight/2.5;
      this.x = this.game.width;
      this.y = this.game.height - (this.height + 115);
      this.image = worm;
      this.speed = Math.random() * 0.1 + 0.1;
      this.lives = 2;
  }
}

class Ghost extends Enemy {
  constructor(game){
      super(game);
      this.spriteWidth = 293;
      this.spriteHeight = 155;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.5;
      this.width = this.spriteWidth/2.5;
      this.height = this.spriteHeight/2.5;
      this.image = ghost;
      this.speed = Math.random() * 0.2 + 0.1;
      this.angle = 0;
      this.curve = Math.random() * 3;
      this.lives = 2;
      this.projectileInterval = Math.floor(Math.random() * 30 + 80);
  }
  shoot(enemyProjectiles){
    enemyProjectiles.push(new EnemyProjectile(this.x + this.width * 0.5, this.y + this.height * 0.8, Math.random() * 5 + 2));
  }
  update(deltaTime){
    super.update(deltaTime);
    this.y += Math.sin(this.angle) * this.curve;
    this.angle += 0.04;
    if (gameFrame % this.projectileInterval == 0){
      this.shoot(enemyProjectiles);
    }
  }
}

class Spider extends Enemy {
  constructor(game){
      super(game);
      this.spriteWidth = 120;
      this.spriteHeight = 144;
      this.width = this.spriteWidth/1.7;
      this.height = this.spriteHeight/1.7;
      this.x = Math.random() * (this.game.width - this.width * 2) + this.width;
      this.y = 0 - this.height;
      this.image = spider;
      this.speed = 0;
      this.speedY = Math.random() * 0.2 + 3;
      this.maxLength = Math.random() * (this.game.height - this. height - 200) + 100;
      this.lives = 1;
  }
  update(deltaTime){
      super.update(deltaTime);
      if (this.y < 0 - this.height * 2) this.markedForDeletion = true;
      this.y += this.speedY;
      if (this.y > this.maxLength) this.speedY *= -1;
  }
  draw(ctx){
      ctx.beginPath();
      ctx.moveTo(this.x + this.width/2, 0);
      ctx.lineTo(this.x + this.width/2, this.y + 50);
      ctx.stroke();
      super.draw(ctx);
  }
}

let explosions = [];
class Explosions {
  constructor(x, y, size){
    this.image = new Image();
    this.image.src = 'explosion.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = 'boom.wav';
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.explosionDeletion = false;
  }
  update(deltaTime){
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval){
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.explosionDeletion = true;
    }
    explosions = explosions.filter(explosion => !explosion.explosionDeletion);
  }
  draw(){
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size);
  }
}

let enemyProjectiles = [];
class EnemyProjectile {
  constructor(x, y, velocity){
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.image = new Image();
    this.image.src = 'projectile.png';
    this.spriteWidth = 105;
    this.spriteHeight = 163;
    this.projectileDeletion = false;
    this.deletion = false;
    this.sound = new Audio();
    this.sound.src = 'hurt.wav';

    this.width = this.spriteWidth / 3;
    this.height = this.spriteHeight / 3;
  }
  draw(){
    ctx.drawImage(this.image, 0, 0, this.spriteHeight, this.spriteHeight, this.x, this.y, this.width * 1.6, this.height);
  }
  update(){
    this.draw();
    this.y += this.velocity;
    if (game.checkCollision(player, this)){
        this.projectileDeletion = true;
      }
    enemyProjectiles = enemyProjectiles.filter(enemyProjectile => !enemyProjectile.projectileDeletion);
    if (this.projectileDeletion) {
      game.lives--;
      this.sound.play();
      if (game.lives < 1) game.gameOver = true;
    }
    if (this.y > game.height){
      this.deletion = true;
    }
    enemyProjectiles = enemyProjectiles.filter(enemyProjectile => !enemyProjectile.deletion);
  }
}

const game = new Game(ctx, canvas.width, canvas.height);

const player = new Player();

let lastTime = 1;

function animate(timeStamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(background, 0, 0);

  ctx.drawImage(crosshair, game.mouse.x, game.mouse.y, 40, 40);

  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  game.update(deltaTime);
  game.draw();
  game.drawStatusText();
  explosions.forEach(object => object.update(deltaTime));
  explosions.forEach(object => object.draw());
  player.update(deltaTime);
  player.draw();
  enemyProjectiles.forEach(object => object.update());

  gameFrame++;

  if (!game.gameOver) {
    backgroundMusic.play();
    requestAnimationFrame(animate);
  }

  if (game.gameOver) {
    backgroundMusic.pause();
    canvas.style.display = 'none';
    document.body.style.cursor = 'default';
    document.getElementById('gameOver').style.display = 'block';

    let gameOverText = document.createElement('p');

    sessionStorage.setItem('score', game.score);

    if (game.score > 10){
      gameOverText.textContent = 'Boo-yah Well Played. Your Score is ' + game.score;
    } else {
      gameOverText.textContent = 'Better Luck Next Time. Your Score is ' + game.score;
    }

    gameOver1.insertBefore(gameOverText, gameOver1.children[1]);

  }

};
animate(0);
}

const score = sessionStorage.getItem('score');

let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

const currentHighScore = UserInfo.score;

document.getElementById("start").addEventListener("click",startGame);

onAuthStateChanged(auth,(user)=>{

  update(ref(db, 'UserAuthList/' + user.uid), {
    score: score
  });

})



