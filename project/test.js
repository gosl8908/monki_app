const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const utils = require('../module/utils');
const Module = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await utils.wait(5000);
        await utils.contains(driver, 'asdasdasd');
        // await Module.loginModule.login(driver, env.email, env.password);
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        if (driver) {
            try {
                await driver.deleteSession();
                console.log('Driver session ended.');
            } catch (deleteSessionError) {
                console.error('Error ending driver session:', deleteSessionError);
            }
        }
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: '1. 테스트',
            Screenshots,
        });
    }
})();

// const { remote } = require('webdriverio');
// const { options, env } = require('../config.js');
// const utils = require('../module/utils');
// const Module = require('../module/manager.module.js');
// const { constants } = require('buffer');

// const serverUrl = 'http://localhost:4723';
// let Screenshots = []; // 스크린샷을 저장할 배열
// let TestFails = []; // 실패 원인을 저장할 변수
// let Failure = false;

// (async () => {
//     let driver;
//     try {
//         driver = await remote(options);

//         await utils.wait(5 * 1000);
//         await utils.contains(driver, '간편회원가입');
//         // await Module.loginModule.login(driver, env.email, env.password);
//     } catch (error) {
//         console.error(error);
//         Failure = true;
//         TestFails.push(error.message);
//     } finally {
//         if (Failure) {
//             if (driver) {
//                 await utils.screenshot(driver, Screenshots);
//                 try {
//                     await driver.deleteSession();
//                     console.log('Driver session ended.');
//                 } catch (deleteSessionError) {
//                     console.error('Error ending driver session:', deleteSessionError);
//                 }
//             }
//         }
//         const TestRange = '1. 테스트';
//         await Module.emailModule.email({
//             TestFails: TestFails,
//             EmailTitle: [${env.EmailTitle}],
//             TestRange: TestRange,
//             Screenshots: Screenshots,
//         });
//     }
// })();
