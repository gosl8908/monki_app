const { isDisplayed } = require('wd/lib/commands');
const utils = require('../module/utils'); // utils 모듈을 가져옵니다.

async function login(driver, email, password) {
    try {
        // 로그인 버튼을 찾고 클릭하기
        const loginButton = await driver.$(utils.uiSelectorText('로그인'));
        if (await loginButton.isDisplayed()) {
            await utils.enterText(driver, utils.uiSelector('이메일을 입력해 주세요'), email);
            await utils.enterText(driver, utils.uiSelector('비밀번호를 입력해 주세요'), password);
            await utils.click(driver, utils.uiSelectorText('로그인'));
        }
        await utils.wait(10 * 1000);
        const Text = await driver.$(utils.uiSelectorText('무료배달, 매장식사/포장, 브랜드관 등'));
        if (await Text.isDisplayed()) {
            await utils.wait(3 * 1000);
            await utils.touchTap(driver, 0.1, 0.05);
        }
        // 배너 확인 및 클릭하기
        const eventBtn = await driver.$(utils.uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await utils.click(driver, utils.uiSelectorText('오늘하루 그만보기'));
            await utils.wait(5000); // 5초 대기
        }
        await utils.contains(driver, utils.uiSelectorText('자주가는 먼키지점'));
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
        await utils.contains(driver, utils.uiSelectorText('로그인'));
    } catch (error) {
        console.error(`로그아웃 중 오류 발생: ${error.message}`);
        throw error;
    }
}

async function signout(driver) {
    try {
        await utils.click(driver, utils.uiSelectorText('My먼키'));

        await utils.contains(driver, utils.uiSelector('stg몬키'));

        await utils.click(driver, utils.uiSelectorText('내정보'));
        await utils.scroll(driver, 0.5, 0.8, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('회원탈퇴'));
        await utils.click(driver, utils.uiSelectorText('탈퇴에 대한 유의사항을 모두 확인하였습니다.'));
        await utils.click(driver, utils.uiSelectorText('계정 삭제하기'));
        await utils.click(driver, utils.uiSelectorText('회원 탈퇴가 완료되었습니다.'));
        await utils.click(driver, utils.uiSelectorText('확인'));
        await utils.contains(driver, utils.uiSelectorText('로그인'));
    } catch (error) {
        console.error(`회원탈퇴 중 오류 발생: ${error.message}`);
        throw error;
    }
}
async function TOlogin(driver, email, password) {
    try {
        const login = await driver.$(`//android.widget.Button[@content-desc="로그인"]`);
        if (await login.isDisplayed()) {
            const ID = await driver.$(`android=new UiSelector().className("android.widget.EditText")`);
            const PASSWORD = await driver.$$(`android=new UiSelector().className("android.widget.EditText")`);
            await utils.click(driver, ID);
            await utils.enterText(driver, ID, email);
            await utils.click(driver, PASSWORD[1]);
            await utils.enterText(driver, PASSWORD[1], password);

            await driver.pressKeyCode(66);

            await utils.click(driver, utils.btnText('로그인'));

            if (email === 'monkitest2') {
                await utils.containsview('교촌치킨(stg)', { timeout: 10 * 1000 });
            } else if (email === 'monkifav2') {
                await utils.containsview('번개단골맛집-강남(stg)', { timeout: 10 * 1000 });
            }
            console.log('로그인 완료');
        }

        /* 대기 이미지 */
        const waiting = await driver.$(utils.view('주문하시려면 화면을 터치해 주세요'));
        if (await waiting.isDisplayed()) {
            await utils.click(driver, utils.ImageView('주문하기'));
            await utils.wait(3 * 1000);
        }
        if (email === 'monkitest2') {
            const text = await driver.$(utils.view('안녕하세요 :)\n저희는 선불로 운영되는 매장이에요'));
            if (await text.isDisplayed()) {
                await utils.click(driver, utils.btnText('확인'));
                await utils.contains(driver, utils.view('교촌치킨(stg)', { timeout: 5 * 1000 }));
            }
        } else if (email === 'monkifav2') {
            const text = await driver.$(utils.view('안녕하세요 :) 메뉴 확인 후 바로 주문해 주세요'));
            if (await text.isDisplayed()) {
                await utils.click(driver, utils.btnText('확인'));
                await utils.contains(driver, utils.view('번개단골맛집-강남(stg)', { timeout: 5 * 1000 }));
            }
        }
    } catch (error) {
        console.error(`로그인 중 오류 발생: ${error.message}`);
        throw error;
    }
}

module.exports = {
    login,
    TOlogin,
    logout,
    signout,
};
