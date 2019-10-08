export function getMonthAndDate({timestamp}) {
    let date = new Date(timestamp);
    return `${('0' + (date.getMonth() + 1)).slice(-2)}月${('0' + date.getDate()).slice(-2)}日`;
}

export function getFullDate({timestamp}) {
    let date = new Date(timestamp);
    return `${date.getFullYear()}年${getMonthAndDate({timestamp})}`;
}

export function getFrontZeroTimestamp({timestamp}) {
    const date = new Date(timestamp);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
}

export function getEndZeroTimestamp({timestamp}) {
    const tempDate = new Date(timestamp);
    tempDate.setHours(23);
    tempDate.setMinutes(59);
    tempDate.setSeconds(59);
    tempDate.setMilliseconds(999);
    return tempDate.getTime();
}

export function getLatestOneWeekTimestamp() {
    const oneWeekAgoDate = new Date();
    oneWeekAgoDate.setDate(oneWeekAgoDate.getDate() - 7);
    return getFrontZeroTimestamp({timestamp: oneWeekAgoDate.getTime()});
}

export function getTimeString({frontTimestamp, endTimestamp}) {
    const frontDate = new Date(), frontYear = frontDate.getFullYear(),
        endDate = new Date(endTimestamp),
        endDateYear = endDate.getFullYear();
    if (frontYear === endDateYear) {
        return `${getFullDate({timestamp: frontTimestamp})}-${getMonthAndDate({timestamp: endTimestamp})}`
    } else {
        return `${getFullDate({timestamp: frontTimestamp})}-${getFullDate({timestamp: endTimestamp})}`
    }
}
