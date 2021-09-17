class PanZoomControls extends EventTarget{
    constructor(controlled, container){
        super();
        this.scale = 1;
        this.posX = 0;
        this.posY  = 0;
        
        this.controlled = controlled;
        this.e = $("<div class='panZoomControls'></div>");
        this.Panzoom = Panzoom(controlled);
        this.Panzoom.setOptions({ maxScale: 1});
        
        
        
        this.e.appendTo(container);
        
        this.constrainEvents();
        this.listenTouchpadZoom();        
    }
    
    listenTouchpadZoom(){
        window.addEventListener("wheel", (e)=>{
            if(!e.ctrlKey)return;
            this.Panzoom.zoomWithWheel(e);
        }, {passive: false});
    }
    
    constrainEvents(){
        this.controlled.addEventListener("panzoomchange", (e)=>{
            const {x, y, scale} = e.detail;
            const result = this.constrainXY(x, y, scale)
            this.Panzoom.pan(result.x, result.y ,{silent: true, force: true})
            console.log('is it looping???')
        });
        
    }
    
    constrainXY(toX, toY, toScale) {
        const scale = this.Panzoom.getScale();
        const {x, y} = this.Panzoom.getPan();
        const result = { x, y };
        
        toX = parseFloat(toX)
        toY = parseFloat(toY)
        
        const dims = getDimensions(this.controlled);
        const realWidth = dims.elem.width / scale
        const realHeight = dims.elem.height / scale
        const scaledWidth = realWidth * toScale
        const scaledHeight = realHeight * toScale
        const diffHorizontal = (scaledWidth - realWidth) / 2
        const diffVertical = (scaledHeight - realHeight) / 2
        
        const minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale
        const maxX =
        (dims.parent.width -
            scaledWidth -
            dims.parent.padding.left -
            dims.elem.margin.left -
            dims.parent.border.left -
            dims.parent.border.right +
        diffHorizontal) /
        toScale
        result.x = Math.max(Math.min(result.x, maxX), minX)
        
        const minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale
        const maxY =
        (dims.parent.height -
            scaledHeight -
            dims.parent.padding.top -
            dims.elem.margin.top -
            dims.parent.border.top -
            dims.parent.border.bottom +
        diffVertical) /
        toScale
        result.y = Math.max(Math.min(result.y, maxY), minY)
        return result
        
    }
}
