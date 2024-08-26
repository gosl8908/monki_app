const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const fs = require('fs');
const path = require('path');
const utils = require('../module/utils.js'); // utils 모듈 가져오기
const Module = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 배열
let Failure = false;

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await utils.wait(5 * 1000);

        /* 로그인 */
        await Module.loginModule.login(driver, env.email, env.password);

        // 검색
        await Module.searchModule.search(driver, '몬키지점stg');

        // 메뉴
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 0.5, 0.75, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('라면'));
        console.log('메뉴 상세 진입 성공');

        // 장바구니 담기
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 0.5, 0.75, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('기본'), { timeout: 30 * 1000 });
        await utils.wait(5 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 담기'));
        await utils.wait(5 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 보기'), { timeout: 30 * 1000 });
        await utils.wait(5 * 1000);
        await utils.click(driver, utils.uiSelectorText('매장식사 주문'));
        console.log('메뉴 장바구니 담기 성공');

        // 결제
        await Module.payModule.order(driver);

        // 카드 입력 & 주문완료 확인
        await Module.payModule.pay(driver, env.cardPassword);

        // 주문취소
        await utils.click(driver, utils.uiSelectorText('주문취소'));
        await utils.wait(5000);
        await utils.click(driver, utils.uiSelectorText('단순 변심'));
        await utils.wait(5000);
        await utils.click(driver, utils.uiSelectorText('취소하기'));
        await utils.waitForTextAndClick(driver, '주문이 취소되었습니다.', 30000);
        console.log('주문취소 완료 텍스트가 나타났습니다.');

        await utils.click(driver, utils.uiSelectorText('확인'));
    } catch (error) {
        console.error(error);
        Failure = true;
        TestFails.push(error.message);
    } finally {
        if (Failure && driver) {
            try {
                const ScreenshotFileName = `App_Test_${env.DateLabel || new Date().toISOString()}`;
                const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName}.png`);
                fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
                const screenshot = await driver.takeScreenshot();
                fs.writeFileSync(screenshotPath, screenshot, 'base64');
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
        const TestRange = '1. 지점 매장식사 결제';
        await Module.emailModule.email({
            TestFails: TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: TestRange,
            Screenshots: Screenshots,
        });
    }
})();
