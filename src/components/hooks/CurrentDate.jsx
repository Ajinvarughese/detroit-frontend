export const getDate = (splitter) => {
    const date = new Date();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var year = date.getFullYear();
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    
    return year+splitter+month+splitter+day;
}

export const formattedDate = (date) => {
    const dateObj = new Date(date);

    const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
    };

    const formattedDate = dateObj.toLocaleString('en-GB', options);  // Or 'en-US' for US-style formatting
    return formattedDate;  // e.g., "31 May 2025 at 8:25 PM"

}

export const monthsToYears = (value) => {
    const year = Math.floor(value / 12);
    const yearText = year > 1 ? year + " years" : year + " year";
    const months = value % 12;
    const monthsText = months > 1 ? months + " months" : months + " month";
    
    const text = year > 0 && months > 0 ? `${yearText} and ${monthsText}` : year > 0 ? `${yearText}` : `${monthsText}`; 
    return text;
}