function getCurrentMonth() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    currentMonth += 1;

    return currentMonth;
}

module.exports = {
    GETMONTH : getCurrentMonth
}