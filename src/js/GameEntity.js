class GameEntity{
    constructor(x, y, rotation = 0){
        this.e = $(`<div></div>`);
        this.move(x, y);
        this.changeOrientation(rotation);
    }
    
    changeOrientation(rotation){
        this.e.css("transform", `rotate(${rotation}rad)`);
        this.rotation = rotation;
    }
    
    rotateClockwise(){
        this.changeOrientation(this.rotation + (Math.PI / 2));
    }
    
    rotateAnticlockwise(){
        this.changeOrientation(this.rotation - (Math.PI / 2));
    }
    
    move(x,y){
        this.x = x;
        this.y = y;
        
        this.e.css({"top": this.y * 128 +"px", "left": this.x * 128+"px"});
    }
    
    moveForward(){
        this.move(this.x + parseFloat(Math.sin(this.rotation).toFixed(3)), this.y - parseFloat(Math.cos(this.rotation).toFixed(3)));
    }
    
    appendTo(container){
        this.e.appendTo(container);
        return this;
    }
    
    remove(){
        this.e.remove();
    }
}