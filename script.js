
const world = document.getElementById("world");
const player = document.getElementById("player");
const catsArea = document.getElementById("cats");

let x = 680;
let y = 520;
let coins = 0;
let collected = [];
let keys = {};
let gameOver = false;

const catData = [
    {name:"Orange Tabby",file:"orange-cat.png",emoji:"🐈",x:200,y:400,rarity:"Common"},
    {name:"White Cat",file:"white-cat.png",emoji:"🐈",x:400,y:200,rarity:"Common"},
    {name:"Black Cat",file:"black-cat.png",emoji:"🐈‍⬛",x:850,y:300,rarity:"Rare"},
    {name:"Calico Cat",file:"calico-cat.png",emoji:"🐱",x:1100,y:400,rarity:"Rare"},
    {name:"Fluffy Persian",file:"persian-cat.png",emoji:"😺",x:300,y:650,rarity:"Common"},
    {name:"Siamese Cat",file:"siamese-cat.png",emoji:"🐈",x:800,y:800,rarity:"Rare"},
    {name:"Golden Cat",file:"golden-cat.png",emoji:"😻",x:1200,y:180,rarity:"Legendary"},
    {name:"Little Kitten",file:"kitten.png",emoji:"🐾",x:500,y:850,rarity:"Common"},
    {name:"Wizard Cat",file:"wizard-cat.png",emoji:"😸",x:1150,y:850,rarity:"Legendary"},
    {name:"Pink Dream Cat",file:"dream-cat.png",emoji:"😽",x:100,y:850,rarity:"Epic"}
];

function createCats() {
    catsArea.innerHTML = "";

    catData.forEach((cat,i) => {
        const el = document.createElement("div");
        el.className = "cat";
        el.id = "cat" + i;
        el.style.left = cat.x + "px";
        el.style.top = cat.y + "px";

        const img = document.createElement("img");
        img.src = "assets/" + cat.file;
        img.alt = cat.name;
        img.width = 42;
        img.height = 42;
        img.onerror = () => {
            img.replaceWith(document.createTextNode(cat.emoji));
        };

        el.appendChild(img);

        const label = document.createElement("span");
        label.className = "cat-label";
        label.textContent = cat.name;
        el.appendChild(label);

        catsArea.appendChild(el);
    });
}

function updateCollection() {
    document.getElementById("count").textContent = collected.length;
    document.getElementById("coins").textContent = coins;

    document.getElementById("catList").innerHTML =
        catData.map((cat,i) => `
            <div class="cat-entry">
                ${collected.includes(i) ? cat.emoji : "❔"}
                ${collected.includes(i) ? cat.name : "Unknown Cat"}
            </div>
        `).join("");
}

function showMessage(message) {
    document.getElementById("message").textContent = message;
}

function collectCats() {
    catData.forEach((cat,i) => {
        if (collected.includes(i)) return;

        if (Math.hypot(x-cat.x,y-cat.y) < 55) {
            collected.push(i);

            const reward = {
                Common:10,
                Rare:20,
                Epic:30,
                Legendary:50
            }[cat.rarity];

            coins += reward;

            document.getElementById("cat"+i).remove();
            updateCollection();

            showMessage(`You found ${cat.name}! +${reward} coins!`);

            if (collected.length === catData.length) {
                gameOver = true;
                document.getElementById("win").style.display = "flex";
            }
        }
    });
}

function move(dx,dy) {
    if (gameOver) return;

    x = Math.max(0,Math.min(1350,x+dx));
    y = Math.max(0,Math.min(945,y+dy));

    player.style.left = x+"px";
    player.style.top = y+"px";

    collectCats();
    updateCamera();
}

function updateCamera() {
    const game = document.getElementById("game");
    const scale = Math.min(game.clientWidth/700,game.clientHeight/500,1);

    const offsetX = game.clientWidth/2-(x+25)*scale;
    const offsetY = game.clientHeight/2-(y+25)*scale;

    const finalX = Math.max(game.clientWidth-1400*scale,Math.min(0,offsetX));
    const finalY = Math.max(game.clientHeight-1000*scale,Math.min(0,offsetY));

    world.style.transform =
        `translate(${finalX}px,${finalY}px) scale(${scale})`;
}

function gameLoop() {
    let dx = 0,dy = 0;

    if(keys.ArrowUp || keys.w) dy -= 3;
    if(keys.ArrowDown || keys.s) dy += 3;
    if(keys.ArrowLeft || keys.a) dx -= 3;
    if(keys.ArrowRight || keys.d) dx += 3;

    if(dx && dy) {
        dx *= 0.707;
        dy *= 0.707;
    }

    if(dx || dy) move(dx,dy);

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown",e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(key)) {
        e.preventDefault();
    }
    keys[key] = true;
});

document.addEventListener("keyup",e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    keys[key] = false;
});

document.querySelectorAll("#controls button").forEach(btn => {
    const directions = {
        up:[0,-4],
        down:[0,4],
        left:[-4,0],
        right:[4,0]
    };

    const dir = btn.dataset.dir;

    btn.addEventListener("pointerdown",e => {
        e.preventDefault();
        keys[dir] = true;
    });

    ["pointerup","pointerleave","pointercancel"].forEach(event => {
        btn.addEventListener(event,e => {
            e.preventDefault();
            keys[dir] = false;
        });
    });
});

function toggleCollection() {
    const book = document.getElementById("collection");
    book.style.display =
        book.style.display === "none" ? "block" : "none";
}

function restartGame() {
    x = 680;
    y = 520;
    coins = 0;
    collected = [];
    keys = {};
    gameOver = false;

    document.getElementById("win").style.display = "none";

    createCats();
    updateCollection();
    updateCamera();
    showMessage("Welcome back! Find all 10 cats!");
}

window.addEventListener("resize",updateCamera);

createCats();
updateCollection();
updateCamera();
gameLoop();
