const selectTag = document.querySelectorAll('select');

selectTag.forEach(tag => {
    for(const code in lang){
        let selected;
        
        let option = <option value="${code}" selected={selected}>${lang[code]}</option>;
    }
});