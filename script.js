let flagGame = true; // true = no ha perdido, false = ya perdió el pájaro
let flagState = false; // True = el juego ha comenzado, false = el juego aún no ha comenzado
let gravityInterval;
let playGame;
let namePlayer;
let bird;
let gravedad;
let positionBird;
let gameContainer = document.querySelector(".game-container");
let scorePlayer = 0;
let pipeMoveInterval;
let pipeMoveIntervalTop;
let allPipesTop=document.querySelectorAll(".pipeTop");
let scoreInterval;
let scoreTimeOut;

// Start Game
document.querySelector(".btnStart").addEventListener("click", () => {
  namePlayer = document.querySelector(".name").value;
  if (namePlayer !== "") {
    document.querySelector(".namePlayer").textContent = namePlayer;
    document.querySelector(".darkBackground").style.display = "none";
    document.querySelector(".spanStart").style.display = "none";

    setTimeout(() => {
      flagState = true;
      gravityInterval = setInterval(gravity, 7);
      playGame = setInterval(generatePipes, 1500);
      scoreTimeOut = setTimeout(scorePlayerTimeOut, 4500);
    }, 10);
  } else {
    alert("Debes ingresar un nombre");
  }
});

function restartGame(){
  clearInterval(gravityInterval);
  clearInterval(playGame);
  clearInterval(pipeMoveInterval);
  clearInterval(pipeMoveIntervalTop);
  clearInterval(scoreInterval);
  clearTimeout(scoreTimeOut);
  
  const pipes = document.querySelectorAll('.pipe');
  const pipesTop = document.querySelectorAll('.pipeTop');
  
  pipes.forEach((pipe) => {
    pipe.remove();
  });
  
  pipesTop.forEach((pipeTop) => {
    pipeTop.remove();
  });
  
  bird.style.top = '45%';
  flagState = true;
  flagGame = true;
  gravityInterval = setInterval(gravity, 7);
  playGame = setInterval(generatePipes, 1500);
  scoreTimeOut = setTimeout(scorePlayerTimeOut, 4500);
  scorePlayer = 0;
  document.querySelector(".scorePlayer").textContent = "Score: "+ scorePlayer;
}


function checkCollisionTop() {
  const bird = document.getElementById("bird");
  const birdRect = bird.getBoundingClientRect();
  const birdWidth = birdRect.width;
  const birdHeight = birdRect.height;

  const pipes = document.querySelectorAll(".pipe");
  const pipesTop = document.querySelectorAll(".pipeTop");

  pipes.forEach((pipe, index) => {
    const pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.right > pipeRect.left &&
      birdRect.left < pipeRect.right &&
      (
        (birdRect.top < pipeRect.top && birdRect.bottom > pipeRect.top) ||
        (birdRect.top < pipeRect.bottom && birdRect.bottom > pipeRect.bottom)
      )
    ) {
      // console.log("Perdiste!");
      bird.style.top = "97%";
      gameOver();
    }
  });
}

function checkCollisionBottom(){
  let pipesTop = document.querySelectorAll(".pipeTop");
  let pipes = document.querySelectorAll(".pipe");
  let bird = document.querySelector(".bird");



  for(let i=0 ;i<pipesTop.length;i++){
    // bird.style.top = gameContainer.offsetHeight - pipesTop.item(i).offsetHeight-bird.offsetHeight+"px";

    if(bird.offsetTop > (gameContainer.offsetHeight - pipesTop.item(i).offsetHeight-bird.offsetHeight)+10 
      && (pipesTop.item(i).offsetLeft - bird.offsetLeft <= 42 && pipesTop.item(i).offsetLeft - bird.offsetLeft > -70)){
      // console.log("Perdiste!");
      bird.style.top = "97%";
      gameOver();
    }

    if(bird.offsetTop <= pipes.item(i).offsetHeight - 20 
    &&(pipes.item(i).offsetLeft - bird.offsetLeft <= 42 && pipes.item(i).offsetLeft - bird.offsetLeft > 0) ){
      // console.log("Perdiste!");
      bird.style.top = "97%";
      gameOver();
    }
    
    // console.log(pipesTop.item(i).offsetHeight);
    // console.log(bird.offsetTop);
  }
}

// checkCollisionBottom();

function spawnGameOver(){
  document.querySelector(".darkBackground").style.display = "flex";
  document.querySelector(".spawnFinished").style.display ="flex";
  document.querySelector(".scorePlayerFinish").textContent = "Score: "+ scorePlayer;
  document.querySelector(".spawnFinished").style.animation = "finished 1s ease-in-out forwards";
}

document.querySelector(".btnRestart").addEventListener("click" , ()=>{
  document.querySelector(".darkBackground").style.display = "none";
  document.querySelector(".spawnFinished").style.display ="none";
  
  restartGame();
});

