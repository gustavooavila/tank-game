class Tank extends GameEntity{
    constructor(x, y, orientation, color = "green"){
        super(x, y, orientation);
        
        this.e.addClass("tank");
        this.e.addClass(color);
        this.stop();
    }
    
    move(x, y){
        super.move(x, y);
        this.run();
    }
    
    rotateClockwise(){
        super.rotateClockwise();
        this.run();
    }
    rotateAnticlockwise(){
        super.rotateAnticlockwise();
        this.run();
    }
    
    run(){this.e.addClass("running");}
    stop(){
        this.e.removeClass("running");
    }
}