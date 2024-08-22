const utils = require('../module/utils'); // utils 모듈을 가져옵니다.

async function login(driver, email, password) {
    try {
        // 로그인 버튼을 찾고 클릭하기
        const loginButton = await driver.$(utils.uiSelectorText('로그인'));
        if (await loginButton.isDisplayed()) {
            await utils.enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', email);
            await utils.enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
            await utils.click(driver, utils.uiSelectorText('로그인'));
            await utils.wait(5 * 1000); // 5초 대기
            console.log('로그인 완료');
        }

        // 배너 확인 및 클릭하기
        const eventBtn = await driver.$(utils.uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await utils.waitForTextAndClick(driver, '오늘하루 그만보기');
            await utils.wait(5000); // 5초 대기
        }
    } catch (error) {
        console.error(`로그인 중 오류 발생: ${error.message}`);
        throw error;
    }
}

module.exports = {
    login,
};
