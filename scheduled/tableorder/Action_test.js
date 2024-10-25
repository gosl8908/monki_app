const { remote } = require('webdriverio');
const { tableorder, env, error } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

describe('테스트1', function () {
    this.timeout(360 * 1000);
    let driver;
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };

    before(async function () {
        driver = await remote(
            tableorder(4727, env.GalaxyTabS7FE.deviceName, env.GalaxyTabS7FE.udid, env.GalaxyTabS7FE.platformVersion),
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
            await utils.contains(driver, utils.uiSelector('확인'));
        }),
    );
    it(
        'Pass2',
        run(async function () {
            await utils.wait(3000);
            await utils.contains(driver, utils.uiSelector('확인'));
        }),
    );
    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('send Email', async function () {
        await utils.finish(driver, tableorder());
        const { title: describeTitle, tests: allTests } = this.test.parent;
        await Module.emailModule.email2({
            TestFails,
            describeTitle,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange:
                '테스트 스크립트1' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
