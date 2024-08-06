const { remote } = require("webdriverio");
const { options } = require("../config");
const {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
  enterText,
} = require("../utils");

const serverUrl = "http://localhost:4723";


// 메인 함수
(async () => {
  const driver = await remote(options);

  // 초기 대기
  await wait(5000);

  // 이메일 입력
  await enterText(driver, '//android.widget.EditText[@text="이메일을 입력해 주세요"]', 'hskang@monki.net');

  // 비밀번호 입력
  await enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', 'gotjd0215!');

  // 로그인 버튼 클릭
  await clickElement(driver, uiSelectorText("로그인"));
  await wait(5000);

  // 주문 완료 확인
  const orderCompleteTextSelector = uiSelectorText("오늘하루 그만보기");
  try {
    const orderCompleteText = await driver.$(orderCompleteTextSelector);
    await orderCompleteText.waitForExist({ timeout: 5000 });
    await orderCompleteText.click();
    console.log("결제완료 & 주문완료 텍스트가 나타났습니다.");
  } catch (error) {
    console.log("주문완료 텍스트가 5초 내에 나타나지 않았습니다.");
    await nextStep();  // 다음 스텝 함수 호출
  }

  // 다음 스텝 함수 예시 (구현 필요)
  async function nextStep() {
    console.log("다음 스텝으로 진행합니다.");
  }

  // 내 계정 메뉴에서 로그아웃
  await clickElement(driver, uiSelectorText("My먼키"));
  await wait(2000);

  await clickElement(driver, uiSelectorText("내정보"));
  await wait(2000);

  await scroll(driver, 500, 1500, 500, 0);
  await wait(2000);

  await clickElement(driver, uiSelectorText("로그아웃"));
  await wait(2000);

  await clickElement(driver, uiSelectorText("확인"));
  await wait(2000);

  // 로그아웃 확인
  const loginTextSelector = uiSelectorText("로그인");
  try {
    const loginText = await driver.$(loginTextSelector);
    await loginText.waitForExist({ timeout: 30000 });
    console.log("Logout successful, login screen displayed.");
  } catch (error) {
    console.error("Logout not successful: ", error);
  }

  await driver.deleteSession(); // 세션 종료
})();
