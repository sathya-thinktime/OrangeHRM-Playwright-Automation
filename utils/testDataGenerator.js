
function generateEmployeeId() {
    return `EMP${Date.now().toString().slice(-7)}`;
}

module.exports = { generateEmployeeId };
