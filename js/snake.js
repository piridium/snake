var canvas;
var resolution = 32;
var snake, fruit, dead;
var direction = 'down';
var speed = 16;
var lock;

$(document).ready(function(){
  canvas = $('#canvas');
  snake = [0];
  fruit = [];
  console.log("canvas width : " + canvas.width() + " | canvas.height : " + canvas.height());
  
  (function loop() {
    moveSnake(false);
    placeFruit();
    draw();
    setScore();
    if (!dead){ setTimeout(loop, 1000/speed);}
  })();

});

document.onkeydown = function(e) { // receive keyboard input
  if (dead){ return };
  if (!lock){
    switch(e.which) {
      case 37: // left
      direction = (direction != 'right') ? 'left' : 'right';
      break;
      case 38: // up
      direction = (direction != 'down') ? 'up' : 'down';
      break;
      case 39: // right
      direction = (direction != 'left') ? 'right' : 'left';
      break;
      case 40: // down
      direction = (direction != 'up') ? 'down' : 'up';
      break;
      default: return;
    }
    lock = true;
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
};

function moveSnake(grow){
  // self-collision - detected one step too late, but thats 'völligegal'
  tail = [...snake];
  tail.shift();
  // console.log('head: ' + snake[0] + ' tail: ' +tail);
  if (jQuery.inArray(snake[0], tail) !== -1){
    dead = true;
    direction = 'stop';
  }  
  // eat
  if (snake[0] == fruit){
    grow = true;
    fruit = [];
  }
  head = new position(snake[0]);
  switch (direction){ // grow snake at head
    case 'up':
      snake.unshift(head.up);
      break;
    case 'right':
      snake.unshift(head.right);
      break;
    case 'down':
      snake.unshift(head.down);
      break;
    case 'left':
      snake.unshift(head.left);
      break;
    default:
      snake.unshift(head.stay);
  }
  if (!grow){
    snake.pop(); // delete tail
  } else {
    grow = false; // reset grow
  }
}

function draw(){
  // draw snake
  canvas.find('.snake-segment').remove();
  snake.forEach(function(pos,index){
    segment = new position(pos);
    classes = ['snake-segment'];
    if (index==0){ classes.push('snake-head') };
    if (dead){ classes.push('dead')};
    canvas.append('<div class="' + classes.join(' ') + '" style="' + segment.xPos + segment.yPos + segment.width + segment.height + '"></div>');
    // console.log('snake element '+index+' at pos '+pos+' drawn');
  });
  // draw fruit
  canvas.find('.fruit').remove();
  segment = new position(fruit);
  canvas.append('<div class="fruit" style="' + segment.xPos + segment.yPos + segment.width + segment.height + '"></div>');
  // release lock
  lock = false;
}

function placeFruit(){
  if (fruit.length === 0){
    const allSites = Array.from({length: resolution*resolution}, (item, index) => index);
    let freeSites = allSites.filter(x => !snake.includes(x));
    // pick random
    fruit = freeSites[getRandomInt(0, freeSites.length)];
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setScore(){
  var score = snake.length - 2;
  $('#score').text('score ' + score + ' | size ' + resolution + 'x' + resolution + ' | speed ' + speed);
}

class position {
  constructor(i){
    this.i = i;
  }
  get xPos(){
    return 'left:' + (this.i%resolution) * this.calcWidth() + 'px;';
  }
  get yPos(){
    return 'top:' + (Math.floor(this.i/resolution)) * this.calcHeight() + 'px;';
  }
  get width(){
    return 'width:' + this.calcWidth() + 'px;';
  }
  get height(){
    return 'height:' + this.calcWidth() + 'px;';
  }
  get right(){
    return ((this.i+1)%resolution != 0 ? this.i+1 : this.i+1-resolution);
    // return ((this.i)+1 < resolution*resolution ? this.i+1 : 0);
  }
  get left(){
    return (this.i%resolution != 0 ? this.i-1 : this.i-1+resolution);
  }
  get up(){
    return (Math.floor(this.i/resolution) != 0 ? this.i-resolution : this.i+resolution*(resolution-1));
  }
  get down(){
    return (Math.floor(this.i/resolution) != resolution-1 ? this.i+resolution : this.i-resolution*(resolution-1));
  }
  get stay(){
    return this.i;
  }
  calcWidth(){
    return (canvas.width()/resolution);
  }
  calcHeight(){
    return (canvas.height()/resolution);
  }
}