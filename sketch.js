var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var logo

function preload(){
  trex_running = loadAnimation("minecraft 1.png","minecraft 2.png","minecraft 3.png");
  trex_collided = loadAnimation("steve.jpg");
  
  groundImage = loadImage("grass.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("steve.jpg");
  obstacle2 = loadImage("creeper.jpg");
  obstacle3 = loadImage("enderman.png");
  obstacle4 = loadImage("skeleton.webp");
  obstacle5 = loadImage("creeper.jpg");
  obstacle6 = loadImage("enderman.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  

  backgroundImg = loadImage("background.jpg")
  logoImg = loadImage("mc.png")

}

function setup() {
  createCanvas(windowWidth - 700,windowHeight);


  
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  
  ground = createSprite(width/2,height/2,width,20);
  ground.addImage("ground",groundImage);
  ground.scale = 4
  ground.x = ground.width /2;
  ground.width = 2*width

  logo = createSprite(width/2,100,50,30)
  logo.addImage(logoImg)
  



  gameOver = createSprite(600,400);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(600,450);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(500,height/2 + 400,1000,50);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,120,220);
  trex.debug = true

  ground.debug = true
  
  ground.setCollider("rectangle",0,150,500,100)
  


  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    
    if (ground.x < 100){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 775) {
        trex.velocityY = -14;
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        trex.velocityY = -12;
        gameState = END;


      
    }
    
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  gameState = PLAY
  score = 0
  trex.changeAnimation("running",trex_running)

}


function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(1200,800,10,40);
    obstacle.velocityX = -(6 + score/100);
        //generate random obstacles
        var rand = Math.round(random(1,5));
        switch(rand) {

          case 1: obstacle.addImage(obstacle2); obstacle.setCollider("rectangle",0,0,70,90)
                  break;
          case 2: obstacle.addImage(obstacle3); obstacle.setCollider("rectangle",0,0,70,90)
    
                  break;
          case 3: obstacle.addImage(obstacle4); obstacle.setCollider("rectangle",0,0,70,90)
                  break;
          case 4: obstacle.addImage(obstacle5); obstacle.setCollider("rectangle",0,0,70,90)
                  break;
          case 5: obstacle.addImage(obstacle6); obstacle.setCollider("rectangle",0,0,70,90)
                  break;
          default: break;
        }
      
       //assign scale and lifetime to the obstacle           
       obstacle.scale = 0.1;
       obstacle.lifetime = 3500
       obstacle.debug = true

       obstacle.setCollider("rectangle",0,0,100,150)


       obstaclesGroup.add(obstacle)

       obstaclesGroup.setColliderEach("rectangle",0,0,100,150)
 
      }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

