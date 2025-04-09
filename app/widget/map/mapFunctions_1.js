export function meterToKm(m) {
    let km = m / 1000;
    return km.toFixed(1) + " km";
}
export function secondsTimeSpanToHMS(s) {
    let h = Math.floor(s / 3600); //Get whole hours
    s -= h * 3600;
    let m = Math.floor(s / 60); //Get remaining minutes
    s -= m * 60;
    // return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
    let retunValue;
    if (h) {
        retunValue = h + " h " + (m < 10 ? '0' + m : m) + " min";
    } else if (m) {
        retunValue = m + " min " + (s < 10 ? '0' + s : s) + " Sec";
    } else {
        retunValue = (s < 10 ? '0' + s : s) + " Sec";
    }
    return retunValue;
}