//LOADING IMAGES STARTS RIGHT HERE...


const life_img = new Image();
life_img.src = 'img/life.png';

const score_img = new Image();
score_img.src = 'img/score.png';

const level_img = new Image();
level_img.src = 'img/level.png';

const bg_img = new Image();
bg_img.src = 'img/bg1.jpg';

const pokeball = new Image();
pokeball.src = 'img/pokeball1.png';

life_img.width = 35;
life_img.height = 35;
score_img.width = 25;
score_img.height = 25;
level_img.width = 30;
level_img.height = 30;

//LOADING IMAGES END HERE...


//LOADING SOUNDS STARTS RIGHT HERE...

const brick_hit = new Audio();
brick_hit.src = 'sounds/brick_hit.mp3';

const life_lost = new Audio();
life_lost.src = 'sounds/life_lost.mp3';

const paddle_wall_hit = new Audio();
paddle_wall_hit.src = 'sounds/paddle_wall_hit.mp3';

const level_cleared = new Audio();
level_cleared.src = 'sounds/level_cleared.mp3';

const game_over_sound = new Audio();
game_over_sound.src = 'sounds/sonic_game_over.mp3';

const happy_end = new Audio();
happy_end.src = 'sounds/happy_end.mp3';

//LOADING SOUNDS END HERE...