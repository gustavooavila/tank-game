$(function(){
    const Game = {
        stage: null,
        stageData: null,
        commandStack: null,
        bullet: null, 
        controls: [],
        
        createStage: function(stage, container){
            this.stage = new Stage(stage.w, stage.h, stage.walls, stage.tanks, stage.slimes);
            this.stage.appendTo(container);
        },
        
        loadStage: function(stage, container){
            $.getJSON(`res/stages/stage_${stage}.json`, (stageData) => {
                this.stageData = stageData;
                this.createStage.call(this, stageData, container);
            });
        },
        
        createCommands: function(container){
            new rotateAnticlockwise(this.commandStack.getElement()).appendTo(container)
            new moveForward(this.commandStack.getElement()).appendTo(container)
            new rotateClockwise(this.commandStack.getElement()).appendTo(container)
            new shoot(this.commandStack.getElement()).appendTo(container)
        },
        
        createControls: function(container){
            this.controls.push(new Control("run", this.run).appendTo(container));
        },
        
        createCommandStack: function(container){
            this.commandStack = new commandStack().appendTo(container);
        },
        
        run: function(){
            const commands = this.commandStack.getCommands()
            .map((command)=>{
                if(command === "rotate-anticlockwise") return ()=>{this.stage.tanks[0].rotateAnticlockwise()};
                if(command === "rotate-clockwise") return ()=>{this.stage.tanks[0].rotateClockwise()};
                if(command === "shoot") return ()=>{
                    const tank = this.stage.tanks[0];
                    tank.stop();
                    this.bullet = new Bullet(tank.x, tank.y, tank.rotation);
                    this.bullet.appendTo(this.stage.e);
                };
                if(command === "move-forward") return ()=>{
                    const tank = this.stage.tanks[0];
                    if(!this.stage.checkCollisionForward(tank.x, tank.y, tank.rotation))
                    tank.moveForward();
                };
            });
            
            
            console.log(commands)
            this.step(commands);
        },
        step: function(commands, index = 0){
            const bullet = this.bullet;
            const checkCollisionForward = this.stage.checkCollisionForward;
            if(bullet){
                if(checkCollisionForward.call(this.stage,bullet.x, bullet.y, bullet.rotation)) {
                    bullet.remove();
                    this.bullet = null;
                }
                else {
                    bullet.moveForward();
                }
                setTimeout(()=>this.step(commands, index), 500);
                }else if(index < (commands.length)){
                commands[index]();
                setTimeout(()=>this.step(commands, index+1), 500);
                }else{
                this.stage.restart();
            }
        }
    }
    
    const controls = $("#controls");
    const commandStackContainer = $("#commandStackContainer");
    const commandsContainer = $("#commandsContainer");
    const gameContainer = $("#gameContainer");
    
    Game.createCommandStack(commandStackContainer);
    Game.createControls(controls);
    Game.createCommands(commandsContainer);
    Game.loadStage(0, gameContainer);
    
    window.Game = Game;
})