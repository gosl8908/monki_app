const utils = require('../module/utils'); // utils 모듈을 가져옵니다.
async function order(driver, menu, prise, type) {
    try {
        const waiting = await driver.$(utils.view('주문하시려면 화면을 터치해 주세요'));
        if (await waiting.isDisplayed()) {
            await utils.click(driver, utils.ImageView('주문하기'));
            await utils.wait(3 * 1000);
            await driver.$(utils.view('교촌치킨(stg)', { timeout: 10 * 1000 }));
            const text = await driver.$(utils.view('안녕하세요 :)\n저희는 선불로 운영되는 매장이에요'));
            if (await text.isDisplayed()) {
                await utils.click(driver, utils.btnText('확인'));
            }
        }
        await utils.click(driver, utils.view('음료'));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.ImageView(`${menu}\n${prise}원`));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.btnText(`${prise}원 담기`));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.ImageView('장바구니\n1'));
        await utils.wait(1 * 1000);
        if (type === '선불') {
            await utils.click(driver, utils.btnText('한번에 결제하기'));
        } else {
            await utils.click(driver, utils.btnText('주문하기'));
        }
        await utils.click(driver, utils.btnText('괜찮아요, 다음에 할게요.'));
        // await utils.wait(1 * 1000);
        // const clickSequence = async (driver, sequence) => {
        //     for (const view of sequence) {
        //         await utils.click(driver, utils.view(view));
        //         await utils.wait(1000);
        //     }
        // };

        // await clickSequence(driver, ['2', '0', '4', '3', '1', '6', '5', '3']);
        // await utils.wait(1 * 1000);
        // await utils.click(driver, utils.view('에 동의합니다.'));
        // await utils.wait(1 * 1000);
        // await utils.click(driver, utils.view('이후 주문도 이 번호로 적립할게요.'));
        // await utils.wait(1 * 1000);
        // await utils.click(driver, utils.btnText('확인'));
        await utils.wait(1 * 1000);
        if (type === '선불') {
            await utils.contains(driver, utils.view('결제완료', { timeout: 5 * 1000 }));
        } else {
            await utils.contains(driver, utils.view('주문완료', { timeout: 5 * 1000 }));
        }
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.btnText('확인'));

        await utils.click(driver, utils.view('주문내역'));
        await utils.contains(driver, utils.containsview(`${menu}`));
        await utils.click(driver, utils.btnText('닫기'));
        await console.log('주문 완료');
    } catch (error) {
        console.error(`주문 완료 중 오류 발생: ${error.message}`);
        throw error;
    }
}
async function payCancel(driver, prise, tableNo) {
    try {
        await adminMode(driver, tableNo);
        /* 결제취소 */

        await utils.click(driver, utils.view('결제내역\n탭 5개 중 4번째')); // 결제내역

        await utils.click(driver, utils.containsview(`${prise}`));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.btnText('결제취소'));
        await utils.wait(1 * 1000);
        await utils.touchTap(driver, 0.349, 0.292);
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.btnText('결제취소'));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.btnText('네'));
        await utils.wait(1 * 1000);
        await utils.contains(driver, utils.containsview('결제가 취소되었습니다.'));
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.btnText('확인'));
        await utils.wait(1 * 1000);
        console.log('결제 취소 완료');
    } catch (error) {
        console.error(`결제 취소 중 오류 발생: ${error.message}`);
        throw error;
    }
}
async function adminMode(driver, tableNo) {
    try {
        /* 결제취소 */
        await utils.touchTap(driver, 0.1, 0.05);
        await utils.touchTap(driver, 0.1, 0.05);

        await utils.click(driver, utils.view(`${tableNo}`));
        await utils.click(driver, utils.view(`${tableNo}`));

        for (let i = 0; i < 6; i++) {
            await utils.click(driver, utils.view('1'));
        }
        await utils.click(driver, utils.btnText('확인'));
        await utils.wait(1 * 1000);
        // await utils.click(driver, utils.view('관리자 모드'));
        await utils.touchTap(driver, 0.3698, 0.5917);
        await utils.wait(1 * 1000);
        await utils.click(driver, utils.btnText('확인'));
        console.log('관리자모드 진입 완료');
    } catch (error) {
        console.error(`관리자모드 진입 중 오류 발생: ${error.message}`);
        throw error;
    }
}

module.exports = {
    order,
    payCancel,
    adminMode,
};
