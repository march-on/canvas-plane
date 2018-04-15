
var context;
var bgObj,planeObj;
var bulletArr =[];    //子弹容器
var rockArr=[];       //岩石容器
var Lose = false;
var counter;
var sourceX=0;
var boomImage = new Image();
boomImage.src="images/explosionEnemy.png";
var key ={
    keyLeft:37,
    keyUp:38,
    keyRight:39,
    keyDown:40,
    keySpace:32,
    keyF5:116
};

$(function(){
    context =$("#canvas")[0].getContext("2d");
    BackGround.prototype = new GameObject();
    Plane.prototype = new GameObject();
    Bullet.prototype = new GameObject();
    Rock.prototype = new GameObject();
    Over.prototype = new GameObject();
    over = new Over();
    bgObj=new BackGround();
    planeObj=new Plane();


    /* $(document)[0].onkeydown=(function(event){
         keyListen(event,planeObj);
     });*/
    planeObj.img.onload=function(){//在执行完script以后再重新画

        $(document)[0].onkeydown=(function(event){

            keyListen(event,planeObj);
        });
    }
});
function GameObject(){
    this.x=0;
    this.y=0;
    this.width=0;
    this.height=0;
}
GameObject.prototype.draw=function(){  //定义到GameObject()外,共用，类似java中static
    context.drawImage(this.img,this.x,this.y);
};


function BackGround(){
    this.width=799;
    this.height=600;
    this.img =new Image();
    this.img.src="images/Stars.png";
}

function Plane(){
    this.x=250;
    this.y=350;
    this.width=100;
    this.height=100;
    this.img =new Image();
    this.img.src="images/Player.png";

}

function Bullet(offsetx,offsety){      //子弹类
    this.x=offsetx+42;
    this.y=offsety-22;
    this.width=16;
    this.height=28;
    this.isExplosion=false;
    this.img=new Image();
    this.img.src="images/bullet.png";
}

function Rock(){            //岩石类
    this.width=66;
    this.height=70;
    this.x=Math.floor(Math.random()*(bgObj.width-this.width));          //让坐标位置随机
    this.y=Math.floor(Math.random()*(bgObj.height/2-this.height));
    //t\\his.isExplosion=false;
    this.img =new Image();
    this.img.src="images/Rock.png";
}
function Star() {
    this.width=800;
    this.height=600;
    this.img = new Image();
    this.img.src="images/Start.png";
}
function Over(){
    this.width=800;
    this.height=600;
    this.img = new Image();
    this.img.src="images/SpaceShooter_Lose.png";
}




function keyListen(event,obj){
    switch(event.keyCode){
        case key.keyLeft:
            obj.x-=10;
            if(obj.x<0){
                obj.x+=10;
            }break;
        case key.keyRight:
            obj.x+=10;
            if(obj.x>(bgObj.width-planeObj.width)){
                obj.x-=10;
            }break;
        case key.keyUp:
            obj.y-=10;
            if(obj.y<0){
                obj.y+=10;
            }break;
        case key.keyDown:
            obj.y+=10;
            if(obj.y>(bgObj.height-planeObj.height)){
                obj.y-=10;
            }break;
        case key.keySpace:
            bulletArr.push(new Bullet(planeObj.x,planeObj.y));break;
    }
}

function gameLoop(){
    if(bgObj.y>=450){
        bgObj.y=0;
    }
    bgObj.y+=10;
    context.drawImage(bgObj.img,bgObj.x,bgObj.y);
    context.drawImage(bgObj.img,bgObj.x,bgObj.y-450);
    context.drawImage(planeObj.img, planeObj.x, planeObj.y);

    // planeObj.draw();
    if(rockArr.length<5){
        rockArr.push(new Rock());
    }
    for(var i=0;i<bulletArr.length;i++){
        bulletArr[i].y-=10;
        if(bulletArr[i].y<=0){
            bulletArr.splice(i,1);    //到达顶部边界后清除子弹
        }
        else if(!(bulletArr[i].isExplosion)){
            bulletArr[i].draw();
        }
    }


    for(var j=0;j<rockArr.length;j++){
        rockArr[j].y+=1;
        if(rockArr[j].y>500){
            rockArr.splice(j,1);
        }

        else if(isCollided(planeObj,rockArr[j])) {
            Lose = true;
            context.drawImage(over.img,0,0);
            clearInterval(counter);
        }
        else if(!Lose){

            rockArr[j].draw();
        }

    }

    for(var n=0;n<bulletArr.length;n++){
        for(var m=0;m<rockArr.length;m++){
            if(isCollided(bulletArr[n],rockArr[m])){

                explodedAnimation(rockArr[m].x,rockArr[m].y,n,m);
                bulletArr.splice(n,1);
                rockArr.splice(m,1);
            }
        }
    }
}
var   counter=setInterval(gameLoop, 1000/30);
function isCollided(obj1,obj2)
{
    if (obj1==undefined||obj2==undefined)
    {
        return;
    }
    var center1={
        x:obj1.x+obj1.width/2,
        y:obj1.y+obj1.height/2
    };
    var center2={
        x:obj2.x+obj2.width/2,
        y:obj2.y+obj2.height/2
    };
    if(Math.abs(center1.x-center2.x)<=(obj1.width+obj2.width)/2
        &&Math.abs(center1.y-center2.y)<=(obj1.height+obj2.height)/2)
    {
        return true;
    }
    return false;
}

function explodedAnimation(rockX,rockY,bulletIndex,rockIndex){        //爆炸动画

    context.drawImage(boomImage,sourceX,0,44,49,rockX,rockY,44,49);
    if(sourceX<308){
        sourceX+=44;
    }else{
        sourceX=0;
        bulletArr.splice(bulletIndex,1);
        rockArr.splice(rockIndex,1);
    }
}



