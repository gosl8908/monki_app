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

(async () => {
  const driver = await remote(options);
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  const searchElement = await driver.$('android=new UiSelector().text("검색")');
  await searchElement.click();

  const search2Element = await driver.$(
    'android=new UiSelector().text("번개")'
  );
  await search2Element.click();

  const search3Element = await driver.$(
    'android=new UiSelector().text("번개맛집 안양지점")'
  );
  await search3Element.click();

  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 500, y: 1500 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        {
          type: "pointerMove",
          duration: 1000,
          origin: "viewport",
          x: 500,
          y: 500,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  const search4Element = await driver.$(
    'android=new UiSelector().text("비빔면")'
  );
  await search4Element.click();

  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  // 아래로 스크롤하는 함수
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 500, y: 1500 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        {
          type: "pointerMove",
          duration: 1000,
          origin: "viewport",
          x: 500,
          y: 500,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  const search5Element = await driver.$(
    'android=new UiSelector().text("기본")'
  );
  await search5Element.click();

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

  const search6Element = await driver.$(
    'android=new UiSelector().text("8,000원 장바구니 담기")'
  );
  await search6Element.click();

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

  const search7Element = await driver.$(
    'android=new UiSelector().text("장바구니 보기")'
  );
  await search7Element.click();

  await new Promise((resolve) => setTimeout(resolve, 3 * 1000));

  const search8Element = await driver.$(
    'android=new UiSelector().text("매장식사 주문")'
  );
  await search8Element.click();

  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 500, y: 1500 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        {
          type: "pointerMove",
          duration: 1000,
          origin: "viewport",
          x: 500,
          y: 500,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  const search9Element = await driver.$(
    'android=new UiSelector().text("모두사용")'
  );
  await search9Element.click();

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 500, y: 1500 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        {
          type: "pointerMove",
          duration: 1000,
          origin: "viewport",
          x: 500,
          y: 500,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  const search10Element = await driver.$(
    'android=new UiSelector().text("간편결제")'
  );
  await search10Element.click();

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 500, y: 1500 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        {
          type: "pointerMove",
          duration: 1000,
          origin: "viewport",
          x: 500,
          y: 500,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  const search11Element = await driver.$(
    'android=new UiSelector().text("개인정보 제3자 제공 내용 및 결제에 동의합니다.")'
  );
  await search11Element.click();

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

  const search12Element = await driver.$(
    'android=new UiSelector().text("결제하기")'
  );
  await search12Element.click();

  await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 500, y: 1300 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 1000 },
        {
          type: "pointerMove",
          duration: 1000,
          origin: "viewport",
          x: 500,
          y: 100,
        },
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  const search13Element = await driver.$(
    'android=new UiSelector().text("결제")'
  );
  await search13Element.click();

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

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

  await new Promise((resolve) => setTimeout(resolve, 5 * 1000));

  // // 테스트 종료 후 드라이버 종료
  // setTimeout(async () => {
  //   await driver.deleteSession();
  //   console.log("Driver session ended after 20 seconds.");
  // }, 20000); // 20000 밀리초 = 20초
})();
