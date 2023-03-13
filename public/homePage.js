"use strict";

const logout = new LogoutButton();
const ratesBoard = new RatesBoard();

logout.action = function () {
  ApiConnector.logout((responseBody) => {
    if (responseBody.success) {
      stopUpdateExchangeRates();
      location.reload();
    } else {
      console.error("Ошибка: ", responseBody.error);
    }
  });
}

ApiConnector.current((responseBody) => {
  if (responseBody.success) {
    ProfileWidget.showProfile(responseBody.data);
  } else {
    console.error("Ошибка: ", responseBody.error);
  }
});

function getExchangeRates() {
  ApiConnector.getStocks((responseBody) => {
    if (responseBody.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(responseBody.data);
    } else {
      console.error("Ошибка: ", responseBody.error);
    }
  });
}

let intId = null;

function startUpdateExchangeRates() {
  if (intId !== null) {
    return;
  }
  getExchangeRates();
  intId = setInterval(getExchangeRates, 60000);
}

function stopUpdateExchangeRates() {
  if (intId !== null) {
    clearInterval(intId);
    intId = null;
  }
}

startUpdateExchangeRates();
