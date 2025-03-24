const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player, obstacles, collectibles, enemies, keys, score, gameOver;

function resetGame() {
    player = { x: 50, y: 200, radius: 15, color: "blue", speed: 5 };
    obstacles = [];
    collectibles = [];
    enemies = [];
    keys = {};
    score = 0;
    gameOver = false;
    generateCollectibles();
    generateEnemies();
    gameLoop();
}

// Adăugarea ascultătorilor de evenimente
document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (gameOver && e.code === "Enter") {
        resetGame();
    }
});
document.addEventListener("keyup", (e) => keys[e.code] = false);

function update() {
    if (gameOver) return;

    if (keys["ArrowUp"] && player.y > player.radius) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y < canvas.height - player.radius) player.y += player.speed;
    if (keys["ArrowLeft"] && player.x > player.radius) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.radius) player.x += player.speed;
    
    // Verifică coliziunea cu obiectele colectabile
    collectibles = collectibles.filter(collectible => {
        let dx = player.x - collectible.x;
        let dy = player.y - collectible.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + collectible.radius) {
            score += 10;
            return false;
        }
        return true;
    });

    // Verifică coliziunea cu inamicii
    enemies.forEach(enemy => {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + enemy.radius) {
            gameOver = true;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenarea jucătorului
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Desenarea obiectelor colectabile
    ctx.fillStyle = "green";
    collectibles.forEach(collectible => {
        ctx.beginPath();
        ctx.arc(collectible.x, collectible.y, collectible.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Desenarea inamicilor
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Afișarea scorului
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Scor: " + score, 10, 30);
    
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over! Apasă Enter pentru a reîncerca", canvas.width / 4, canvas.height / 2);
    }
}

// Funcție pentru generarea obiectelor colectabile
function generateCollectibles() {
    collectibles.push({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), radius: 10 });
    setTimeout(generateCollectibles, 3000);
}

// Funcție pentru generarea inamicilor
function generateEnemies() {
    enemies.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 15 });
    setTimeout(generateEnemies, 4000);
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

resetGame();