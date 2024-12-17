const axios = require('axios'); // HTTP 요청을 위한 axios 라이브러리
const crypto = require('crypto'); // Node.js crypto 모듈
const assert = require('assert'); // 필요에 따라 API 응답 검증용
const { env } = require('../config.js');
const BaseUrl = 'http://staging-to-api.monthlykitchen.kr';
const storeNo = 658;

async function token(userId, userPass) {
    // 3. 엑세스 토큰 발급
    const hashedPass = crypto.createHash('sha256').update(userPass).digest('hex');
    const authUrl = `${BaseUrl}/auth/token`;

    const authBody = {
        appType: 'tableorder_app',
        grantType: 'password',
        userId: userId,
        userPass: hashedPass, // 변환된 해시값 사용
    };
    try {
        // POST 요청으로 토큰 발급
        const authResponse = await axios.post(authUrl, authBody);
        accessToken = authResponse.data.accessToken; // 응답에서 엑세스 토큰 추출
        console.log('엑세스 토큰 발급 성공:', accessToken);
        return accessToken; // 토큰 반환
    } catch (error) {
        console.error('엑세스 토큰 발급 실패:', error.message);
        throw error; // 테스트 실패 처리
    }
}

async function order(accessToken) {
    // 4. 주문 API 호출
    const apiUrl = `${BaseUrl}/common/orders/${storeNo}`;
    const params = {
        day: env.Date,
        regFromAppType: 'APPT_012',
    };

    try {
        // GET 요청으로 주문 API 호출 (Authorization 헤더 추가)
        const orderResponse = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // 토큰 포함
            },
            params,
        });

        // 응답 데이터 출력
        console.log('주문 API 호출 성공');
        console.log('주문 API 응답 데이터:', orderResponse.data);
    } catch (error) {
        console.error('주문 API 호출 실패:', error.message);
        throw error; // 테스트 실패 처리
    }
}

// Products 호출 함수
async function products(accessToken) {
    const url = `${BaseUrl}/common/products/${storeNo}`;
    const appType = 'tableorder_app';

    try {
        const response = await axios.get(url, {
            params: { appType },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // 데이터에서 menuNm과 menuPrice 추출
        const tableorderApp = response.data.tableorderApp;

        const result = tableorderApp.map(item => ({
            categoryNm: item.categoryNm,
            menuNm: item.menuNm,
            menuPrice: item.menuPrice,
        }));
        console.log('상품 목록:', result); // 확인용 로그
        return result; // menuNm과 menuPrice 목록 반환
    } catch (error) {
        console.error('상품 API 호출 오류:', error.message);
        throw error;
    }
}

module.exports = {
    token,
    order,
    products,
};
