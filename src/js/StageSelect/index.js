function createStageList(container){
    $.getJSON(`res/stages/stage_list.json`, (stageNames) => {
        const stages = $(document.createDocumentFragment());
        stageNames.map((stage)=>createStage(stage, container))
        .forEach((stage)=>{stages.append(stage)});
        container.append(stages);
    });
}

$(function(){
    const stagesContainer = $("#stages")
    createStageList(stagesContainer);
})