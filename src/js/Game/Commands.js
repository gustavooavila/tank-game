const commandManager = {
    ...Utils.EventTarget,
    commands: {},
    running: false,
    registerCommand: function(command,object){this.commands[command] = object;},
    run: function(commands, stage) {
        if(this.running) return;
        this.running = true;
        this.step(commands, stage);
    },
    stop: function(){
        this.running = false;
    },
    step: function(commands, stage, index = 0){
        // check if should run and theres commands left to run
        if(this.running && index < commands.length){
            //TODO: multiple tanks support??? Oo
            const tank = stage.tanks[0];
            const command = this.commands[commands[index]]
            const shouldContinue = command.action(tank, stage);
            
            setTimeout(()=>this.step(commands, stage, shouldContinue ? index + 1 : index), 500);
            this.dispatchEvent(new CustomEvent("stepped", {detail: {command, tank}}));
            }else{
            this.running = false;
            this.dispatchEvent(new Event("stopped"));
        }
    }
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
    
    clear(){
        this.e.empty();
    }
    
}

class Command {
    constructor(command, sortable){
        this.name = command
        this.e = $(`<div class="command">`);
        this.e.attr("data-command", command);
        this.e.draggable({
            helper: "clone",
            connectToSortable: sortable,
        });
        this.e.click(function(){
            sortable.append($(this).clone())
            sortable.scrollTop(sortable[0].scrollHeight)
        });
        
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
        if(!stage.checkWallCollisionForward(gameEntity.x, gameEntity.y, gameEntity.rotation)) gameEntity.moveForward();
        return true;
    }
    
}

class rotateClockwise extends Command{
    constructor(sortable){
        super("rotate-clockwise", sortable);
    }
    action(gameEntity){
        gameEntity.rotateClockwise()
        return true;
    }
    
}

class rotateAnticlockwise extends Command{
    constructor(sortable){
        super("rotate-anticlockwise", sortable);
    }
    action(gameEntity){
        gameEntity.rotateAnticlockwise()
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
        this.bullet = stage.createRuntimeEntity(new Bullet(gameEntity.x, gameEntity.y, gameEntity.rotation));
    }
    action(gameEntity, stage){
        if(!this.bullet){
            this.createBullet(gameEntity, stage);
            return false;
        }
        if(this.bullet.checkWallCollisionForward(stage) || this.bullet.checkMonsterCollision(stage)){
            this.bullet.remove();
            this.bullet = null;
            return true;
        }
        this.bullet.moveForward();
        return false;
    }
}
