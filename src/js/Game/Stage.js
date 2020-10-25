class Stage{
    constructor(w, h, walls, tanks, monsters){
        this.w = w;
        this.h = h;
        this.walls = walls;
        this.tanks = tanks;
        this.monsters = monsters;
        
        this.originalMonsters = monsters;
        this.originalTanks = tanks;
        
        this.e = $(`<div class="stage"></div>`);        
        
        this.setDimensions();
        this.createWalls();
        this.createTanks();
        this.createMonsters();
    }
    
    setDimensions(){
        this.e.width(this.w * 128);
        this.e.height(this.h * 128);
    }
    
    createWalls(){
        const walls = this.walls.reduce(
            (acc, hasWall, index)=>{
                if(hasWall){
                    const y = Math.trunc(index / this.w);
                    const x = (index - (y*this.w));
                    
                    const wall = $(`<div class="wall"></div>`);
                    wall.offset({"top": y * 128, "left": x * 128});
                    
                    acc.append(wall);
                }
                return acc;
            }
        ,$(document.createDocumentFragment()));
        this.e.append(walls);
    }    
    createTanks(){
        this.tanks = this.tanks.map((tank) => new Tank(tank.x, tank.y, tank.rotation * Math.PI / 180, tank.color));
        this.tanks.forEach((tank) => {tank.appendTo(this.e)});
    }
    
    createMonsters(){
        this.monsters = this.monsters.map((monster)=> new Monsters[monster.type](monster.x, monster.y));
        this.monsters.forEach((monster)=>{monster.appendTo(this.e)});
    }
    checkWallCollisionForward(x, y, rotation) {
        return this.checkWallCollision(x + parseFloat(Math.sin(rotation).toFixed(3)), y - parseFloat(Math.cos(rotation).toFixed(3)));
    }
    checkWallCollision(x, y){
        if(x >= this.w || y >= this.h || x < 0 || y < 0) return true;
        return this.walls[(y*this.w)+x];
    }
    
    restart(){
        this.monsters.forEach((monster)=>{monster.remove()});
        this.tanks.forEach((tank)=>{tank.remove()});
        
        this.tanks = this.originalTanks;
        this.monsters = this.originalMonsters;
        
        this.createTanks();
        this.createMonsters();
    }
    
    checkWin(){
        return this.checkAllMonstersDead();
    }
    
    checkAllMonstersDead(){
        return !this.monsters.some((monster) => monster.isAlive());
    }
    
    checkMonsterCollision(x, y){
        return this.monsters.reduce(function(acc, monster){
            if(acc) return acc;
            if(monster.isAlive() && monster.x == x && monster.y == y) return monster;
            return false;
        }, false);
    }
    
    appendTo(gameContainer){
        this.e.appendTo(gameContainer);
    }
}

