class Bullet extends GameEntity{
    constructor(x, y, orientation, color = "green"){
        super(x, y, orientation);
        this.e.addClass("bullet");
        this.e.addClass(color);
    }
}