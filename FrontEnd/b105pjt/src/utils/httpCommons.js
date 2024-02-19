import axios from "axios";

const VITE_NAVER_CLIENT_ID = "NAVER API ID";
const VITE_NAVER_CLIENT_PW = "NAVER API PW";
const VITE_NAVER_SEARCH_URL = "https://openapi.naver.com/v1/search/";

// Naver API용 axios 인스턴스 생성
function naverImgAxios() {
  const instance = axios.create({
    baseURL: VITE_NAVER_SEARCH_URL,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-Naver-Client-Id": VITE_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": VITE_NAVER_CLIENT_PW,
    },
  });
  return instance;
}

const BASE_SERVER_URL = "/api";

function baseAxios() {
  const instance = axios.create({
    baseURL: BASE_SERVER_URL,
    headers: {},
  });
  return instance;
}

export { naverImgAxios, baseAxios };
