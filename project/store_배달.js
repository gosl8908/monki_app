const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const fs = require('fs');
const path = require('path');
const utils = require('../module/utils.js'); // utils 모듈을 가져옵니다.
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

        await Module.loginModule.login(driver, env.email, env.password);

        // 검색
        await utils.click(driver, utils.uiSelectorText('무료배달'));
        await utils.wait(5 * 1000);
        await utils.click(driver, utils.uiSelectorText('먼키지점'), { timeout: 10 * 1000 });
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 500, 2000, 500, 0);
        await utils.click(driver, utils.uiSelectorText('몬키지점stg'), { timeout: 10 * 1000 });
        console.log('검색 성공');

        // 메뉴
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 500, 1500, 500, 0);
        await utils.click(driver, utils.uiSelectorText('비빔밥'));
        console.log('메뉴 상세 진입 성공');

        // 장바구니 담기
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 500, 1500, 500, 0);
        await utils.click(driver, utils.uiSelectorText('특대'), { timeout: 30 * 1000 });
        await utils.wait(5 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 담기'));
        await utils.wait(10 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 보기'));
        await utils.wait(5 * 1000);
        await utils.click(driver, utils.uiSelectorText('무료배달 주문'));
        console.log('메뉴 장바구니 담기 성공');

        // 결제
        await Module.payModule.order(driver, '무료배달');

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
        if (Failure) {
            if (driver) {
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
        }

        // 이메일 전송
        const TestRange = '1. 지점 배달 결제';
        await Module.emailModule.email({
            TestFails: TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: TestRange,
            Screenshots: Screenshots,
        });
    }
})();
