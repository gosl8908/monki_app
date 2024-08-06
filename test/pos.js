// const { exec } = require('child_process');

// exec(`start "" "C:\\Users\\monthlykitchen\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Monthly Kitchen\\Monthly Kitchen POS\\MonthlyKitchenPOS.appref-ms"`, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//     }

//     if (stderr) {
//         console.error(`Stderr: ${stderr}`);
//         return;
//     }

//     console.log(`Stdout: ${stdout}`);
// });

const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// 파일 경로
const filePath = 'C:\\Users\\monthlykitchen\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Monthly Kitchen\\Monthly Kitchen POS\\MonthlyKitchenPOS.appref-ms';

// 루트 엔드포인트 설정
app.get('/', (req, res) => {
    exec(`start "" "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send(`Error: ${error.message}`);
        }

        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send(`Stderr: ${stderr}`);
        }

        console.log(`Stdout: ${stdout}`);
        res.send('Monthly Kitchen POS application started!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
