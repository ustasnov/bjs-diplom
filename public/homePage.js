"use strict";

class HomePageManager {
  constructor() {
    this._intId = null;
    this.logout = new LogoutButton();
    this.ratesBoard = new RatesBoard();
    this.moneyManager = new MoneyManager();
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

}

const homePageManager = new HomePageManager();
homePageManager.init();




