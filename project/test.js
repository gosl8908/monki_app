const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const fs = require('fs');
const path = require('path');
const {
    clickElement,
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

let TestFails = []; // 실패 원인을 저장할 변수
let Screenshots = []; // 스크린샷을 저장할 배열
let Failure = false;

(async () => {
    let driver;

    try {
        driver = await remote(options);
        await wait(5 * 1000);
        // await contains(driver, 'asdasdasd', 1 * 1000);
        const result = await contains(driver, 'asdasdasd', 1 * 1000);
        if (!result) {
            throw new Error('Element not found');
        }
    } catch (Error) {
        console.error('Error occurred:', Error);
        TestFails.push(Error.message || '알 수 없는 이유로 실패함'); // 실패 원인 저장
        Failure = true; // 오류 발생 시 Failure 상태 변경
    } finally {
        if (Failure && driver) {
            const ScreenshotFileName2 = `App Test ${env.DateLabel}`;
            try {
                const screenshot = await driver.takeScreenshot();
                const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName2}.png`);
                fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
                fs.writeFileSync(screenshotPath, screenshot, 'base64');
                Screenshots.push(ScreenshotFileName2);
            } catch (screenshotError) {
                console.error('Error taking screenshot:', screenshotError);
            }
        }
        Failure = false;
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
        const TestRange = '1. 검색';
        await emailModule.email({
            TestFails: TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: TestRange,
            Screenshots: Screenshots,
        });
    }
})();
