const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const fs = require('fs');
const path = require('path');
const {
    click,
    scroll,
    wait,
    uiSelectorText,
    uiSelectorBtnText,
    enterText,
    pressVolumeButton,
    contains,
} = require('../module/utils.js');
const { loginModule, searchModule, payModule, emailModule } = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수
let Failure = false;

(async () => {
    let driver;
    try {
        driver = await remote(options);

        await wait(5 * 1000);

        await loginModule.login(driver, env.email, env.password);
        // await contains(driver, '먼키지점stg2');
    } catch (error) {
        console.error(error);
        // Failure = true;
        // TestFails.push(error.message);
    } finally {
        // if (Failure) {
        //     if (driver) {
        //         try {
        //             const ScreenshotFileName = `App Test ${env.DateLabel || new Date().toISOString()}`;
        //             const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName}.png`);
        //             fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        //             fs.writeFileSync(screenshotPath, await driver.takeScreenshot(), 'base64');
        //             Screenshots.push(ScreenshotFileName);
        //         } catch (screenshotError) {
        //             console.error('Error taking screenshot:', screenshotError);
        //         }
        //         try {
        //             await driver.deleteSession();
        //             console.log('Driver session ended.');
        //         } catch (deleteSessionError) {
        //             console.error('Error ending driver session:', deleteSessionError);
        //         }
        //     }
        // }
        // const TestRange = '1. 검색';
        // await emailModule.email({
        //     TestFails: TestFails,
        //     EmailTitle: `[${env.EmailTitle}]`,
        //     TestRange: TestRange,
        //     Screenshots: Screenshots,
        // });
    }
})();
