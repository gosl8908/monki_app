const { remote } = require("webdriverio");

const serverUrl = "http://localhost:4723";

const capabilities = {
  platformName: "Android",
  "appium:automationName": "uiautomator2",
  "appium:deviceName": "Android",
  "appium:appPackage": "com.svcorps.mkitchen",
  "appium:appActivity": "com.svcorps.mkitchen.MainActivity",
  "appium:noReset": true, // 앱 데이터 초기화를 하지 않음
  "appium:fullReset": false, // 앱을 완전히 재설치하지 않음
};

const options = {
  hostname: "localhost",
  port: 4723,
  path: "/",
  capabilities: capabilities,
};

// 유틸리티 함수: 요소 클릭
async function clickElement(driver, selector) {
  const element = await driver.$(selector);
  await element.click();
}

// 유틸리티 함수: 스크롤 동작
async function scroll(driver, startX, startY, endX, endY, duration = 1000) {
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: startX, y: startY },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        { type: "pointerMove", duration, origin: "viewport", x: endX, y: endY },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);
}

// 유틸리티 함수: 대기
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const driver = await remote(options);

  // 대기 10초
  await wait(10000);

  // '검색' 클릭
  await clickElement(driver, 'android=new UiSelector().text("검색")');
  await clickElement(driver, 'android=new UiSelector().text("번개")');
  await clickElement(
    driver,
    'android=new UiSelector().text("번개맛집 안양지점")'
  );

  // 대기 10초
  await wait(10000);

  // 스크롤 동작 수행
  await scroll(driver, 500, 1500, 500, 0);

  await clickElement(driver, 'android=new UiSelector().text("비빔면")');

  // 대기 10초
  await wait(10000);

  // 스크롤 동작 수행
  await scroll(driver, 500, 1500, 500, 0);

  await clickElement(driver, 'android=new UiSelector().text("기본")');
  await wait(5000);
  await clickElement(
    driver,
    'android=new UiSelector().text("8,000원 장바구니 담기")'
  );
  await wait(5000);
  await clickElement(driver, 'android=new UiSelector().text("장바구니 보기")');
  await wait(3000);
  await clickElement(driver, 'android=new UiSelector().text("매장식사 주문")');

  // 대기 10초
  await wait(10000);

  // 스크롤 동작 수행
  await scroll(driver, 500, 2400, 500, 0);

  await clickElement(driver, 'android=new UiSelector().text("모두사용")');
  await wait(5000);

  await clickElement(driver, 'android=new UiSelector().text("간편결제")');
  await wait(5000);

  await clickElement(
    driver,
    'android=new UiSelector().text("개인정보 제3자 제공 내용 및 결제에 동의합니다.")'
  );
  await wait(5000);
  await clickElement(driver, 'android=new UiSelector().text("결제하기")');
  await wait(15000);

  // 스크롤 동작 수행
  await scroll(driver, 500, 1300, 500, 100);
  await clickElement(driver, 'android=new UiSelector().text("결제")');

  await wait(5000);

  // 숫자 클릭 함수
  const clickNumber = async (number) => {
    const element = await driver.$(
      `android=new UiSelector().resourceId("com.android.vending:id/button${number}")`
    );
    await element.click();
  };

  // 숫자 9, 4, 0, 5, 1, 3 차례대로 클릭
  const numbersToClick = [9, 4, 0, 5, 1, 3];
  for (const number of numbersToClick) {
    await clickNumber(number);
  }

  await wait(5000);

  // 테스트 종료 후 드라이버 종료
  await driver.deleteSession();
  console.log("Driver session ended.");
})();
