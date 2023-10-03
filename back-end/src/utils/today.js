function today() {
    const date = new Date();
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
}

module.exports = today;