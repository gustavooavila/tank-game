function createStage(stageName){
    const stageContainer = $(`<a class="stageContainer"></a>`).attr("data-stage", stageName);
    const stagePreview = $(`<div class="stagePreview"></div>`);
    const stageTitle = $(` <div class="stageTitle">${stageName}</div>`);
    
    stageContainer.append(stagePreview);
    stageContainer.append(stageTitle);
    
    
    $.getJSON(`res/stages/${stageName}.json`, function(stageData){
        const stage = new Stage(stageData.w, stageData.h, stageData.walls, stageData.tanks, stageData.monsters)
        stage.appendTo(stagePreview);
    });
    
    return stageContainer;
}