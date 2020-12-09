var canvas;
var snake, dead;
var resolution = 32;
var speed = 16;
var direction = 'down';
var lock;

$(document).ready(function(){
  $("span[contenteditable]").keypress(function (evt) {
    var keycode = evt.charCode || evt.keyCode;
    if (keycode  == 13) { return false; }
  });

  $('#go').click(function(){
    speed = parseInt($('#speed').text());
    resolution = parseInt($('#size').text());
    initSnake();
  })
});

function initSnake(){
  canvas = $('#canvas');
//  snake = [200,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100];
  snake = [200,201];
  fruit = [];
  console.log("canvas width : " + canvas.width() + " | canvas.height : " + canvas.height());
  
  (function loop() {
    moveSnake();
    placeFruit();
    setScore();
    if (!dead){ setTimeout(loop, 1000/speed);}
  })();
}

function moveSnake(){
  // self-collision - detected one step too late, but thats 'völligegal'
  tail = [...snake];
  tail.shift();
  // console.log('head: ' + snake[0] + ' tail: ' +tail);
  if (jQuery.inArray(snake[0], tail) !== -1){
    dead = true;
    canvas.addClass('dead');
    direction = 'stop';
  }  
  // eat
  if (snake[0] == fruit){
    var grow = true;
    fruit = [];
  }
  head = new position(snake[0]);
  switch (direction){ // grow snake at head
    case 'up':
      snake.unshift(head.up);
      draw('draw',head.up);
      break;
    case 'right':
      snake.unshift(head.right);
      draw('draw',head.right);
      break;
    case 'down':
      snake.unshift(head.down);
      draw('draw',head.down);
      break;
    case 'left':
      snake.unshift(head.left);
      draw('draw',head.left);
      break;
    default:
      snake.unshift(head.stay);
  }
  if (!grow){
    draw('erase',snake[snake.length-1]);
    snake.pop(); // delete tail
  } else {
    grow = false; // reset grow
  }
}

function draw(mode, pos){

  if (mode == 'draw'){ // add head
    segment = new position(pos);
    classes = ['snake-segment'];
    canvas.prepend('<div id="' + pos + '" class="' + classes.join(' ') + '" style="' + segment.xPos + segment.yPos + segment.width + segment.height + '"></div>');
    canvas.find('.snake-head').remove();
    segment = new position(snake[0]);
    classes = ['snake-segment snake-head'];
    canvas.prepend('<div id="' + pos + '" class="' + classes.join(' ') + '" style="' + segment.xPos + segment.yPos + segment.width + segment.height + '"></div>');
  } else if (mode == 'erase'){ // cut tail
    id = '#'+pos
    canvas.find(id).remove();
  } else if (mode == 'fruit'){ // draw fruit
    canvas.find('.fruit').remove();
    segment = new position(fruit);
    canvas.append('<div class="fruit" style="' + segment.xPos + segment.yPos + segment.width + segment.height + '"></div>');
  } else {
    console.log('unknown draw mode');
  }
  // release lock
  lock = false;
}

function placeFruit(){
  if (fruit.length === 0){
    const allSites = Array.from({length: resolution*resolution}, (item, index) => index);
    let freeSites = allSites.filter(x => !snake.includes(x));
    // pick random
    fruit = freeSites[getRandomInt(0, freeSites.length)];
    draw('fruit',fruit);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setScore(){
  var score = snake.length - 2;
  stats = [];
  stats.push('<div class="score">score '+score+'</div>');
  stats.push('<div>speed '+speed+'</div>');
  stats.push('<div>size '+resolution+'</div>');

  // $('#score').text('score ' + score + ' | size ' + resolution + 'x' + resolution + ' | speed ' + speed);
  $('#score').html(stats.join('<div class="divider">&nbsp;|&nbsp;</div>'));
}

function triggerPanic(){
  window.location.href='https://en.wikipedia.org/wiki/Snake_(video_game_genre)';
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
      case 32: // space
        triggerPanic();
        break; 
      default:
        return;
    }
    lock = true;
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
};
