const { clickElement, wait, scroll, uiSelectorBtnText, uiSelectorText, waitForTextAndClick } = require('./utils');
const fs = require('fs'); // fs 모듈 추가
const path = require('path'); // path 모듈 추가
const { env } = require('../config.js');

async function order(driver, type = undefined) {
    try {
        /* 결제 */
        await wait(10000);
        await scroll(driver, 500, 2500, 500, 0);
        await clickElement(driver, uiSelectorText('모두사용'));
        await wait(5000);
        await clickElement(driver, uiSelectorText('간편결제'));
        await wait(5000);
        await scroll(driver, 500, 1000, 500, 0);
        await clickElement(driver, uiSelectorText('개인정보 제3자 제공 내용 및 결제에 동의합니다.'));
        await wait(5000);

        if (type === '무료배달') {
            await clickElement(driver, uiSelectorText('무료배달 결제하기'));
        }
        await clickElement(driver, uiSelectorText('결제하기'));
    } catch (error) {
        console.error(`주문 완료 중 오류 발생: ${error.message}`);
    }
}
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
            const screenshotPath = path.join(__dirname, '../screenshot', `screenshot_${env.DateLabel}.jpg`);
            fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
            fs.writeFileSync(screenshotPath, screenshot, 'base64');
        });
    } catch (error) {
        console.error(`주문 완료 중 오류 발생: ${error.message}`);
    }
}

module.exports = {
    pay,
    order,
};
