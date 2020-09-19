class Stage{
    constructor(w, h, walls, tanks, slimes){
        this.w = w;
        this.h = h;
        this.walls = walls;
        this.tanks = tanks;
        this.slimes = slimes;
        
        this.originalSlimes = slimes;
        this.originalTanks = tanks;
        
        this.e = $(`<div class="stage"></div>`);        
        
        this.setDimensions();
        this.createWalls();
        this.createTanks();
        this.createSlimes();
        
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
    
    checkCollisionForward(x, y, rotation) {
        return this.checkCollision(x + parseFloat(Math.sin(rotation).toFixed(3)), y - parseFloat(Math.cos(rotation).toFixed(3)));
    }
    
    createTanks(){
        this.tanks = this.tanks.map((tank) => new Tank(tank.x, tank.y, tank.rotation * Math.PI / 180, tank.color));
        this.tanks.forEach((tank) => {tank.appendTo(this.e)});
    }
    
    createSlimes(){
        this.slimes = this.slimes.map((slime)=> new Slime(slime.x, slime.y));
        this.slimes.forEach((slime)=>{slime.appendTo(this.e)});
    }
    
    checkCollision(x, y){
        console.log(x,y)
        if(x > this.w || y > this.h || x < 0 || y < 0) return true;
        return this.walls[(y*this.w)+x];
    }
    
    restart(){
        this.slimes.forEach((slime)=>{slime.remove()});
        this.tanks.forEach((tank)=>{tank.remove()});
        
        this.tanks = this.originalTanks;
        this.slimes = this.originalSlimes;
        
        this.createTanks();
        this.createSlimes();
        
    }
    
    appendTo(gameContainer){
        this.e.appendTo(gameContainer);
    }
}

