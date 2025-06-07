//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

//plant
let plantWidth = tileSize; // 64px
let plantHeight = tileSize; // 32 px
let plantX = tileSize * columns / 2 - tileSize;
let plantY = boardHeight - tileSize * 3;
let plantVelocityX = tileSize;

let plant = {
    x : plantX,
    y : plantY,
    width : plantWidth,
    height : plantHeight
}

let plantImg;

 // zombies
 let zombieArray = [];
 let zombieWidth = tileSize; // 32px
 let zombieHeight = tileSize * 2; // 32px
 let zombieX = tileSize;
 let zombieY = tileSize;

 let zombieRows = 2;
 let zombieColumns = 3;
 let zombieCount = 0;
 let zombieVelocity = 1;

 let zombieImgArray = [];

 // peas
 let peaArray = [];
 let peaVelocityY = -10;

 let score = 0;
 let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    
    // draw initial plant
    // context.fillStyle="green";
    // context.fillRect(plant.x, plant.y, plant.width, plant.height);

    //load images
    plantImg = new Image();
    plantImg.src = "./Peashooter.png";
    plantImg.onload = function() {
        context.drawImage(plantImg, plant.x, plant.y, plant.width, plant.height);
    }

    zombieImg = new Image();
    zombieImg.src = "./zombie1.png";
    zombieImgArray.push(zombieImg);
    zombieImg = new Image();
    zombieImg.src = "./zombie2.png";
    zombieImgArray.push(zombieImg);
    zombieImg = new Image();
    zombieImg.src = "./zombie3.png";
    zombieImgArray.push(zombieImg);

    createZombies();
    
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveplant);
    document.addEventListener("keyup", shoot);
}

function update() {
    requestAnimationFrame(update);

    if(gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //plant
    context.drawImage(plantImg, plant.x, plant.y, plant.width, plant.height);

    //zombie
    moveZombies();

    //peas
    movePeas();

     // next level
    if (zombieCount == 0) {
        // increase number of zombies in columns and rows by 1
        score += zombieColumns * zombieRows * 100;
        zombieColumns = Math.min(zombieColumns + 1, columns - 6);
        zombieRows = Math.min(zombieRows + 1, rows / 2 - 2);
        zombieArray = [];
        peaArray = [];
        zombieVelocity = 1;
        createZombies();
    }

    //score
    context.fillStyle="white";
    context.font="16px courier";
    context.fillText(score, 5, 20);
}

function moveplant(e) {
    if(gameOver){
        return;
    }

    if (e.code == "ArrowRight" && plant.x + plant.width + plantVelocityX <= board.width) {
        plant.x += plantVelocityX;
    } else if ( e.code == "ArrowLeft" && plant.x - plantVelocityX >= 0) {
        plant.x -= plantVelocityX;
    }
    
}

function shoot(e) {
    // if (gameOver) {
    //     return;
    // }

    if (e.code == "Space") {
        //shoot
        let pea = {
            x : plant.x + plantWidth*15/32,
            y : plant.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        peaArray.push([pea]);
    }
}

function movePeas(){
    for (let i = 0; i < peaArray.length; i++) {
        let pea = peaArray[i];
        pea.y += peaVelocityY;
        context.fillStyle="green";
        context.fillRect(pea.x, pea.y, pea.width, pea.height);

        //pea collision with zombies
        for (let j = 0; j < zombieArray.length; j++) {
            let zombie = zombieArray[j];
            if (!pea.used && zombie.alive && detectCollision(pea, zombie)) {
                pea.used = true;
                zombie.alive = false;
                zombieCount--;
                score += 100;
            }
        }
    }

    //clear peas
    while (peaArray.length > 0 && (peaArray[0].used || peaArray[0].y < 0)) {
        peaArray.shift(); //removes the first element of the array
    }
}

function createZombies() {

        for (let r = 0; r < zombieRows; r++) {
            for (let c = 0; c < zombieColumns; c++) {
                    let randomNum = Math.floor(Math.random() * 4)
                    if(randomNum < 3){
                        let zombie = {
                            img : zombieImgArray[randomNum],
                            x : zombieX + c*zombieWidth,
                            y : zombieY + r*zombieHeight,
                            width : zombieWidth,
                            height : zombieHeight,
                            alive : true
                        }
                        zombieArray.push(zombie)
                    }
                
            }
        }
        zombieCount = zombieArray.length;
}

function moveZombies(){
    for(let i = 0; i < zombieArray.length; i++){
        let zombie = zombieArray[i];
        if(zombie.alive){
            let randomNum = Math.floor(Math.random() * 3)
        
            if (randomNum == 0) {
                zombie.y += zombieVelocity;
                if (zombie.x - 2 * zombieVelocity > 0)
                    zombie.x -= 2 * zombieVelocity;
            } else if (zombie.x + zombieVelocity + zombie.width < boardWidth) {
                zombie.x += zombieVelocity;
            }

            zombie.y += zombieVelocity - randomNum;
            context.drawImage(zombie.img, zombie.x, zombie.y, zombie.width, zombie.height);

            if(zombie.y >= plant.y){
                gameOver = true;
            }
        }
        
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}