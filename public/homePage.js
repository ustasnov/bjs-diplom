"use strict";

class HomePageManager {
  constructor() {
    this._intId = null;
    this.logout = new LogoutButton();
    this.ratesBoard = new RatesBoard();
    this.moneyManager = new MoneyManager();
    this.favoritesWidget = new FavoritesWidget();
  }

  get intId() {
    return this._intId;
  }

  set intId(value) {
    this._intId = value;
  }

  init() {
    this.setLogoutCallback();
    this.setCurrentUserData();
    this.startUpdateExchangeRates();
    this.setAddMoneyCallback();
    this.setConversionMoneyCallback();
    this.setSendMoneyCallback();
    this.setFavoritesList();
  }

  setLogoutCallback() {
    const bindingFunc = this.stopUpdateExchangeRates.bind(this);
    this.logout.action = function () {
      ApiConnector.logout((responseBody) => {
        if (responseBody.success) {
          bindingFunc();
          location.reload();
        } else {
          console.error("Ошибка: ", responseBody.error);
        }
      });
    }
  }

  setCurrentUserData() {
    ApiConnector.current((responseBody) => {
      if (responseBody.success) {
        ProfileWidget.showProfile(responseBody.data);
      } else {
        console.error("Ошибка: ", responseBody.error);
      }
    });
  }

  getExchangeRates() {
    ApiConnector.getStocks((responseBody) => {
      if (responseBody.success) {
        this.ratesBoard.clearTable();
        this.ratesBoard.fillTable(responseBody.data);
      } else {
        console.error("Ошибка: ", responseBody.error);
      }
    });
  }

  startUpdateExchangeRates() {
    if (this.intId !== null) {
      return;
    }
    this.getExchangeRates();
    this.intId = setInterval(() => this.getExchangeRates(), 60000);
  }

  stopUpdateExchangeRates() {
    if (this.intId !== null) {
      clearInterval(this.intId);
      this.intId = null;
    }
  }

  setAddMoneyCallback() {
    const bindingFunc = this.moneyManager.setMessage.bind(this.moneyManager);
    this.moneyManager.addMoneyCallback = function (data) {
      ApiConnector.addMoney(data, (responseBody) => {
        if (responseBody.success) {
          ProfileWidget.showProfile(responseBody.data);
          bindingFunc(true, "Баланс успешно пополнен.");
        } else {
          bindingFunc(false, responseBody.error);
        }
      });
    }
  }

  setConversionMoneyCallback() {
    const bindingFunc = this.moneyManager.setMessage.bind(this.moneyManager);
    this.moneyManager.conversionMoneyCallback = function (data) {
      ApiConnector.convertMoney(data, (responseBody) => {
        if (responseBody.success) {
          ProfileWidget.showProfile(responseBody.data);
          bindingFunc(true, "Конвертация выполнена успешно.");
        } else {
          bindingFunc(false, responseBody.error);
        }
      });
    }
  }

  setSendMoneyCallback() {
    const bindingFunc = this.moneyManager.setMessage.bind(this.moneyManager);
    this.moneyManager.sendMoneyCallback = function (data) {
      ApiConnector.transferMoney(data, (responseBody) => {
        if (responseBody.success) {
          ProfileWidget.showProfile(responseBody.data);
          bindingFunc(true, "Перевод валюты упешно выполнен.");
        } else {
          bindingFunc(false, responseBody.error);
        }
      });
    }
  }

  setFavoritesList() {
    ApiConnector.getFavorites((responseBody) => {
      if (responseBody.success) {
        this.favoritesWidget.clearTable();
        this.favoritesWidget.fillTable(responseBody.data);
        this.moneyManager.updateUsersList(responseBody.data);
      } else {
        console.error("Ошибка: ", responseBody.error);
      }
    });
  }

}

const homePageManager = new HomePageManager();
homePageManager.init();




