const { remote } = require('webdriverio');
const { app, env, error } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

describe('Appium Test Suite', function () {
    this.timeout(360 * 1000);
    let driver;
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };

    beforeEach(async function () {
        driver = await remote(
            app(
                4724,
                env.GalaxyNote10plus5G.deviceName,
                env.GalaxyNote10plus5G.udid,
                env.GalaxyNote10plus5G.platformVersion,
            ),
        );
    });
    function run(testFunc) {
        return async function () {
            try {
                await testFunc();
            } catch (err) {
                error(TestFails, FailureObj, err, this.test.title);
            }
        };
    }
    it(
        'Fail1',
        run(async function () {
            await utils.wait(3000);
            await utils.contains(driver, utils.uiSelector('Fail1'));
        }),
    );
    it(
        'Fail2',
        run(async function () {
            await utils.wait(3000);
            await utils.contains(driver, utils.uiSelector('Fail2'));
        }),
    );
    it(
        'Pass1',
        run(async function () {
            await utils.wait(3000);
            await utils.contains(driver, utils.uiSelector('로그인'));
        }),
    );
    it(
        'Pass2',
        run(async function () {
            await utils.wait(3000);
            await utils.contains(driver, utils.uiSelector('로그인'));
        }),
    );
    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('send Email', async function () {
        // await utils.finish(driver, app());
        const { title: describeTitle, tests: allTests } = this.test.parent;
        await Module.emailModule.email2({
            TestFails,
            describeTitle,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange:
                '테스트 스크립트1' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
