import axios from "axios";

export const SigninAction = (user) => {
  axios.defaults.headers.post["Content-Type"] = "application/json";
  var promise = axios
    .post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      email: user.email,
      password: user.password,
      device_type: "web",
      desktop_version: "3.0.32",
    })
    .then((response) => {
      if (response.data.meta.code == "200") {
        const id = response.data.data.id;
        const user_id = response.data.data.id;
        const first_name = response.data.data.first_name;
        const last_name = response.data.data.last_name;
        const firstName = response.data.data.first_name;
        const lastName = response.data.data.last_name;
        const email = response.data.data.email;
        // const username = responce.data.data.username
        const language_id = response.data.data.language_id;
        const login_token = response.data.data.login_token;
        const profile_picture_url = response.data.data.profile_picture_url;
        const profile_pic = response.data.data.profile_picture_url;
        const call_config = response.data.data.call_config;
        const loggedInUser = {
          id,
          first_name,
          last_name,
          firstName,
          lastName,
          user_id,
          email,
          language_id,
          login_token,
          login_session_id: response.data.data.login_session_id,
          profile_picture_url,
          profile_pic,
          call_config,
        };

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        return loggedInUser;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  return promise;
};

export const LogoutAction = (user_id) => {
  var promise = axios.post("auth/logout").then((resp) => {
    localStorage.clear();
    return resp;
  });
  return promise;
};

export const UserTableData = (token, id) => {
  const promise = axios.get("subscriptions/user_subscription_list", {
      params: {
        plan_id: id,
        token,
      },
      headers: { Authorization: "Bearer " + token },
    }).then((response) => {
      console.log(response);
      return response;
    }).catch((error) => {
      console.log(error);
    });
  return promise;
};
