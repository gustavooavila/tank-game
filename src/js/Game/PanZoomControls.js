class PanZoomControls extends EventTarget{
    constructor(controlled, container){
        super();
        this.controlled = controlled;
        
        this.e = $("<div class='panZoomControls'></div>");
        this.e.appendTo(container);
        
        this.Panzoom = Panzoom(controlled);
        this.Panzoom.setOptions({maxScale: 1});
        
        this.constrainEvents();
        this.listenTouchpadZoom();        
    }
    
    listenTouchpadZoom(){
        window.addEventListener("wheel", (e)=>{
            //if(!e.ctrlKey)return;
            this.Panzoom.zoomWithWheel(e);
        }, {passive: false});
    }
    
    constrainEvents(){
        this.controlled.addEventListener("panzoomchange", (e)=>{
            const {x, y, scale} = e.detail;
            const result = this.constrainXY(x, y, scale);
            this.Panzoom.pan(result.x, result.y, {silent: true, force: true});
        });
        
    }
    
    constrainXY(toX, toY, toScale) {
        const scale = this.Panzoom.getScale();
        const {x, y} = this.Panzoom.getPan();
        const result = { x, y };
        
        toX = parseFloat(toX)
        toY = parseFloat(toY)
        
        const dims = getDimensions(this.controlled);
        const realWidth = this.controlled.offsetWidth
        const realHeight = this.controlled.offsetHeight
        const scaledWidth = realWidth * toScale
        const scaledHeight = realHeight * toScale
        const diffHorizontal = (scaledWidth - realWidth) / 2
        const diffVertical = (scaledHeight - realHeight) / 2
        
        const containerWidth = dims.parent.width;
        const containerHeight = dims.parent.height;
        
        
        if(scaledWidth > containerWidth){
            const extraWidth = Math.max((scaledWidth - dims.parent.width), 0);
            
            const minX = (diffHorizontal - extraWidth - dims.elem.margin.left - dims.parent.padding.left) / toScale;
            const maxX = (diffHorizontal - dims.parent.padding.left - dims.elem.margin.left - dims.parent.border.left - dims.parent.border.right) / toScale;
            
            result.x = Math.max(Math.min(result.x, maxX), minX);
        }
        else
        {
            const minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale
            const maxX = (dims.parent.width - scaledWidth - dims.parent.padding.left - dims.elem.margin.left - dims.parent.border.left - dims.parent.border.right + diffHorizontal) / toScale 
            result.x = Math.max(Math.min(result.x, maxX), minX)
        }
        
        if(scaledHeight > containerHeight){
            const extraHeight = Math.max((scaledHeight - dims.parent.height), 0);
            
            const minY = (diffVertical - extraHeight - dims.elem.margin.top - dims.parent.padding.top) / toScale;
            const maxY = (diffVertical - dims.parent.padding.top - dims.elem.margin.top - dims.parent.border.top - dims.parent.border.bottom) / toScale;
            
            result.y = Math.max(Math.min(result.y, maxY), minY)
        }
        else{
            const minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale 
            const maxY = (dims.parent.height - scaledHeight - dims.parent.padding.top - dims.elem.margin.top - dims.parent.border.top - dims.parent.border.bottom + diffVertical) / toScale
            
            result.y = Math.max(Math.min(result.y, maxY), minY)
        }     
        
        return result
        
    }
    
    centerAround(x, y, animate = true) {
        const scale = this.Panzoom.getScale();
        
        const dims = getDimensions(this.controlled);
        
        const parentCenter = {x: dims.parent.width / 2, y: dims.parent.height / 2};
        const centerDiff = {x: (parentCenter.x - x ) / scale, y: (parentCenter.y - y ) / scale};
        
        if(animate)this.Panzoom.setOptions({animate: true, duration: 500});
        this.Panzoom.pan(centerDiff.x, centerDiff.y , {force: true});
        if(animate)this.Panzoom.setOptions({animate: false})
    }
    
    tempCenterAround(x, y, animate) {
        const savedCoords = this.Panzoom.getPan();
        this.centerAround(x, y, animate);
        return (animate = false) => {
            if(animate)this.Panzoom.setOptions({animate: true, duration: 500});
            this.Panzoom.pan(savedCoords.x, savedCoords.y, {force: true});
            if(animate)this.Panzoom.setOptions({animate: false})
        }
    }
    
    center(animate){
        const scale = this.Panzoom.getScale();
        const realWidth = this.controlled.offsetWidth
        const realHeight = this.controlled.offsetHeight
        
        const elemCenter = {x: realWidth / 2, y: realHeight / 2};
        this.centerAround(elemCenter.x, elemCenter.y, animate)
    }
    
    tempCenter(animate){
        const savedCoords = this.Panzoom.getPan();
        this.center(animate);
        return (animate = false) => {
            if(animate)this.Panzoom.setOptions({animate: true, duration: 500});
            this.Panzoom.pan(savedCoords.x, savedCoords.y, {force: true});
            if(animate)this.Panzoom.setOptions({animate: false})
        }
    }
    tempZoom(zoom, animate = false){
        const savedScale = this.Panzoom.getScale();
        if(animate)this.Panzoom.setOptions({animate: true, duration: 500});
        this.Panzoom.zoom(zoom);
        if(animate)this.Panzoom.setOptions({animate: false})
        return (animate)=>{
            if(animate)this.Panzoom.setOptions({animate: true, duration: 500});
            this.Panzoom.zoom(savedScale)
            if(animate)this.Panzoom.setOptions({animate: false})
        };
    }
    
    tempZoomCenterAround(x, y, zoom, animate){
         const restoreZoom = this.tempZoom(zoom);
        const retorePan = this.tempCenterAround(x, y, animate);
        
        return (animate)=>{
            restoreZoom(animate),
            retorePan(animate)
        }
    }
    
    tempZoomCenter(zoom, animate){
        const restoreZoom = this.tempZoom(zoom);
        const retorePan = this.tempCenter(animate);
        
        return (animate)=>{
            restoreZoom(animate),
            retorePan(animate)
        }
    }
}
