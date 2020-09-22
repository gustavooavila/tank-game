$(function(){
    const Game = {
        stage: null,
        stageData: null,
        commandStack: null,
        bullet: null, 
        controls: [],
        
        createStage: function(stageData, container){
            this.stage = new Stage(stageData.w, stageData.h, stageData.walls, stageData.tanks, stageData.monsters);
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
            const commands = this.commandStack.getCommands();
            commandManager.run(commands, this.stage);
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