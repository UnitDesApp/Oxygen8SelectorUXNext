import axios from "axios";
import { BACKEND_ENDPOINT } from "src/config-global";

// default
axios.defaults.baseURL = BACKEND_ENDPOINT;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url:any, params) => {
  //   return axios.get(url, params);
  // };
  get = (url: any, params: any) => {
    let response;

    let paramKeys: string[] = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key])
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  }
  /**
   * post given data to url
   */
  create = (url: any, data: any) => {
    return axios.post(url, data);
  };

  /**
   * post given data to url
   */
  postFormData = (url: any, formData: any) => {
    return axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  /**
   * Updates data
   */
  update = (url: any, data: any) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url: any, config: any) => {
    return axios.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, getLoggedinUser };