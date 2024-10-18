const { remote } = require('webdriverio');
const { app, env } = require('../../config.js');
const utils = require('../../module/utils.js'); // utils 모듈을 가져옵니다.
const Module = require('../../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 배열

(async () => {
    let driver;
    try {
        driver = await remote(app(4723, env.GalaxyA24.deviceName, env.GalaxyA24.port, env.GalaxyA24.platformVersion));
        await utils.wait(5 * 1000);
        await utils.enterText(driver, '//android.widget.EditText[@text="휴대폰 번호를 입력해 주세요"]', env.testphone);

        await utils.click(driver, utils.uiSelectorText('인증번호 받기'));

        // 인증번호를 읽어오는 함수
        const verificationCode = await Module.messageModule.message(env.GalaxyA24.port, '18995678');

        if (verificationCode) {
            // 인증번호 입력란에 입력
            const verificationInput = await driver.$('//android.widget.EditText[@text="인증번호를 입력해 주세요"]');
            await verificationInput.setValue(verificationCode);
            console.log(`인증번호 입력 완료: ${verificationCode}`);
        } else {
            console.log('인증번호를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        // await utils.finish(driver, app());
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. test',
            Screenshots,
        });
    }
})();
