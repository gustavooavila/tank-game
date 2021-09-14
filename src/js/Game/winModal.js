class winModal extends EventTarget{
    constructor(){
        super();
        this.modal = $("#winModal");
        
        this.playAgain= $("#winModal #playAgain"),
        this.playNext= $("#winModal #playNext"),
        this.share= $("#winModal #share"),
        
        this.playAgain.on("click", ()=>{this.emitEvent("playAgain");});
        this.share.on("click", ()=>{this.emitEvent("share")})
        this.playNext.on("click", ()=>{this.emitEvent("playNext")})
    }
    
    open(){this.modal.removeClass("hidden");}
    close(){this.modal.addClass("hidden");}
    emitEvent(type){
        this.dispatchEvent(new Event(type));
        this.close();
    }
}