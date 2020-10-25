class Control {
    constructor(command, callback){
        this.e = $(`<div>${command}</div>`);
        this.callback = callback
        this.e.click(()=>this.callback.call(Game));
    }
    appendTo(container){
        this.e.appendTo(container);
        return this;
    }
}
