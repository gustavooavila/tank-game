class Monster extends GameEntity{
    constructor(x, y) {
        super(x, y);
        this.alive = true;
    }
    hit(){
        this.kill();
    }
    kill(){
        this.remove();
        this.alive = false;
    }
    isAlive(){
        return this.alive;
    }
}

class Slime extends Monster{
    constructor(x, y) {
        super(x, y);
        this.e.addClass("slime");
    }
}

const Monsters = {Slime}