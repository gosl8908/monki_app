const { remote } = require("webdriverio");
const { options } = require("../config.js");
const { loginModule } = require('../module/manager.module.js');
const {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
} = require("../module/utils.js");

const serverUrl = "http://localhost:4723";

async function login(driver) {
  const loginBtnSelector = uiSelectorText("로그인");
  try {
    const loginBtn = await driver.$(loginBtnSelector);
    if (await loginBtn.isDisplayed()) {
      await loginModule.login('hskang@monki.net', 'gotjd0215!');
    } else {
      await handleNextStep();
    }
  } catch (error) {
    await handleNextStep();
  }
}


async function logout(driver) {
  await clickElement(driver, uiSelectorText("My먼키"));
  await wait(2000);
  await clickElement(driver, uiSelectorText("내정보"));
  await wait(2000);
  const orderCompleteTextSelector = uiSelectorText("환");
  try {
    const orderCompleteText = await driver.$(orderCompleteTextSelector);
    await orderCompleteText.waitForExist({ timeout: 30 * 1000 });
    console.log("결제완료 & 주문완료 텍스트가 나타났습니다.");
  } catch (error) {
    console.log("주문완료 텍스트가 30초 내에 나타나지 않았습니다.");
  }

  await scroll(driver, 500, 1500, 500, 0);
  await wait(2000);

  await clickElement(driver, uiSelectorText("로그아웃"));
  await wait(2000);

  await clickElement(driver, uiSelectorText("확인"));
  await wait(2000);
}


async function verifyLogout(driver) {
  const loginTextSelector = uiSelectorText("로그인");
  try {
    const loginText = await driver.$(loginTextSelector);
    await loginText.waitForExist({ timeout: 30000 });
    console.log("로그아웃 성공, 로그인 화면이 표시되었습니다.");
  } catch (error) {
    console.error("로그아웃 실패: ", error.message);
  }
}

(async () => {
  const driver = await remote(options);

  try {
    await wait(5 * 1000);

    /* 로그인 */
    await login(driver);
    
    /* 하단 배너 확인 */
    await waitForTextAndClick(driver, "오늘하루 그만보기");

    // 내 계정 메뉴에서 로그아웃
    await logout(driver);

    // 로그아웃 확인
    await verifyLogout(driver);

  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await driver.deleteSession();
    console.log("Driver session ended.");
  }
})();
