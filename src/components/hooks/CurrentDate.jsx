export const getDate = (splitter) => {
    const date = new Date();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var year = date.getFullYear();
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    
    return year+splitter+month+splitter+day;
}