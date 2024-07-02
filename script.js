const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const counter = document.getElementById("counter");
let countNumber=0;

document.addEventListener("keydown", function(event){
    jump();
})

function jump(){
    if(dino.classList != "jump"){
        dino.classList.add("jump");
    }

    setTimeout(() => {
        dino.classList.remove("jump");
        
    }, 500);
}

let isAlive = setInterval(() => {
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

    if(cactusLeft <50 && cactusLeft > 0 && dinoTop>= 140){
        alert(`Game over! Your score ${countNumber}.`);
        location.reload();
    }else{
        countNumber++;
        counter.innerHTML=`Score: ${countNumber}`;
    }
},200);
