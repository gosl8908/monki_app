const axios = require('axios'); // HTTP 요청을 위한 axios 라이브러리
const assert = require('assert'); // 필요에 따라 API 응답 검증용
const { env } = require('../config.js');
const BaseUrl = 'http://staging-to-api.monthlykitchen.kr';

async function token(userId) {
    // 3. 엑세스 토큰 발급
    const authUrl = `${BaseUrl}/auth/token`;

    const authBody = {
        appType: 'tableorder_app',
        grantType: 'password',
        userId: userId,
        userPass: '937e8d5fbb48bd4949536cd65b8d35c426b80d2f830c5c308e2cdec422ae2244',
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
    const storeNo = 658;
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

module.exports = {
    token,
    order,
};
