function createStages(container, {mode}){
    $.getJSON(`res/stages/stage_list.json`, (stageNames) => {
        stageNames.map((stage) => createStage(stage))
        .map((stage) => addStageURL(stage, mode))
        .forEach((stage) => {container.append(stage)});
    });
}

function addStageURL(stage, mode){
    const stageName = stage.attr("data-stage");
    stage.attr("href", `${mode==="edit"?"Editor":"Game"}.html?stage=${stageName}`);
    return stage
}

$(function(){
    const stagesContainer = $("#stages");
    
    const search = getSearchParams();
    createStages(stagesContainer, search);
    
})

function getSearchParams(){
    const search = new URLSearchParams(document.location.search);
    const result = {
        mode: "play"
    };
    
    if(search.has("mode")) result.mode = search.get("mode");
    
    return result;
}        