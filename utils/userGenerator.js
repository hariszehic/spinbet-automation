export function generateUser() {
    const timeStamp = Date.now();
    const firstName = `First${randomLetters()}`;
    const lastName = `Last${randomLetters()}`;
    return {
        userName: `user${String(timeStamp).slice(-5)}`,
        email: `user${timeStamp}@test.com`,
        password: `Test123!`,
        phoneNumber: getPhoneNumber(),
        dialNumber: '+1',
        firstName: firstName,
        lastName: lastName,
        address: `${randomLetters(7)} ${randomLetters()}`,
        city: randomLetters(7),
        zipCode: Math.floor(Math.random() * 90000) + 10000,
        region: 'Nelson Region',
        cardNumber: `4242424242424242`,
        cardName: `${firstName} ${lastName}`,
        dateOfbirth: generateDOB(),
        cardExpirationDate: getCardExpiry(),
        cardCvv: `123`,
        token: '',
    }
}
function getCardExpiry() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear() + 3).slice(-2);

        return `${month}${year}`;
    }
function getPhoneNumber() {
    const prefix = Math.floor(Math.random() * 800) + 200;
    const lineNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `519${prefix}${lineNumber}`;
} 

function randomLetters(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateDOB() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const minYear = 1940;
    const maxYear =currentYear - 18;
    const year = Math.floor(Math.random() * (maxYear - minYear)) + minYear;
    const month = String(Math.floor(Math.random() * 7) + 5).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 25) + 1).padStart(2, '0');
    return `${day}/${month}/${year}`
}

export function getNZPhoneNumber() {
    const lineNumber = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
    return `021${lineNumber}`;
}