const utils = require('./utils'); // utils 모듈을 가져옵니다.

async function boot(driver) {
    try {
        await utils.click(driver, utils.uiSelector('앱 사용 중에만 허용'));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.uiSelector('모두 허용'));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.uiSelector('앱 사용 중에만 허용'));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.uiSelector('허용'));
        await utils.wait(1 * 1000);
        // 로그인 버튼을 찾고 클릭하기
        const loginButton = await driver.$(utils.uiSelectorText('앱 접근 권한 안내'));
        if (await loginButton.isDisplayed()) {
            await utils.click(driver, utils.uiSelector('확인'));
            await utils.wait(5 * 1000); // 5초 대기
        }

        await utils.scroll(driver, 0.9, 0.5, 0.1, 0.5);
        await utils.wait(3 * 1000);
        await utils.scroll(driver, 0.9, 0.5, 0.1, 0.5);
        await utils.wait(3 * 1000);
        await utils.scroll(driver, 0.9, 0.5, 0.1, 0.5);
        await utils.wait(3 * 1000);

        await utils.click(driver, utils.uiSelector('시작하기'));
        await utils.wait(3 * 1000);
        console.log('부팅 성공');
    } catch (error) {
        console.error(`부팅 중 오류 발생: ${error.message}`);
        throw error;
    }
}

module.exports = {
    boot,
};
