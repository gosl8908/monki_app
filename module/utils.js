// 요소 클릭
async function clickElement(driver, selector) {
    const element = await driver.$(selector);
    await element.click();
}

// 스크롤 동작
async function scroll(driver, startX, startY, endX, endY, duration = 1000) {
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: startY }, // 포인트 이동
                { type: 'pointerDown', button: 0 }, // 다운
                { type: 'pause', duration: 1000 }, // 정지
                { type: 'pointerMove', duration, origin: 'viewport', x: endX, y: endY }, // 이동 위치
                { type: 'pointerUp', button: 0 }, // 업
            ],
        },
    ]);
}

// 대기
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// 텍스트로 요소 선택자 생성
const uiSelectorText = text => `android=new UiSelector().text("${text}")`;
const uiSelectorBtnText = text => `android=new UiSelector().className("android.widget.Button").text("${text}")`;

// 텍스트 입력
async function enterText(driver, selector, value, timeout = 5000) {
    try {
        const element = await driver.$(selector);
        await element.waitForExist({ timeout });
        await element.setValue(value);
        console.log(`Entered value '${value}' successfully.`);
    } catch (error) {
        console.error(`Error entering value '${value}' into element with selector '${selector}':`, error);
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
    } catch (error) {
        console.error(`Error clearing text in element with selector '${selector}':`, error);
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
    }
}

// 텍스트 인식 클릭
async function waitForTextAndClick(driver, text, timeout = 5000) {
    try {
        const selector = uiSelectorText(text);
        const element = await driver.$(selector);
        await element.waitForExist({ timeout });
        await element.click();
        console.log(`"${text}" 텍스트를 찾고 클릭했습니다.`);
    } catch (error) {
        console.log(`"${text}" 텍스트를 찾지 못했습니다: ${error.message}`);
    }
}

// 텍스트 인식 클릭
async function contains(driver, text, timeout = 5000) {
    try {
        const selector = uiSelectorText(text);
        const element = await driver.$(selector);
        await element.waitForExist({ timeout });
        console.log(`"${text}" 텍스트를 찾았습니다.`);
    } catch (error) {
        console.log(`"${text}" 텍스트를 찾지 못했습니다: ${error.message}`);
    }
}
module.exports = {
    clickElement,
    scroll,
    wait,
    uiSelectorText,
    uiSelectorBtnText,
    enterText,
    clearText,
    pressVolumeButton,
    waitForTextAndClick,
    contains,
};
