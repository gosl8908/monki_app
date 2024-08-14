const { remote } = require("webdriverio");
const { options } = require("../config.js");
const { loginModule } = require('../module/manager.module.js');
const {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
  enterText,
} = require("../module/utils.js");

const serverUrl = "http://localhost:4723";
const TIMEOUT = 5000; // 전역 타임아웃 값

// 공통 작업을 위한 유틸리티 함수들
async function login(driver, email, password) {
  await enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', email);
  await enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', password);
  await clickElement(driver, uiSelectorText("로그인"));
}

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
  } catch (error) {
    console.log("주문완료 텍스트가 30초 내에 나타나지 않았습니다.");
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
    // 초기 대기
    await wait(5000);

    // 로그인
    await login(driver, 'hskang@monki.net', 'test123!');

    // 주문 완료 확인
    await waitForTextAndClick(driver, "오늘하루 그만보기");

    await searchAndSelectItem(driver, "몬키", "몬키");

    // 내 계정 메뉴에서 로그아웃
    await logout(driver);

    // 로그아웃 확인
    await verifyLogout(driver);

  } catch (error) {
    console.error("테스트 실행 중 오류 발생: ", error.message);
  } finally {
    await driver.deleteSession(); // 세션 종료
  }
})();
