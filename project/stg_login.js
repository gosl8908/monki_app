const { remote } = require("webdriverio");
const { options } = require("../config");
const {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
  uiSelectorBtnText,
} = require("../utils");

// Appium 서버와 디바이스 설정
const serverUrl = "http://localhost:4723";

// 메인 함수
(async () => {
  const driver = await remote(options);

  await wait(5 * 1000);



  async function enterEmail() {
    const emailField = await driver.$('//android.widget.EditText[@text="이메일을 입력해 주세요"]');
    try {
      // Locate the EditText element by its XPath
      await emailField.waitForExist({ timeout: 5 * 1000 }); // 기다리는 시간 증가
      
      // Enter the email address
      await emailField.setValue('hskang@monki.net');
      console.log("Email entered successfully.");
    } catch (error) {
      console.error("Error entering email: ", error);
    }
  }
  // Call the function to enter email
  await enterEmail();
  
  async function enterPassword() {
    const passwordField = await driver.$('//android.widget.EditText[@text="비밀번호를 입력해 주세요"]');
    try {
      // Locate the EditText element by its XPath
      await passwordField.waitForExist({ timeout: 5 * 1000 }); // 기다리는 시간 증가
      
      // Enter the email address
      await passwordField.setValue('gotjd0215!');
      console.log("Email entered successfully.");
    } catch (error) {
      console.error("Error entering email: ", error);
    }
  }
    // Call the function to enter email
    await enterPassword();

    await clickElement(driver, uiSelectorText("로그인"));

    await wait(5 * 1000);
  // 주문 완료 확인
  const eventtext = uiSelectorText("오늘하루 그만보기");

  try {
    const orderCompleteText = await driver.$(eventtext);
    await orderCompleteText.waitForExist({ timeout: 5 * 1000 });
    await orderCompleteText.click();
    console.log("결제완료 & 주문완료 텍스트가 나타났습니다.");
  } catch (error) {
    console.log("주문완료 텍스트가 30초 내에 나타나지 않았습니다.");
    await nextStep();  // nextStep() 함수는 다음 스텝을 처리하는 함수입니다.
  }
  
  // 다음 스텝 함수 예시 (구현 필요)
  async function nextStep() {
    // 다음 스텝을 처리하는 코드 작성
    console.log("다음 스텝으로 진행합니다.");
  }
    
    await clickElement(driver, uiSelectorText("My먼키"));
    await wait(2 * 1000);
    
    await clickElement(driver, uiSelectorText("내정보"));
    await wait(2 * 1000);
    
    await scroll(driver, 500, 1500, 500, 0);
    await wait(2 * 1000);
    
    await clickElement(driver, uiSelectorText("로그아웃"));
    await wait(2 * 1000);
    
    await clickElement(driver, uiSelectorText("확인"));
    await wait(2 * 1000);

  // Verify logout
  const loginTextSelector = uiSelectorText("로그인");
  try {
    const loginText = await driver.$(loginTextSelector);
    await loginText.waitForExist({ timeout: 30 * 1000 });
    console.log("Logout successful, login screen displayed.");
  } catch (error) {
    console.error("Logout not successful: ", error);
  }
})();