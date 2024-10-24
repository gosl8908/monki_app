const { remote } = require('webdriverio');
const { tableorder, env, error } = require('../../../config.js');
const utils = require('../../../module/utils.js');
const Module = require('../../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

describe('Appium Test Suite', function () {
    this.timeout(360 * 1000);
    let driver;
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };

    beforeEach(async function () {
        driver = await remote(
            tableorder(4726, env.GalaxyTabS7FE.deviceName, env.GalaxyTabS7FE.port, env.GalaxyTabS7FE.platformVersion),
        );

        await utils.wait(10 * 1000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        await Module.loginModule.TOlogin(driver, env.testid3, env.testpwd3);
    });
    function run(testFunc) {
        return async function () {
            try {
                await testFunc();
                console.log(`Test Passed: ${this.test.title}`);
            } catch (err) {
                error(TestFails, FailureObj, err, this.test.title);
            }
        };
    }
    it(
        '테이블 로그인',
        run(async function () {
            const waiting = await driver.$(utils.view('주문하시려면 화면을 터치해 주세요'));
            if (await waiting.isDisplayed()) {
                await utils.click(driver, utils.ImageView('주문하기'));
                await utils.wait(3 * 1000);
                await utils.containsview('번개단골맛집-강남(stg)', { timeout: 10 * 1000 });
            }

            await utils.contains(driver, utils.view('안녕하세요 :) 메뉴 확인 후 바로 주문해 주세요'));
        }),
    );
    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('send Email', async function () {
        await utils.finish(driver, tableorder());
        const { title: describeTitle, tests: allTests } = this.test.parent;
        // 실패한 테스트만 필터링
        await Module.emailModule.email2({
            TestFails,
            describeTitle,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange:
                '테이블오더 로그인' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
