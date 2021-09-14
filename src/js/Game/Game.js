function getStageFromURL(){
    const search = new URLSearchParams(document.location.search);
    if(search.has("stage")) return decodeURI(search.get("stage"));
    return false;
}

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
            $.getJSON(`res/stages/${stage}.json`, (stageData) => {
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
            
            this.controls.push(new Control("restart", ()=>{
                commandManager.stop();
            }).appendTo(container));
        },
        
        createCommandStack: function(container){
            this.commandStack = new commandStack().appendTo(container);
        },
        createWinModal: function(){
            this.winModal = new winModal();
            
            this.winModal.addEventListener("playAgain",()=>{
                this.commandStack.clear();
            });
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
    
    
    commandManager.addEventListener("stepped", function(){
        if(Game.stage.checkWin()){
            Game.winModal.open();
            commandManager.stop();
        }
    });
    commandManager.addEventListener("stopped", function(){
        Game.stage.restart();
    })
    
    const stage = getStageFromURL();    
    
    if(stage){     
        Game.createCommandStack(commandStackContainer);
        Game.createControls(controls);
        Game.createCommands(commandsContainer);
        Game.createWinModal();
        Game.loadStage(stage, gameContainer);
    }
    window.Game = Game;
    
})            