function getStageFromURL(){
    const search = new URLSearchParams(document.location.search);
    if(search.has("stage")) return decodeURI(search.get("stage"));
    return false;
}

