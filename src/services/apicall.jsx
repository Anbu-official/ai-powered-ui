import axios from "axios";
import { constant } from "../utils/constant";
// import { getCookies, setCookies } from "../utils/cookies";

const { apiUrl } = constant;
export const login = async (credentials) => {
  try {
    const response = await axios.post(apiUrl + "/login", credentials, {
      withCredentials: true,
    });
    // setCookies("Jwt_token", JSON.stringify(response), 8); // 8hrs only stored
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const logout = async (credentials) => {
  try {
    const response = await axios.get(apiUrl + "/logout", credentials, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const extract = async (values) => {
  try {
    const response = await axios.post(apiUrl + "/extract", values, {
      withCredentials: true,
    });
    // {
    //     headers: {
    //       Authorization: "Bearer" + getCookies("Jwt_token"),
    //     },
    //   }
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
