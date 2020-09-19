class Command {
    constructor(command, sortable){
        this.e = $(`<div class="command">`);
        this.e.attr("data-command", command);
        this.e.draggable({
            helper: "clone",
            connectToSortable: sortable,
        });
        this.e.click(function(){sortable.append($(this).clone())});
    }
    appendTo(container){
        this.e.appendTo(container);
        return this;
    }
    
};

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