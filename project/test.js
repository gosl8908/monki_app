const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const fs = require('fs');
const path = require('path');
const utils = require('../module/utils');
const Module = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수
let Failure = false;

(async () => {
    let driver;
    try {
        driver = await remote(options);

        await utils.wait(5 * 1000);

        // await utils.scroll(driver, 500, 2000, 500, 0);
        await utils.scroll(driver, 0.5, 0.8, 0.5, 0.0);

        // await Module.loginModule.login(driver, env.email, env.password);
        // await searchModule.search(driver, '몬키지점stg');
        // await payModule.pay(driver, env.cardPassword);
    } catch (error) {
        // console.error(error);
        // Failure = true;
        // TestFails.push(error.message);
    } finally {
        //     if (Failure) {
        //         if (driver) {
        //             try {
        //                 const ScreenshotFileName = `App Test ${env.DateLabel}`;
        //                 const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName}.png`);
        //                 fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        //                 fs.writeFileSync(screenshotPath, await driver.takeScreenshot(), 'base64');
        //                 Screenshots.push(ScreenshotFileName);
        //             } catch (screenshotError) {
        //                 console.error('Error taking screenshot:', screenshotError);
        //             }
        //             try {
        //                 await driver.deleteSession();
        //                 console.log('Driver session ended.');
        //             } catch (deleteSessionError) {
        //                 console.error('Error ending driver session:', deleteSessionError);
        //             }
        //         }
        //     }
        //     const TestRange = '1. 테스트';
        //     await Module.emailModule.email({
        //         TestFails: TestFails,
        //         EmailTitle: `[${env.EmailTitle}]`,
        //         TestRange: TestRange,
        //         Screenshots: Screenshots,
        //     });
    }
})();
