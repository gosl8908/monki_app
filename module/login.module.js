const { remote } = require("webdriverio");
const { options } = require("../config");
const {
  clickElement,
  wait,
  uiSelectorText,
  enterText,
} = require("../module/utils");

const TIMEOUT = 5000; // Global timeout value

// Utility function for login
async function performLogin(driver, email, password) {
  await enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', email);
  await enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
  await clickElement(driver, uiSelectorText("로그인"));
}

// Utility function to wait for text and click
async function waitForTextAndClick(driver, text) {
  const selector = uiSelectorText(text);
  try {
    const element = await driver.$(selector);
    await element.waitForExist({ timeout: TIMEOUT });
    await element.click();
    console.log(`"${text}" 텍스트를 찾고 클릭했습니다.`);
  } catch (error) {
    console.log(`"${text}" 텍스트를 찾지 못했습니다: ${error.message}`);
  }
}

async function login(email, password) {
  const driver = await remote(options);

  try {
    // Initial wait
    await wait(5000);

    // Perform login
    await performLogin(driver, email, password);

    // Handle post-login actions (e.g., closing a popup)
    await waitForTextAndClick(driver, "오늘하루 그만보기");
  } catch (error) {
    console.error("테스트 실행 중 오류 발생: ", error.message);
  } finally {
    // End the driver session
    await driver.deleteSession();
  }
}

module.exports = {
  login: login,
};
