export function getMonthAndDate({timestamp}) {
    let date = new Date(timestamp);
    return `${('0' + (date.getMonth() + 1)).slice(-2)}月${('0' + date.getDate()).slice(-2)}日`;
}

export function getFullDate({timestamp}) {
    let date = new Date(timestamp);
    return `${date.getFullYear()}年${getMonthAndDate({timestamp})}`;
}

export function getLatestOneWeekTimestamp() {
    const oneWeekAgoDate = new Date();
    oneWeekAgoDate.setDate(oneWeekAgoDate.getDate() - 7);
    return oneWeekAgoDate.getTime();
}

export function getTimeString({frontTimestamp, endTimestamp}) {
    const frontDate = new Date(frontTimestamp), frontYear = frontDate.getFullYear(), endDate = new Date(endTimestamp),
        endDateYear = endDate.getFullYear();
    if (frontYear === endDateYear) {
        return `${getFullDate({timestamp: frontTimestamp})}-${getMonthAndDate({timestamp: endTimestamp})}`
    } else {
        return `${getFullDate({timestamp: frontTimestamp})}-${getFullDate({timestamp: endTimestamp})}`
    }
}
