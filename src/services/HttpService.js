import axios from 'axios';
import dotenv from 'dotenv';
import SomethingWrong from '@assets/icons/not-access.svg';
dotenv.config();

const commonHeader = (config = {}) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      ...config,
    },
  };
};

const getAuthorizeHeader = (configHeader = {}) => {
  const token = JSON.parse(localStorage.getItem('user'))?.access_token;
  const authorizeHeader = token ? { Authorization: `Bearer ${token}` } : {};
  return {
    headers: {
      ...commonHeader(configHeader).headers,
      ...authorizeHeader,
    },
  };
};

/**
 * Axios instance for all request
 * **/
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  xsrfCookieName: process.env.REACT_APP_ARROW_XSRFCOOKIENAME ?? 'XSRF-TOKEN',
  xsrfHeaderName: process.env.REACT_APP_ARROW_XSRFHEADERNAME ?? 'X-XSRF-TOKEN',
  timeout: process.env.REACT_AXIOS_REQUEST_TIMEOUT ?? 30000,
});

/**
 * Request Interceptor
 * ** Modify headers/Authentication token and any requests configuration
 * */
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    /* istanbul ignore next */
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * ** Modify respond format, error handling, status handling
 * */
axiosInstance.interceptors.response.use(
  (response) => {
    return {
      code: response.status === 200 && response.data,
      data: response.data,
    };
  },
  (error) => {
    const redirectTo = `${PUBLIC_URL}/login`;
    const { dispatch } = store;
    const httpCode = error.response.status;
    let message = '';
    let title = 'Something went wrong!';
    let icon = SomethingWrong;
    switch (error.response.status) {
      case 403:
        message = 'Your session has timed out from 20 minutes of inactivity. Please log back in';
        title = 'Session time out';
        icon = Timeout;
        // TODO: Handle error http response 403
        break;
      case 401:
        message = 'You dont have permission to access this page!';
        // TODO: Handle error http response 401
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);

/**
 * Get Request With Token
 * **/
const get = (url) => {
  return axiosInstance.get(url, getAuthorizeHeader());
};

/**
 * Post Request With Token
 * **/
const post = (url, data) => {
  return axiosInstance.post(url, data, getAuthorizeHeader());
};

/**
 * Put Request With Token
 * **/
const put = (url, data) => {
  return axiosInstance.put(url, data, getAuthorizeHeader());
};

/**
 * Put Request With Token
 * **/
const patch = (url, data) => {
  return axiosInstance.patch(url, data, getAuthorizeHeader());
};

/**
 * Delete Request With Token
 * **/
const del = (url) => {
  return axiosInstance.delete(url, getAuthorizeHeader());
};

/**
 * Get Request
 * **/
const publicGet = (url) => {
  return axiosInstance.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Post Request
 * **/
const publicPost = (url, data, configHeader = {}) => {
  return axiosInstance.post(url, data, commonHeader(configHeader));
};

/**
 * Put Request
 * **/
const publicPut = (url, data) => {
  return axiosInstance.put(url, data, commonHeader());
};

/**
 * Patch Request
 * **/
const publicPatch = (url, data) => {
  return axiosInstance.patch(url, data, commonHeader());
};

/**
 * Delete Request
 * **/
const publicDel = (url) => {
  return axiosInstance.delete(url);
};

const HttpService = {
  get,
  post,
  put,
  del,
  patch,
  publicGet,
  publicPost,
  publicPut,
  publicDel,
  publicPatch,
};
export default HttpService;
