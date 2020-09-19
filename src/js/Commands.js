const commandManager = {
    commands: {},
    registerCommand: function(command,object){this.commands[command] = object;}
}

class commandStack{
    constructor(){
        let removeIntent;
        this.e = $(`<div id="commandsStack"></div>`);
        this.e.sortable({
            over: function (event, ui) {
                removeIntent = false;
            },
            
            out: function (event, ui) {
                removeIntent = true;
            },
            
            beforeStop: function (event, ui) {
                if(removeIntent === true) ui.item.remove();
            }
        });
    }
    
    appendTo(container){
        this.e.appendTo(container);
        return this;
    }
    
    getCommands(){
        return this.e.sortable("toArray", {attribute: "data-command"});
    }
    
    getElement(){
        return this.e;
    }
    
}

class Command {
    constructor(command, sortable){
        this.e = $(`<div class="command">`);
        this.e.attr("data-command", command);
        this.e.draggable({
            helper: "clone",
            connectToSortable: sortable,
        });
        this.e.click(function(){sortable.append($(this).clone())});
        
        commandManager.registerCommand(command, this);
    }
    
    appendTo(container){
        this.e.appendTo(container);
        return this;
    }
    
    action(gameEntity, stage){
        // false makes the command be executed again, by making the loop not increment the command count;
        return true;
    }
};

class moveForward extends Command{
    constructor(sortable){
        super("move-forward", sortable);
    }
    action(gameEntity, stage){
        if(!stage.checkCollisionForward(tank.x, tank.y, tank.rotation)) tank.moveForward();
        return true;
    }
    
}

class rotateClockwise extends Command{
    constructor(sortable){
        super("rotate-clockwise", sortable);
    }
    action(gameEntity){
        tank.rotateClockwise()
        return true;
    }
    
}

class rotateAnticlockwise extends Command{
    constructor(sortable){
        super("rotate-anticlockwise", sortable);
    }
    action(gameEntity){
        tank.rotateAnticlockwise()
        return true;
    }
    
}

class shoot extends Command{
    constructor(sortable){
        super("shoot", sortable);
        this.bullet = null;
    }
    createBullet(gameEntity, stage){
        if(gameEntity.stop) gameEntity.stop();
        this.bullet = new Bullet(gameEntity.x, gameEntity.y, gameEntity.rotation);
        this.bullet.appendTo(stage.e);
    }
    action(gameEntity, stage){
        if(!this.bullet){
            this.createBullet(gameEntity, stage);
            return false;
        }
        if(checkCollisionForward.call(stage, this.bullet.x, this.bullet.y, this.bullet.rotation)){
            this.bullet.remove();
            this.bullet = null;
            return true;
        }
        this.bullet.moveForward();
        return false;
    }
}
