const fs = require('fs');
const path = require('path');
const { env } = require('../config.js');

// 요소 클릭
async function click(driver, selector) {
    await driver.$(selector).click();
}

// 스크롤 동작
async function scroll(driver, startXRatio, startYRatio, endXRatio, endYRatio, duration = 1000) {
    // 디바이스의 해상도를 가져옵니다.
    const windowRect = await driver.getWindowRect();
    const deviceWidth = windowRect.width;
    const deviceHeight = windowRect.height;

    // 비율에 따라 실제 스크롤 좌표를 계산합니다.
    const startX = Math.floor(deviceWidth * startXRatio);
    const startY = Math.floor(deviceHeight * startYRatio);
    const endX = Math.floor(deviceWidth * endXRatio);
    const endY = Math.floor(deviceHeight * endYRatio);

    // 스크롤 액션을 수행합니다.
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: startY }, // 포인트 이동
                { type: 'pointerDown', button: 0 }, // 터치 다운
                { type: 'pause', duration: 1000 }, // 일시 정지
                { type: 'pointerMove', duration, origin: 'viewport', x: endX, y: endY }, // 스크롤 이동
                { type: 'pointerUp', button: 0 }, // 터치 업
            ],
        },
    ]);

    // 추가 대기 시간
    await wait(3000);
}

async function touchTap(driver, xRatio, yRatio) {
    // 디바이스의 해상도를 가져옵니다.
    const windowRect = await driver.getWindowRect();
    const deviceWidth = windowRect.width;
    const deviceHeight = windowRect.height;

    // 비율에 따라 실제 터치 좌표를 계산합니다.
    const x = Math.floor(deviceWidth * xRatio);
    const y = Math.floor(deviceHeight * yRatio);

    // 터치 액션을 수행합니다.
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: x, y: y }, // 터치 위치로 이동
                { type: 'pointerDown', button: 0 }, // 터치 다운
                { type: 'pause', duration: 200 }, // 일시 정지
                { type: 'pointerUp', button: 0 }, // 터치 업
            ],
        },
    ]);

    // 추가 대기 시간
    await wait(1000);
}

// async function scroll(driver, startX, startY, endX, endY, duration = 1000) {
//     await driver.performActions([
//         {
//             type: 'pointer',
//             id: 'finger1',
//             parameters: { pointerType: 'touch' },
//             actions: [
//                 { type: 'pointerMove', duration: 0, x: startX, y: startY }, // 포인트 이동
//                 { type: 'pointerDown', button: 0 }, // 다운
//                 { type: 'pause', duration: 1000 }, // 정지
//                 { type: 'pointerMove', duration, origin: 'viewport', x: endX, y: endY }, // 이동 위치
//                 { type: 'pointerUp', button: 0 }, // 업
//             ],
//         },
//     ]);
//     await wait(3 * 1000);
// }

// 대기
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// 텍스트로 요소 선택자 생성
const uiedit = text => `//android.widget.EditText[@text="${text}"]'`;
const uiSelector = text => `android=new UiSelector().text("${text}")`;
const uiSelectorText = text => `android=new UiSelector().textContains("${text}")`;
const uiSelectorBtnText = text => `android=new UiSelector().className("android.widget.Button").text("${text}")`;
const webText = text => `//*[text()="${text}"]`;
const containstext = text => `//*[contains(text(), "${text}")]`;
const webviewText = text => `//android.widget.TextView[@text="${text}"]`;
const btnText = text => `//android.widget.Button[@content-desc="${text}"]`;

// 텍스트 입력
async function enterText(driver, selector, value) {
    try {
        const element = await driver.$(selector);
        await element.waitForExist(3 * 1000);
        await element.setValue(value);
        await wait(3 * 1000);
        console.log(`Entered value '${value}' successfully.`);
    } catch (error) {
        console.error(`Error entering value '${value}' into element with selector '${selector}':`, error);
        throw error;
    }
}
// 텍스트 지우기
async function clearText(driver, selector, timeout = 5000) {
    try {
        // Wait for the element to be displayed
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });

        // Clear the text
        await element.clearValue(); // `clear` is deprecated in WebdriverIO v5+, use `clearValue` instead
        await wait(3 * 1000);
    } catch (error) {
        console.error(`Error clearing text in element with selector '${selector}':`, error);
        throw error;
    }
}

// 볼륨 버튼 조작
async function pressVolumeButton(driver, direction = 'up') {
    try {
        const keyCode = direction.toLowerCase() === 'up' ? 24 : 25; // 24: 볼륨 업, 25: 볼륨 다운
        await driver.pressKeyCode(keyCode);
        console.log(`Volume button '${direction}' pressed successfully.`);
    } catch (error) {
        console.error(`Error pressing volume button '${direction}':`, error);
        throw error;
    }
}

// 텍스트 확인
async function contains(driver, text) {
    try {
        const selector = uiSelectorText(text);
        const element = await driver.$(selector);
        await element.waitForExist(10 * 1000);
        console.log(`${text} 텍스트를 찾았습니다.`);
    } catch (error) {
        console.log(`${text} 텍스트를 찾지 못했습니다: ${error.message}`);
        throw error;
    }
}

/* 실패시 스크린샷 */
async function screenshot(driver, Screenshots) {
    try {
        const ScreenshotFileName = `App_Test_${env.DateLabel}`;
        const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName}.png`);
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(screenshotPath, screenshot, 'base64');
        Screenshots.push(ScreenshotFileName);
    } catch (screenshotError) {
        console.error('Error taking screenshot:', screenshotError);
        throw error;
    }
    return Screenshots; // 배열을 반환
}

// module.exports = {
//     click,
//     scroll,
//     wait,
//     uiSelectorText,
//     uiSelectorBtnText,
//     enterText,
//     clearText,
//     pressVolumeButton,
//     contains,
// };

// 모든 함수를 자동으로 export
const utils = {
    click,
    scroll,
    uiedit,
    webText,
    containstext,
    wait,
    webviewText,
    uiSelector,
    uiSelectorText,
    uiSelectorBtnText,
    btnText,
    enterText,
    clearText,
    pressVolumeButton,
    contains,
    touchTap,
    screenshot,
};

module.exports = utils;
