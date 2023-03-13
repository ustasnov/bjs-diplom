"use strict";

const userForm = new UserForm();

userForm.loginFormCallback = function (data) {
  ApiConnector.login(data, (responseBody) => {
    if (responseBody.success) {
      location.reload();
    } else {
      console.error("Ошибка: ", responseBody.error);
    }
  });
}

userForm.registerFormCallback = function (data) {
  ApiConnector.register(data, (responseBody) => {
    if (responseBody.success) {
      location.reload();
    } else {
      console.error("Ошибка: ", responseBody.error);
    }
  });
}