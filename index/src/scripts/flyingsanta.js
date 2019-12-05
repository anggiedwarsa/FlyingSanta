var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var playing  = false;
var gameover = false;
var requestId;

var santa = new Image();
var bg = new Image();
var fg = new Image();
var cAsapNorth = new Image();
var cAsapSouth = new Image();

santa.src = "images/santa_vector.png";
bg.src = "images/background_fixed.jpg";
cAsapNorth.src = "images/CAflip.png";
cAsapSouth.src = "images/CA.png";

var woof = new Audio();
var yess = new Audio();
var nonono = new Audio();

woof.src = "sounds/woof.mp3";
yess.src = "sounds/yess.mp3";
nonono.src = "sounds/nonono.mp3";

var gap = 150;
var constant;
var bX;
var bY;
var gravity;
var score;
var cAsap;

document.body.onkeyup = function(e){
  if(e.keyCode == 38){
    if(gameover){
      playing = false;
      init();
      cancelAnimationFrame(requestId);
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      draw();
      gameover = false;
    }
  }
  else if(e.keyCode == 77){
    playing = true;
  }
  else{
    playing=false;
  }
}

document.addEventListener("keydown",moveUp);

function moveUp(){
  if(playing && !gameover){
    bY -= 25;
    woof.play();
  }
}

function init(){
  bX = 20;
  bY = 100;
  gravity = 1.5;
  score = 0;
  cAsap = [];
  cAsap[0] = {
    x : cvs.width,
    y : 0
  };
}

// draw images

function draw(){

  ctx.drawImage(bg,0,0);

  drawSnow();


  for(var i = 0; i < cAsap.length; i++){
    constant = cAsapNorth.height+gap;
    ctx.drawImage(cAsapNorth,cAsap[i].x,cAsap[i].y);
    ctx.drawImage(cAsapSouth,cAsap[i].x,cAsap[i].y+constant);

    if(playing){
      cAsap[i].x--;
    }

    if(cAsap[i].x == 100){
      cAsap.push({
          x : cvs.width,
          y : Math.floor(Math.random()*cAsapNorth.height)-cAsapNorth.height
      });
    }

    // detect collision

    if( bX + santa.width >= cAsap[i].x && bX <= cAsap[i].x + cAsapNorth.width && (bY <= cAsap[i].y + cAsapNorth.height || bY+santa.height >= cAsap[i].y+constant) || bY + santa.height >=  cvs.height || bY<=0){
      // location.reload(); // reload the page
      gameover = true;
      playing = false;
      nonono.play();
      ctx.fillStyle = "#ff0000";
      ctx.font = "40px Verdana";
      ctx.fillText("Game Over",(cvs.width/2)-120,cvs.height/2);
      ctx.fillText("Press Key Up to Restart",(cvs.width/2)-220, (cvs.height/2)+50);
      cancelAnimationFrame(requestId);
    }

    if(cAsap[i].x == 5){
      score++;
      yess.play();
    }


  }

  ctx.drawImage(santa,bX,bY);

  if(playing){
    bY += gravity;
  }

  ctx.fillStyle = "#fff";
  ctx.font = "20px Verdana";
  ctx.fillText("Score : "+score,10,cvs.height-20);

  requestId = requestAnimationFrame(draw);

}
init();
draw();




var mp = 150;
var particles = [];
var W = cvs.width;
var H = cvs.height;
for(var i = 0; i < mp; i++)
{
  particles.push({
    x: Math.random()*W, //x-coordinate
    y: Math.random()*H, //y-coordinate
    r: Math.random()+1, //radius
    d: Math.random()*mp //density
  })
}


function drawSnow(){

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  for(var i = 0; i < mp; i++)
  {
    var p = particles[i];
    ctx.moveTo(p.x, p.y);
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
  }
  ctx.fill();
  updateSnow();
}

var angle = 0;
function updateSnow(){
  angle+=0.01;
  for(var i = 0; i < mp; i++)
  {
    var p = particles[i];

    p.y += Math.cos(angle+p.d) + 1 + p.r/2;
    p.x += Math.sin(angle) * 2;

    if(p.x > W+5 || p.x < -5 || p.y > H)
    {
      if(i%3 > 0) //66.67% of the flakes
      {
        particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
      }
      else
      {
        //If the flake is exitting from the right
        if(Math.sin(angle) > 0)
        {
          //Enter from the left
          particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
        }
        else
        {
          //Enter from the right
          particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
        }
      }
    }
  }
}
