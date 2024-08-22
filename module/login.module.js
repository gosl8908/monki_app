const { click, wait, uiSelectorText, waitForTextAndClick, enterText } = require('../module/utils');

async function login(driver, email, password) {
    try {
        const loginButton = await driver.$(uiSelectorText('로그인'));
        if (await loginButton.isDisplayed()) {
            await enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', email);
            await enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
            await click(driver, uiSelectorText('로그인'));
            await wait(5 * 1000);
            console.log('로그인 완료');
        }

        /* 배너 확인 */
        const eventBtn = await driver.$(uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await waitForTextAndClick(driver, '오늘하루 그만보기');
            await wait(5000);
        }
    } catch (error) {
        console.error(`로그인 중 오류 발생: ${error.message}`);
        throw error;
    }
}

module.exports = {
    login,
};
