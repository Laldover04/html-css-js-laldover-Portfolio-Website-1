//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

//plant
let plantWidth = tileSize;
let plantHeight = tileSize;
let plantX = tileSize * columns/2 - tileSize;
let plantY = tileSize * rows - tileSize*2;

let plant = {
    x : plantX,
    y : plantY,
    width : plantWidth,
    height : plantHeight
}

let plantImg;
let plantVelocityX = tileSize; //plant moving speed

//zombies
let zombieArray = [];
let zombieWidth = tileSize;
let zombieHeight = tileSize*2;
let zombieX = tileSize;
let zombieY = tileSize;
let zombieImg;

let zombieRows = 2;
let zombieColumns = 3;
let zombieCount = 0; //number of zombies to defeat
let zombieVelocityX = 1; //zombie moving speed

let zombieImgArray = [];

//peas
let peaArray = [];
let peaVelocityY = -10; //pea moving speed

let score = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial plant

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
    createzombies();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveplant);
    document.addEventListener("keyup", shoot);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //plant
    context.drawImage(plantImg, plant.x, plant.y, plant.width, plant.height);

    //zombie
    moveZombies();

    //peas
    movePeas();

    //next level
    if (zombieCount == 0) {
        //increase the number of zombies in columns and rows by 1
        score += zombieColumns * zombieRows * 100; //bonus points :)
        zombieColumns = Math.min(zombieColumns + 1, columns/2 -2); //cap at 16/2 -2 = 6
        zombieRows = Math.min(zombieRows + 1, rows-4);  //cap at 16-4 = 12
        if (zombieVelocityX > 0) {
            zombieVelocityX += 0.2; //increase the zombie movement speed towards the right
        }
        else {
            zombieVelocityX -= 0.2; //increase the zombie movement speed towards the left
        }
        zombieArray = [];
        peaArray = [];
        createzombies();
    }

    //score
    context.fillStyle="white";
    context.font="16px courier";
    context.fillText("Score:" + score + "\n Zombies:" + zombieCount, 5, 20);
}

function moveZombies(){
    for (let i = 0; i < zombieArray.length; i++) {
        let zombie = zombieArray[i];
        if (zombie.alive) {
            let randomNum = Math.floor(Math.random() * 3)
            if(randomNum > 1)
             zombie.y += randomNum - 1;

            //random movement left or right
            zombie.x += (zombieVelocityX - randomNum)

            //if zombie touches the borders
            if (zombie.x + zombie.width >= board.width) {
                zombie.x -= zombieVelocityX;
            } else if (zombie.x <= 0) {
                zombie.x += zombieVelocityX;
            }
            context.drawImage(zombie.img, zombie.x, zombie.y, zombie.width, zombie.height);

            if (zombie.y >= plant.y) {
                gameOver = true;
            }
        }
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

function moveplant(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "ArrowLeft" && plant.x - plantVelocityX >= 0) {
        plant.x -= plantVelocityX; //move left one tile
    }
    else if (e.code == "ArrowRight" && plant.x + plantVelocityX + plant.width <= board.width) {
        plant.x += plantVelocityX; //move right one tile
    }
}

function createzombies() {
    for (let r = 0; r < zombieRows; r++) {
        for (let c = 0; c < zombieColumns; c++) {
                let randomNum = Math.floor(Math.random() * 4)
                if(randomNum < 3){
                    let zombie = {
                        img : zombieImgArray[randomNum],
                        x : zombieX + c*zombieWidth,
                        y : zombieY - (r + 1)*zombieHeight,
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

function shoot(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "Space") {
        //shoot
        let pea = {
            x : plant.x + plantWidth*15/32,
            y : plant.y,
            width : tileSize/4,
            height : tileSize/4,
            used : false
        }
        peaArray.push(pea);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}