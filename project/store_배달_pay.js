const { remote } = require('webdriverio');
const { options, getFormattedTime } = require('../config.js');
const fs = require('fs'); // fs 모듈 추가
const path = require('path'); // path 모듈 추가
const {
    clickElement,
    scroll,
    wait,
    uiSelectorText,
    uiSelectorBtnText,
    inputText,
    enterText,
} = require('../module/utils.js');

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

async function completeOrder(driver, passwordDigits) {
    try {
        await wait(10000);
        await scroll(driver, 500, 1300, 500, 100);
        await clickElement(driver, uiSelectorBtnText('결제'));
        await wait(5000);

        for (const digit of passwordDigits) {
            await clickElement(driver, `android=new UiSelector().className("android.widget.Button").text("${digit}")`);
            await wait(1000);
        }

        await waitForTextAndClick(driver, '주문완료', 30000);
        console.log('결제완료 & 주문완료 텍스트가 나타났습니다.');

        // 스크린샷 캡처
        await wait(5 * 1000);
        await driver.takeScreenshot().then(screenshot => {
            const screenshotPath = path.join(__dirname, '../screenshot', `screenshot_${getFormattedTime()}.jpg`);
            fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
            fs.writeFileSync(screenshotPath, screenshot, 'base64');
        });
    } catch (error) {
        console.error(`주문 완료 중 오류 발생: ${error.message}`);
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
            await login(driver, 'hskang@monki.net', 'test123!');
            await wait(5000);
        }

        /* 배너 확인 */
        const eventBtn = await driver.$(uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await waitForTextAndClick(driver, '오늘하루 그만보기');
            await wait(5000);
        }

        /* 검색 */
        await clickElement(driver, uiSelectorText('무료배달'));
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('먼키지점'), { timeout: 10 * 1000 });
        await wait(10 * 1000);
        await scroll(driver, 500, 2000, 500, 0);
        await clickElement(driver, uiSelectorText('몬키지점stg'), { timeout: 10 * 1000 });
        console.log('검색 성공');

        /* 메뉴 */
        await wait(10 * 1000);
        await scroll(driver, 500, 1500, 500, 0);
        await clickElement(driver, uiSelectorText('비빔밥'));
        console.log('메뉴 상세 진입 성공');

        /* 장바구니 담기 */
        await wait(10 * 1000);
        await scroll(driver, 500, 1500, 500, 0);
        await clickElement(driver, uiSelectorText('특대'), { timeout: 30 * 1000 });
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('16,500원 장바구니 담기'));
        await wait(10 * 1000);
        await clickElement(driver, uiSelectorText('장바구니 보기'));
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('무료배달 주문'));
        console.log('메뉴 장바구니 담기 성공');

        /* 결제 */
        await wait(5 * 1000);
        await scroll(driver, 500, 2000, 200, 0);
        await clickElement(driver, uiSelectorText('모두사용'));
        await wait(5000);
        await clickElement(driver, uiSelectorText('간편결제'));
        await wait(5000);
        await scroll(driver, 500, 1000, 500, 0);
        await clickElement(driver, uiSelectorText('개인정보 제3자 제공 내용 및 결제에 동의합니다.'));
        await wait(5000);
        await clickElement(driver, uiSelectorText('무료배달 결제하기'));

        /* 카드 입력 & 주문완료 확인 */
        const cardPassword = ['9', '4', '0', '5', '1', '3'];
        await completeOrder(driver, cardPassword);

        /* 주문취소 */
        await clickElement(driver, uiSelectorText('주문취소'));
        await wait(5000);
        await clickElement(driver, uiSelectorText('단순 변심'));
        await wait(5000);
        await clickElement(driver, uiSelectorText('취소하기'));
        await waitForTextAndClick(driver, '주문이 취소되었습니다.', 30000);
        console.log('주문취소 완료 텍스트가 나타났습니다.');

        await clickElement(driver, uiSelectorText('확인'));
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
