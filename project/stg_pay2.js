const { remote } = require("webdriverio");
const { options } = require("../config.js");
const { loginModule } = require('../module/manager.module.js');
const {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
  uiSelectorBtnText,
  enterText,
} = require("../utils.js");

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

async function searchAndSelectItem(driver, searchText, itemText) {
  await clickElement(driver, uiSelectorText("검색"), { timeout: 10 * 1000 });
  await wait(5 * 1000);

  const storeTextSelector = uiSelectorText(searchText);
  try {
    const storeTextBtn = await driver.$(storeTextSelector);
    if (!await storeTextBtn.isDisplayed()) {
      await enterText(driver, '//android.widget.EditText[@text="음식이나 음식점 이름을 검색해주세요"]', searchText);
    } else {
      await clickElement(driver, uiSelectorText(itemText), { timeout: 10 * 1000 });
    }
    await handleNextStep();
  } catch (error) {
    await handleNextStep();
  }
}

async function handleNextStep() {
  console.log("다음 스텝으로 진행합니다.");
}

(async () => {
  const driver = await remote(options);

  try {
    await wait(5 * 1000);
    await login(driver);
    await searchAndSelectItem(driver, "몬키", "몬키");
    await wait(5 * 1000);
    await clickElement(driver, uiSelectorText("몬키지점stg"), { timeout: 10 * 1000 });
    console.log('검색 성공');

    await wait(10 * 1000);
    await scroll(driver, 500, 1500, 500, 0);
    await clickElement(driver, uiSelectorText("라면"));
    console.log('메뉴 상세 진입 성공');

    await wait(10 * 1000);
    await scroll(driver, 500, 1500, 500, 0);
    await clickElement(driver, uiSelectorText("기본"), { timeout: 30 * 1000 });
    await wait(5 * 1000);
    await clickElement(driver, uiSelectorText("4,500원 장바구니 담기"));
    await wait(5 * 1000);
    await clickElement(driver, uiSelectorText("장바구니 보기"), { timeout: 30 * 1000 });
    await wait(5 * 1000);
    await clickElement(driver, uiSelectorText("매장식사 주문"));
    console.log('메뉴 장바구니 담기 성공');

    await wait(10 * 1000);
    await scroll(driver, 500, 2500, 500, 0);
    await clickElement(driver, uiSelectorText("모두사용"));
    await wait(5 * 1000);
    await clickElement(driver, uiSelectorText("간편결제"));
    await wait(5 * 1000);
    await clickElement(driver, uiSelectorText("개인정보 제3자 제공 내용 및 결제에 동의합니다."));
    await wait(5 * 1000);
    await clickElement(driver, uiSelectorText("결제하기"));
    await wait(15 * 1000);
    await scroll(driver, 500, 1300, 500, 100);
    await clickElement(driver, uiSelectorBtnText("결제"));
    await wait(5 * 1000);

    const password = ["9", "4", "0", "5", "1", "3"];
    for (const digit of password) {
      await clickElement(driver, `android=new UiSelector().className("android.widget.Button").text("${digit}")`);
      await wait(1 * 1000);
    }

    const orderCompleteTextSelector = uiSelectorText("주문완료");
    try {
      const orderCompleteText = await driver.$(orderCompleteTextSelector);
      await orderCompleteText.waitForExist({ timeout: 30 * 1000 });
      console.log("결제완료 & 주문완료 텍스트가 나타났습니다.");
    } catch (error) {
      console.log("주문완료 텍스트가 30초 내에 나타나지 않았습니다.");
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await driver.deleteSession();
    console.log("Driver session ended.");
  }
})();
