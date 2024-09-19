const utils = require('../module/utils'); // utils 모듈을 가져옵니다.

async function login(driver, email, password) {
    try {
        // 로그인 버튼을 찾고 클릭하기
        const loginButton = await driver.$(utils.uiSelectorText('로그인'));
        if (await loginButton.isDisplayed()) {
            await utils.enterText(driver, utils.uiSelector('이메일을 입력해 주세요'), email);
            await utils.enterText(driver, utils.uiSelector('비밀번호를 입력해 주세요'), password);
            await utils.click(driver, utils.uiSelectorText('로그인'));
            await utils.wait(5 * 1000); // 5초 대기
        }
        // 배너 확인 및 클릭하기
        const eventBtn = await driver.$(utils.uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await utils.contains(driver, '오늘하루 그만보기');
            await utils.click(driver, '오늘하루 그만보기');
            await utils.wait(5000); // 5초 대기
        }
        await utils.contains(driver, '자주가는 먼키지점');
        console.log('로그인 완료');
    } catch (error) {
        console.error(`로그인 중 오류 발생: ${error.message}`);
        throw error;
    }
}

async function logout(driver) {
    try {
        await utils.click(driver, utils.uiSelectorText('My먼키'));
        await utils.click(driver, utils.uiSelectorText('내정보'));
        await utils.scroll(driver, 0.5, 0.8, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('로그아웃'));
        await utils.click(driver, utils.uiSelectorText('확인'));
        await utils.contains(driver, '로그인');
    } catch (error) {
        console.error(`로그아웃 중 오류 발생: ${error.message}`);
        throw error;
    }
}

async function signout(driver) {
    try {
        await utils.click(driver, utils.uiSelectorText('My먼키'));
        await utils.click(driver, utils.uiSelectorText('내정보'));
        await utils.scroll(driver, 0.5, 0.8, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('회원탈퇴'));
        await utils.click(driver, utils.uiSelectorText('탈퇴에 대한 유의사항을 모두 확인하였습니다.'));
        await utils.click(driver, utils.uiSelectorText('계정 삭제하기'));
        await utils.click(driver, utils.uiSelectorText('회원 탈퇴가 완료되었습니다.'));
        await utils.click(driver, utils.uiSelectorText('확인'));
        await utils.contains(driver, '로그인');
    } catch (error) {
        console.error(`회원탈퇴 중 오류 발생: ${error.message}`);
        throw error;
    }
}

module.exports = {
    login,
    logout,
    signout,
};
