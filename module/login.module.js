const { clickElement, wait, uiSelectorText, enterText } = require('../module/utils');

async function Login(driver, email, password) {
    try {
        await enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', email);
        await enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
        await clickElement(driver, uiSelectorText('로그인'));
        console.log(`로그인 완료`);
    } catch (error) {
        console.error(`로그인 중 오류 발생: ${error.message}`);
    }
}

async function login(driver, email, password) {
    /* 로그인 */
    const loginButton = await driver.$(uiSelectorText('로그인'));
    if (await loginButton.isDisplayed()) {
        await Login(driver, email, password);
        await wait(5000);
    }
}

module.exports = {
    login: login,
};
