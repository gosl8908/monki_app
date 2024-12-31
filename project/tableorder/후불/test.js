const { remote } = require('webdriverio');
const { tableorder, env, error, sendMessage } = require('../../../config.js');
const utils = require('../../../module/utils.js');
const Module = require('../../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');
const { element } = require('wd/lib/commands.js');

describe('후불-Test', function () {
    this.timeout(360 * 1000);
    let driver;
    let accessToken;
    let formattedPrice;
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    const run = testFunc =>
        async function () {
            try {
                await testFunc();
                console.log(`Test Passed: ${this.test.title}`);
            } catch (err) {
                error(TestFails, FailureObj, err, this.test.title);
            }
        };
    before(
        'remote',
        run(async () => {
            driver = await remote(
                tableorder(4723, env.GalaxyTabS7FE.deviceName, `${env.GalaxyTabS7FE.port}${'46729'}`),
            );
            await utils.wait(10 * 1000);

            const currentPackage = await driver.getCurrentPackage();
            const currentActivity = await driver.getCurrentActivity();
            console.log('Current app package:', currentPackage);
            console.log('Current app activity:', currentActivity);
        }),
    );
    it(
        '로그인',
        run(async () => {
            await Module.loginModule.TOlogin(driver, env.monkitest[3], env.testpwd2);
            accessToken = await Module.apiModule.token(env.monkitest[3], env.testpwd2); // 엑세스 토큰을 변수에 저장
        }),
    );
    it(
        'Fail',
        run(async () => {
            await utils.contains(driver, utils.android('ㅁㄴㅇㅁㄴㅇ', true));
        }),
    );
    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('Send Email', async function () {
        // await utils.finish(driver, tableorder());
        await Module.emailModule.message({
            TestFails,
            describeTitle: this.test.parent.title,
            TestRange: `테스트\n${this.test.parent.tests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
        await Module.emailModule.email2({
            TestFails,
            describeTitle: this.test.parent.title,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: `테스트\n${this.test.parent.tests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
