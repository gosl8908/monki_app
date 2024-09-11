const { remote } = require('webdriverio');
const { appoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const assert = require('assert');

describe('회원가입 테스트', function () {
    let driver,
        Screenshots = [],
        TestFails = [];

    before(async () => (driver = await remote(appoptions)));

    it('간편 회원가입 진행', async () => {
        try {
            await utils.wait(5000);
            await signUp();
            assert(await utils.contains(driver, '회원가입이 완료되었습니다.'), '회원가입 실패');
            await utils.click(driver, utils.uiSelectorText('확인'));
            await handlePopups();
            await Module.loginModule.signout(driver);
        } catch (error) {
            TestFails.push(error.message);
            (await driver) && utils.screenshot(driver, Screenshots);
            throw error;
        }
    });

    async function signUp() {
        await utils.click(driver, utils.uiSelectorText('간편회원가입'));
        await utils.click(driver, utils.uiSelectorText('약관에 모두 동의합니다.'));
        await utils.click(driver, utils.uiSelectorText('확인'));

        await enterAndVerifyPhoneNumber();
        await checkAndHandleExistingInput('이메일', env.testemail, '1' + env.testemail);
        await checkAndHandleExistingInput('닉네임', '몬키', 'monkitest');

        await enterPasswords(env.password);
        await utils.click(driver, utils.uiSelectorText('가입완료'));
    }

    async function enterAndVerifyPhoneNumber() {
        await utils.enterText(driver, '//android.widget.EditText[@text="휴대폰 번호를 입력해 주세요"]', '01052012705');
        await utils.click(driver, utils.uiSelectorText('인증번호 받기'));

        let verificationCode = await Module.messageModule.message('18995678');
        if (!verificationCode) throw new Error('인증번호를 찾을 수 없습니다.');

        await utils.enterText(driver, '//android.widget.EditText[@text="인증번호를 입력해 주세요"]', verificationCode);
        await utils.click(driver, utils.uiSelectorText('인증하기'));

        const NotNumber = await driver.$(utils.uiSelectorText('휴대폰 인증코드가 일치하지 않습니다'));
        if (await NotNumber.isDisplayed()) {
            verificationCode = await Module.messageModule.message('18995678');
            await utils.enterText(
                driver,
                '//android.widget.EditText[@text="인증번호를 입력해 주세요"]',
                verificationCode,
            );
            await utils.click(driver, utils.uiSelectorText('인증하기'));
        }
    }

    async function checkAndHandleExistingInput(inputType, inputValue, alternativeValue) {
        await utils.enterText(
            driver,
            `//android.widget.EditText[@text="${inputType} 주소를 입력해 주세요"]`,
            inputValue,
        );
        await utils.click(driver, utils.uiSelectorText('중복확인'));

        const existingInput = await driver.$(utils.uiSelectorText(`${inputType}이 존재합니다`));
        if (await existingInput.isDisplayed()) {
            await utils.enterText(driver, `//android.widget.EditText[@text="${inputValue}"]`, alternativeValue);
            await utils.click(driver, utils.uiSelectorText('중복확인'));
        }
    }

    async function enterPasswords(password) {
        await utils.enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
        await utils.enterText(driver, '//android.widget.EditText[@text="비밀번호 한번 더 입력해 주세요"]', password);
    }

    async function handlePopups() {
        const eventBtn = await driver.$(utils.uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) await utils.waitForTextAndClick(driver, '오늘하루 그만보기');
    }
    after(async () => {
        await driver?.terminateApp('com.svcorps.mkitchen');
        await driver?.deleteSession();
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. 회원가입, 2. 회원탈퇴',
            Screenshots,
        });
    });
});
