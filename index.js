// index.js

const express = require('express');
const axios = require('axios');
const path = require('path');
const chalk = require('chalk');
const { randomName, randomGmail, randomPhoneNumber, randomAddress, randomEducation } = require('./data-generator');

// --- CONFIGURATION ---
const app = express();
// Use environment variables for security and flexibility on Render
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "your-default-secret"; // A secret to protect admin actions

// --- STATE MANAGEMENT ---
let isBotRunning = false; // Control the bot's on/off state
let totalAccountsCreated = 0;
let accountsBatch = []; // Holds details for the next Telegram message
let allCreatedAccounts = []; // Stores all accounts for download

// --- TELEGRAM FUNCTION ---
async function sendToTelegram(message) {
    if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
        console.log(chalk.yellow("[WARNING] Telegram credentials are not set in environment variables. Skipping notification."));
        return;
    }
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log(chalk.cyan("[TELEGRAM] Batch notification sent successfully."));
    } catch (error) {
        console.error(chalk.red("[TELEGRAM FAILED]"), error.response ? error.response.data : error.message);
    }
}

// --- CORE BOT LOGIC ---
async function createAccount() {
    const password = "@@@@11Aa";
    const accountData = {
        name: randomName(),
        email: randomGmail(),
        phone: randomPhoneNumber(),
        address: randomAddress(),
        education: randomEducation(),
        password: password
    };
    
    // The data payload for the POST request must be in URL-encoded format
    const postData = new URLSearchParams({
        "indecator": "1",
        "user_name": accountData.name,
        "user_email": accountData.email,
        "user_phon": accountData.phone,
        "user_adress": accountData.address,
        "user_school": "School Name",
        "user_education": accountData.education,
        "user_pass": password,
        "user_pass_check": password,
        "user_location": "ঢাকা",
        "gender": "1",
        "numone": "9",
        "numtwo": "0",
        "result": "9",
        "confarm_registration": "নিবন্ধন করুন"
    });

    try {
        const response = await axios.post("https://golperjhuri.com/register.php", postData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // A more reliable check for success
        if (response.status === 200 && response.data.toLowerCase().includes("success")) {
            totalAccountsCreated++;
            console.log(chalk.green(`[SUCCESS] ${totalAccountsCreated}: ${accountData.name} - ${accountData.email}`));
            
            const newAccountInfo = { name: accountData.name, email: accountData.email, password: accountData.password };
            accountsBatch.push(newAccountInfo);
            allCreatedAccounts.push(newAccountInfo);

            if (accountsBatch.length >= 10) {
                let message = "*🎉 10 New Accounts Created!*\n";
                accountsBatch.forEach((acc, index) => {
                    message += `\n\`------------------\`\n*${index + 1}. Name:* \`${acc.name}\`\n*Email:* \`${acc.email}\`\n*Pass:* \`${acc.password}\``;
                });
                await sendToTelegram(message);
                accountsBatch = []; // Clear the batch
            }
        } else {
            console.log(chalk.red("[FAILED] Registration failed. Status:", response.status));
        }
    } catch (error) {
        console.error(chalk.red("[REQUEST ERROR]"), error.message);
    }
}

// --- CONTINOUS LOOP ---
async function botLoop() {
    while (true) {
        if (isBotRunning) {
            await createAccount();
        }
        // A small, non-blocking delay to be respectful to the target server
        await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay between attempts
    }
}

// --- WEB SERVER & ADMIN PANEL ---
app.use(express.static('public')); // Serve static files from 'public' folder

// Simple middleware for secret key authentication
const checkSecret = (req, res, next) => {
    if (req.query.secret !== ADMIN_SECRET) {
        return res.status(403).send("Forbidden: Invalid secret key.");
    }
    next();
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to keep the service alive
app.get('/ping', (req, res) => {
    res.status(200).send("I am alive and well! Bot is " + (isBotRunning ? "running." : "stopped."));
});

// Admin controls
app.get('/start', checkSecret, (req, res) => {
    if (!isBotRunning) {
        isBotRunning = true;
        console.log(chalk.bgGreen.bold("Bot started via web panel."));
        res.send("Bot started successfully.");
    } else {
        res.send("Bot is already running.");
    }
});

app.get('/stop', checkSecret, (req, res) => {
    if (isBotRunning) {
        isBotRunning = false;
        console.log(chalk.bgRed.bold("Bot stopped via web panel."));
        res.send("Bot stopped successfully.");
    } else {
        res.send("Bot is already stopped.");
    }
});

app.get('/data/:format', checkSecret, (req, res) => {
    const { format } = req.params;
    
    if (format === 'json') {
        res.json(allCreatedAccounts);
    } else if (format === 'txt') {
        let txtData = "Created Accounts\n==================\n\n";
        allCreatedAccounts.forEach(acc => {
            txtData += `Name: ${acc.name}\nEmail: ${acc.email}\nPassword: ${acc.password}\n\n`;
        });
        res.header('Content-Type', 'text/plain');
        res.send(txtData);
    } else if (format === 'doc') {
        let docData = "Created Accounts\n==================\n\n";
        allCreatedAccounts.forEach(acc => {
            docData += `Name: ${acc.name}\nEmail: ${acc.email}\nPassword: ${acc.password}\n\n`;
        });
        res.header('Content-Disposition', 'attachment; filename="accounts.doc"');
        res.header('Content-Type', 'application/msword');
        res.send(docData);
    } else {
        res.status(400).send("Invalid format. Use 'json', 'txt', or 'doc'.");
    }
});

// Start the server and the bot loop
app.listen(PORT, () => {
    console.log(chalk.blue(`Server listening on port ${PORT}`));
    console.log(chalk.yellow(`Admin panel: http://localhost:${PORT}`));
    console.log(chalk.magenta(`To start the bot, go to http://localhost:${PORT}/start?secret=${ADMIN_SECRET}`));
    botLoop(); // Start the infinite loop
});
