const { clickElement, wait, uiSelectorText, enterText } = require('../module/utils');

async function login(driver, email, password) {
    try {
        const loginButton = await driver.$(uiSelectorText('로그인'));
        if (await loginButton.isDisplayed()) {
            await enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', email);
            await enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
            await clickElement(driver, uiSelectorText('로그인'));
            console.log('로그인 완료');
            await wait(5000);
        }
    } catch (error) {
        console.error(`로그인 중 오류 발생: ${error.message}`);
    }
}

module.exports = {
    login,
};
