const { remote } = require('webdriverio');
const { app, env } = require('../../config.js');
const utils = require('../../module/utils.js'); // utils 모듈을 가져옵니다.
const Module = require('../../module/manager.module.js');

const serverUrl = 'http://localhost:4725';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 배열

(async () => {
    let driver;
    try {
        driver = await remote(
            app(
                4725,
                env.GalaxyNote10plus5G.deviceName,
                env.GalaxyNote10plus5G.udid,
                env.GalaxyNote10plus5G.platformVersion,
            ),
        );
        await utils.wait(5 * 1000);
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, app());
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. 테스트',
            Screenshots,
        });
    }
})();
