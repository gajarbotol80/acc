// data-generator.js

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomName() {
    const firstNames = [
        'Rahim', 'Karim', 'Hasan', 'Rafiq', 'Sajid', 'Amin', 'Farhan', 'Tareq',
        'Jamal', 'Kamal', 'Abdullah', 'Mohammad', 'Ali', 'Anwar', 'Babul', 'Faisal',
        'Imran', 'Jahid', 'Mehedi', 'Nasir', 'Omar', 'Parvez', 'Qadir', 'Rasel',
        'Shahin', 'Tanvir', 'Zakir', 'Iqbal', 'Mizan', 'Rony'
    ];
    const lastNames = [
        'Ahmed', 'Hossain', 'Chowdhury', 'Rahman', 'Khan', 'Miah', 'Bhuiyan', 'Sarkar',
        'Islam', 'Uddin', 'Ali', 'Begum', 'Akter', 'Patwary', 'Sikder', 'Talukder',
        'Mazumder', 'Howlader', 'Molla', 'Sheikh', 'Kazi', 'Biswas', 'Das', 'Barua',
        'Paul', 'Dev', 'Nath', 'Majumdar', 'Roy'
    ];
    return `${randomChoice(firstNames)} ${randomChoice(lastNames)}`;
}

function randomGmail() {
    const usernameLength = Math.floor(Math.random() * 6) + 7; // 7-12 chars
    const username = Array(usernameLength).fill(null).map(() => 
        'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
    return `${username}@gmail.com`;
}

function randomPhoneNumber() {
    const prefixes = ['017', '018', '019', '016', '015', '013', '014'];
    let remainingDigits = '';
    for (let i = 0; i < 8; i++) {
        remainingDigits += Math.floor(Math.random() * 10);
    }
    return `${randomChoice(prefixes)}${remainingDigits}`;
}

function randomAddress() {
    const addresses = [
        'Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Barisal', 
        'Rangpur', 'Mymensingh', 'Gazipur', 'Narayanganj', 'Tangail', 
        'Madhupur', 'Comilla', 'Jessore', 'Bogra'
    ];
    return randomChoice(addresses);
}

function randomEducation() {
    const educationLevels = ['8', '9', '10', '11', '12', '13', '14'];
    return randomChoice(educationLevels);
}

// Export all the functions
module.exports = {
    randomName,
    randomGmail,
    randomPhoneNumber,
    randomAddress,
    randomEducation
};