document.querySelector(".btnRanking").addEventListener("click", () =>{
  document.getElementById("namePlayerDB").value = namePlayer;
  document.getElementById("scorePlayerDB").value = scorePlayer;
  window.location.href = '/Flappy%20Bird/rank/rank.php';
});


function gameOver() {
  bird = document.getElementById("bird");
  positionBird = bird.offsetTop;

  if (positionBird >= 485) {
    // console.log("Perdiste!");
    clearInterval(gravityInterval);
    clearInterval(playGame);
    clearInterval(pipeMoveInterval);
    clearInterval(pipeMoveIntervalTop);
    clearInterval(scoreInterval);
    clearTimeout(scoreTimeOut);
    bird.style.top = "97%";
    flagGame = false;
    spawnGameOver();
  }
}

function gravity() {
  gravedad = 1.2;
  bird = document.getElementById("bird");
  positionBird = bird.offsetTop;
  bird.style.top = positionBird + gravedad + "px";

  gameOver();
}

document.querySelector(".game-container").addEventListener("click", () => {
  if (flagGame && flagState) {
    gravedad = 50;
    bird = document.getElementById("bird");
    positionBird = bird.offsetTop;
    bird.style.top = positionBird - gravedad + "px";

    document.getElementById("bird").style.transform = "rotate(-25deg)";
  }
});

document.querySelector(".game-container").addEventListener("mouseup", () => {
  setTimeout(() => {
    document.getElementById("bird").style.transition = "transform .2s linear";
    document.getElementById("bird").style.transform = "rotate(0deg)";
  }, 150);
});

let gameSpeed = 2; // Velocidad de movimiento de los tubos

function generatePipes() {
  let minHeight = 80;
  let maxHeight = 300;
  let pipeHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  let saveHeightPipe = pipeHeight;

  const pipe = document.createElement('div');
  pipe.classList.add('pipe');
  pipe.style.position = "absolute";
  pipe.style.left = gameContainer.offsetWidth + 'px';
  pipe.style.height = pipeHeight + 'px';
  gameContainer.appendChild(pipe);

  function movePipes() {
    const pipeLeft = parseInt(pipe.style.left);
    if (pipeLeft <= -pipe.offsetWidth) {
      pipe.remove();
      clearInterval(pipeMoveInterval);
      return;
    }

    if (positionBird >= 485) {
      // console.log("Perdiste!");
      clearInterval(gravityInterval);
      clearInterval(playGame);
      clearInterval(pipeMoveInterval);
      clearInterval(pipeMoveIntervalTop);
      bird.style.top = "97%";
      flagGame = false;
    }
    checkCollisionTop();
    checkCollisionBottom();
    pipe.style.left = pipeLeft - gameSpeed + 'px';
  }

  const pipeMoveInterval = setInterval(movePipes, 10);

  const pipeTop = document.createElement('div');
  pipeTop.classList.add('pipeTop');
  pipeTop.style.position = "absolute";
  pipeTop.style.left = gameContainer.offsetWidth + 'px';
  pipeTop.style.height = (gameContainer.offsetHeight - saveHeightPipe - 120) + 'px';
  gameContainer.appendChild(pipeTop);

  function movePipesTop() {
    const pipeLeft = parseInt(pipeTop.style.left);
    if (pipeLeft <= -pipeTop.offsetWidth) {
      pipeTop.remove();
      clearInterval(pipeMoveIntervalTop);
      return;
    }

    if (positionBird >= 485) {
      // console.log("Perdiste!");
      clearInterval(gravityInterval);
      clearInterval(playGame);
      clearInterval(pipeMoveInterval);
      clearInterval(pipeMoveIntervalTop);
      bird.style.top = "97%";
      flagGame = false;
    }
    pipeTop.style.left = pipeLeft - gameSpeed + 'px';
  }

  const pipeMoveIntervalTop = setInterval(movePipesTop, 10);

}

function sumScore(){
  scorePlayer++; 
  document.querySelector(".scorePlayer").textContent = "Score: " + scorePlayer;
  
}

function scorePlayerTimeOut(){
  scorePlayer++;
  document.querySelector(".scorePlayer").textContent = "Score: " + scorePlayer;
  scoreInterval = setInterval(sumScore, 1400);
}


document.querySelector(".containerRanking").addEventListener("click", () =>{
  window.location.href = '/Flappy%20Bird/rank/rank.php';

});

document.querySelector(".titleGame").addEventListener("click", () =>{
  window.location.href = '/Flappy%20Bird/inicio.php';
});

// let imageSkins = document.querySelectorAll(".imageSkin");
// let listSkin = document.querySelectorAll(".skin");
// let birdSkin;

// for(let i = 0; i < listSkin.length; i++){
//   listSkin.item(i).addEventListener("click", () =>{
//     birdSkin = imageSkins.item(i).src;
//     birdSkin = birdSkin.replace('http://127.0.0.1:5500','');
    
//     document.querySelector('.bird').style.backgroundImage =`url(${birdSkin})`;
//     console.log(birdSkin);
//   });
// }
