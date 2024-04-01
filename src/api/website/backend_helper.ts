import { APIClient } from "./api_helper";
import * as url from "./url_helper";

const api = new APIClient();
// Gets the logged in user data from local session



// Login Method
export const postJwtLogin = (data: any) => api.create(url.POST_JWT_LOGIN, data);

// Register Method
export const postJwtRegister = (data: any) =>  api.create(url, data)
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });



/**
   * Returns the authenticated user
   */

export const getAuthenticatedUser = () => {
  const res = localStorage.getItem("authUser");
  if (res) {
    return JSON.parse(res);
  } 
    return null;
  
};

export const updateAuthenticatedUser = (user: any) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};


// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () =>  getLoggedInUser() !== null;


// Get Unit

export const GetUnitInfo = (data: any) => api.create(url.GET_UNITINFO_API_URL, data);

// Get Selection

export const GetAllBaseData = () => api.get(url.GET_ALL_BASEDATA_API_URL, null);