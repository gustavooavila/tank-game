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
            
            this.createPanZoomControls();
            
            const tank = this.stage.tanks[0];
            setTimeout(()=>{this.panZoomControls.centerAround(tank.x * 128, tank.y * 128, false);}, 200)
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
        createPanZoomControls(){
            this.panZoomControls = new PanZoomControls(this.stage.e[0], this.Container);
        },
        run: function(){
            if(commandManager.running) return;
            const commands = this.commandStack.getCommands();
            
            retoreZoom = Game.panZoomControls.tempZoom(1, true)
            const tank = this.stage.tanks[0];
            
            this.panZoomControls.centerAround(tank.x * 128, tank.y * 128, false)
            setTimeout(()=>{commandManager.run(commands, this.stage);}, 500)
            
        }
    }
    
    const controls = $("#controls");
    const commandStackContainer = $("#commandStackContainer");
    const commandsContainer = $("#commandsContainer");
    const gameContainer = $("#gameContainer");
    
    let centerAround = null;
    let restorePan = null;
    let retoreZoom = null;
    
    commandManager.addEventListener("stepped", function(e){
        const {tank, command} = e.detail
        centerAround = tank
        if(command.name == "shoot") centerAround = command.bullet;
        restorePan = Game.panZoomControls.tempCenterAround(centerAround.x * 128, centerAround.y * 128)
        
        if(Game.stage.checkWin()){
            Game.winModal.open();
            commandManager.stop();
        }
    });
    commandManager.addEventListener("stopped", function(){
        
        
        if(Game.stage.checkWin()){
            Game.winModal.open();
            commandManager.stop();
            Game.stage.restart();
            return;
        }
        Game.stage.restart();
        retoreZoom();
        restorePan();
    })
    
    const stage = getStageFromURL();    
    
    if(stage){   
        Game.Container = gameContainer
        Game.createCommandStack(commandStackContainer);
        Game.createControls(controls);
        Game.createCommands(commandsContainer);
        Game.createWinModal();
        Game.loadStage(stage, gameContainer);
    }
    window.Game = Game;
    
})            