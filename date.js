// Returns a date formated as: Monday, January 30
exports.getDate = function () {
    const today = new Date();
    const dateOptions = {
        weekday: 'long',
        /*year: 'numeric',*/
        month: 'long',
        day: 'numeric'
    };
    return today.toLocaleDateString("en-US", dateOptions);
}

// Returns a the day of the week: Monday
exports.getDay = function () {
    const today = new Date();
    const dateOptions = {
        weekday: 'long',
    };
    return today.toLocaleDateString("en-US", dateOptions);
}