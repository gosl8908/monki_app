const { clickElement, wait, scroll, uiSelectorBtnText, waitForTextAndClick } = require('./utils');
const fs = require('fs'); // fs 모듈 추가
const path = require('path'); // path 모듈 추가
const { getFormattedTime } = require('../config.js');

async function pay(driver, passwordDigits) {
    try {
        await wait(10000);
        await scroll(driver, 500, 1300, 500, 100);
        await clickElement(driver, uiSelectorBtnText('결제'));
        await wait(5000);

        for (const digit of passwordDigits) {
            await clickElement(driver, `android=new UiSelector().className("android.widget.Button").text("${digit}")`);
            await wait(1000);
        }

        await waitForTextAndClick(driver, '주문완료', 30000);
        console.log('결제완료 & 주문완료 텍스트가 나타났습니다.');

        // 스크린샷 캡처
        await wait(5 * 1000);
        await driver.takeScreenshot().then(screenshot => {
            const screenshotPath = path.join(
                __dirname,
                '../screenshot',
                `screenshot_${getFormattedTime().DateLabel}.jpg`,
            );
            fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
            fs.writeFileSync(screenshotPath, screenshot, 'base64');
        });
    } catch (error) {
        console.error(`주문 완료 중 오류 발생: ${error.message}`);
    }
}

module.exports = {
    pay,
};
