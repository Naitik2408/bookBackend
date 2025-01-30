function generateReferCode(length = 9) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referCode += characters[randomIndex];
    }
    return referCode;
}

module.exports = generateReferCode;