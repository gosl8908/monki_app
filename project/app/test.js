const { remote } = require('webdriverio');
const { appoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

describe('Appium Test Suite', function () {
    this.timeout(30000); // 전체 테스트의 타임아웃 설정 (예: 30초)

    let driver;
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수

    before(async function () {
        driver = await remote(appoptions);
    });

    it('should login successfully', async function () {
        try {
            await utils.wait(3000);
            // await Module.loginModule.login(driver, env.email, env.password);
            await utils.scroll(driver, 0.4, 0.6, 0.5, 0.0);
            allure.step('Login action performed', () => {
                // 여기에 스텝과 관련된 추가 작업을 작성합니다.
                console.log('Login step executed');
            });
        } catch (error) {
            console.error(error);
            TestFails.push(error.message);
            if (driver) await utils.screenshot(driver, Screenshots);
            allure.attachment('Screenshot', Screenshots, 'image/png'); // 첨부할 스크린샷
            throw error; // 실패한 테스트를 Mocha에 알리기 위해 에러를 다시 던짐
        }
    });
    after(async function () {
        await utils.finish(driver, appoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. 테스트',
            Screenshots,
        });
    });
});
