function addZero(n) {
    if (n < 10) {
        n = "0" + n;
    }
    return n;
}

module.exports = { addZero }