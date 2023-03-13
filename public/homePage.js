"use strict";

const logout = new LogoutButton();
logout.action = function() {
  ApiConnector.logout((responseBody) => {
    if (responseBody.success) {
      location.reload();
    } else {
      console.error("Ошибка: ", responseBody.error);
    }
  });
}