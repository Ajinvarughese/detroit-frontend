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

    // // If you want "31st May 2025 HH:MM AM/PM":
    // const day = dateObj.getDate();
    // const suffix = (day) => {
    // if (day > 3 && day < 21) return 'th';
    // switch (day % 10) {
    //     case 1: return 'st';
    //     case 2: return 'nd';
    //     case 3: return 'rd';
    //     default: return 'th';
    // }
    // };

    // const month = dateObj.toLocaleString('default', { month: 'long' });
    // const year = dateObj.getFullYear();
    // let hours = dateObj.getHours();
    // const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12 || 12;

    // return `${day}${suffix(day)} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}