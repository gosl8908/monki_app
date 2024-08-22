const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const fs = require('fs');
const path = require('path');
const {
    click,
    scroll,
    wait,
    uiSelectorText,
    uiSelectorBtnText,
    enterText,
    pressVolumeButton,
    contains,
} = require('../module/utils.js');
const { loginModule, searchModule, payModule, emailModule } = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수
let Failure = false;

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await wait(5 * 1000);

        await loginModule.login(driver, env.email, env.password);

        /* 검색 */
        await searchModule.search(driver, '몬키지점stg');
        console.log('검색 성공');

        /* 메뉴 */
        await wait(10 * 1000);
        await scroll(driver, 500, 1500, 500, 0);
        await click(driver, uiSelectorText('라면'));
        console.log('메뉴 상세 진입 성공');

        /* 장바구니 담기 */
        await wait(10 * 1000);
        await scroll(driver, 500, 1500, 500, 0);
        await click(driver, uiSelectorText('기본'), { timeout: 30 * 1000 });
        await wait(5 * 1000);
        await click(driver, uiSelectorText("//*[contains(text(), '장바구니 담기')]"));
        await wait(5 * 1000);
        await click(driver, uiSelectorText('장바구니 보기'), { timeout: 30 * 1000 });
        await wait(5 * 1000);
        await click(driver, uiSelectorText('매장식사 주문'));
        console.log('메뉴 장바구니 담기 성공');

        /* 결제 */
        await payModule.order(driver);

        /* 카드 입력 & 주문완료 확인 */
        await payModule.pay(driver, env.cardPassword);

        /* 주문취소 */
        await click(driver, uiSelectorText('주문취소'));
        await wait(5000);
        await click(driver, uiSelectorText('단순 변심'));
        await wait(5000);
        await click(driver, uiSelectorText('취소하기'));
        await waitForTextAndClick(driver, '주문이 취소되었습니다.', 30000);
        console.log('주문취소 완료 텍스트가 나타났습니다.');

        await click(driver, uiSelectorText('확인'));
    } catch (error) {
        console.error(error);
        Failure = true;
        TestFails.push(error.message);
    } finally {
        if (Failure && driver) {
            try {
                const ScreenshotFileName = `App Test ${env.DateLabel || new Date().toISOString()}`;
                const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName}.png`);
                fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
                fs.writeFileSync(screenshotPath, await driver.takeScreenshot(), 'base64');
                Screenshots.push(ScreenshotFileName);
            } catch (screenshotError) {
                console.error('Error taking screenshot:', screenshotError);
            }
            try {
                await driver.deleteSession();
                console.log('Driver session ended.');
            } catch (deleteSessionError) {
                console.error('Error ending driver session:', deleteSessionError);
            }
        }
        const TestRange = '1. 검색';
        await emailModule.email({
            TestFails: TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: TestRange,
            Screenshots: Screenshots,
        });
    }
})();
