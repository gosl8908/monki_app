const { remote } = require('webdriverio');
const { options, getFormattedTime, env } = require('../config.js');
const { clickElement, scroll, wait, uiSelectorText, enterText } = require('../module/utils.js');

const serverUrl = 'http://localhost:4723';

async function login(driver, email, password) {
    try {
        await enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', email);
        await enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
        await clickElement(driver, uiSelectorText('로그인'));
        console.log(`로그인 완료`);
    } catch (error) {
        console.error(`로그인 중 오류 발생: ${error.message}`);
    }
}

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

async function logout(driver) {
    await clickElement(driver, uiSelectorText('My먼키'));
    await wait(2000);
    await clickElement(driver, uiSelectorText('내정보'));
    await wait(2000);
    const orderCompleteTextSelector = uiSelectorText('환stg');
    try {
        const orderCompleteText = await driver.$(orderCompleteTextSelector);
        await orderCompleteText.waitForExist({ timeout: 30 * 1000 });
        console.log('닉네임 텍스트 확인');
    } catch (error) {
        console.log('닉네임 텍스트가 30초 내에 나타나지 않았습니다.');
    }

    await scroll(driver, 500, 1500, 500, 0);
    await wait(2000);

    await clickElement(driver, uiSelectorText('로그아웃'));
    await wait(2000);

    await clickElement(driver, uiSelectorText('확인'));
    await wait(2000);
}

async function verifyLogout(driver) {
    const loginTextSelector = uiSelectorText('로그인');
    try {
        const loginText = await driver.$(loginTextSelector);
        await loginText.waitForExist({ timeout: 30000 });
        console.log('로그아웃 성공, 로그인 화면이 표시되었습니다.');
    } catch (error) {
        console.error('로그아웃 실패: ', error.message);
    }
}

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await wait(5 * 1000);

        /* 로그인 */
        const loginButton = await driver.$(uiSelectorText('로그인'));
        if (await loginButton.isDisplayed()) {
            await login(driver, env.email, env.password);
            await wait(5000);
        }

        /* 배너 확인 */
        const eventBtn = await driver.$(uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await waitForTextAndClick(driver, '오늘하루 그만보기');
            await wait(5000);
        }

        // 내 계정 메뉴에서 로그아웃
        await logout(driver);

        // 로그아웃 확인
        await verifyLogout(driver);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();