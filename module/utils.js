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
        { type: "pointerMove", duration: 0, x: startX, y: startY }, // 포인트 이동
        { type: "pointerDown", button: 0 }, // 다운
        { type: "pause", duration: 1000 }, // 정지
        { type: "pointerMove", duration, origin: "viewport", x: endX, y: endY }, // 이동 위치
        { type: "pointerUp", button: 0 }, // 업
      ],
    },
  ]);
}

// 유틸리티 함수: 대기
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 유틸리티 함수: 텍스트로 요소 선택자 생성
const uiSelectorText = (text) => `android=new UiSelector().text("${text}")`;
const uiSelectorBtnText = (text) =>
  `android=new UiSelector().className("android.widget.Button").text("${text}")`;

// 유틸리티 함수: 텍스트 입력
async function inputText(driver, selector, text) {
  try {
    const element = await driver.$(selector);
    await element.setValue(text);
  } catch (error) {
    console.error(`Error inputting text '${text}' into element with selector '${selector}':`, error);
  }
}

async function enterText(driver, xpath, value, timeout = 5000) {
  const startTime = Date.now();
  try {
    const element = await driver.$(xpath);
    console.log(`Time to find element: ${Date.now() - startTime}ms`);
    
    await element.waitForExist({ timeout });
    console.log(`Time to wait for element existence: ${Date.now() - startTime}ms`);
    
    await element.setValue(value);
    console.log(`Time to set value: ${Date.now() - startTime}ms`);
    
    console.log(`Entered value '${value}' successfully.`);
  } catch (error) {
    console.error(`Error entering value '${value}': `, error);
  }
}
module.exports = {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
  uiSelectorBtnText,
  inputText,
  enterText,
};
