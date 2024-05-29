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

// 유틸리티 함수: 텍스트로 요소 선택자 생성
const uiSelectorText = (text) => `android=new UiSelector().text("${text}")`;
const uiSelectorBtnText = (text) =>
  `android=new UiSelector().className("android.widget.Button").text("${text}")`;

module.exports = {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
  uiSelectorBtnText,
};
