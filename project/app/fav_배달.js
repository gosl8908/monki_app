const { remote } = require('webdriverio');
const { appoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js'); // utils 모듈을 가져옵니다.
const Module = require('../../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 배열

(async () => {
    let driver;
    try {
        driver = await remote(appoptions);
        await utils.wait(5 * 1000);

        await Module.loginModule.login(driver, env.email, env.password);

        // 검색
        await Module.searchModule.search(driver, '번개');

        // 메뉴
        await utils.wait(10 * 1000);
        await utils.click(driver, utils.uiSelectorText('무료배달'));
        await utils.scroll(driver, 0.5, 0.75, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('치킨'));
        console.log('메뉴 상세 진입 성공');

        // 장바구니 담기
        await utils.wait(10 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 담기'));
        await utils.wait(10 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 보기'));
        await utils.wait(5 * 1000);
        await utils.click(driver, utils.uiSelectorText('무료배달 주문'));
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
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        if (driver) {
            try {
                await driver.terminateApp('com.svcorps.mkitchen');
                await driver.deleteSession();
                console.log('Driver session ended.');
            } catch (deleteSessionError) {
                console.error('Error ending driver session:', deleteSessionError);
            }
        }
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: '1. 단골맛집 배달 결제',
            Screenshots,
        });
    }
})();
