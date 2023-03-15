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
    this.setAddUserCallback();
    this.setRemoveUserCallback();
  }

  /* Выход из личного кабинета */

  setLogoutCallback() {
    const stopUpdate = this.stopUpdateExchangeRates.bind(this);
    this.logout.action = function () {
      ApiConnector.logout((responseBody) => {
        if (responseBody.success) {
          stopUpdate();
          location.reload();
        } else {
          console.error("Ошибка: ", responseBody.error);
        }
      });
    }
  }

  /* Получение информации о пользователе */

  setCurrentUserData() {
    ApiConnector.current((responseBody) => {
      if (responseBody.success) {
        ProfileWidget.showProfile(responseBody.data);
      } else {
        console.error("Ошибка: ", responseBody.error);
      }
    });
  }

  /* Получение текущих курсов валют */

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

  /* Операции с деньгами */

  setAddMoneyCallback() {
    const setMessage = this.moneyManager.setMessage.bind(this.moneyManager);
    this.moneyManager.addMoneyCallback = function (data) {
      ApiConnector.addMoney(data, (responseBody) => {
        if (responseBody.success) {
          ProfileWidget.showProfile(responseBody.data);
          setMessage(true, "Баланс успешно пополнен.");
        } else {
          setMessage(false, responseBody.error);
        }
      });
    }
  }

  setConversionMoneyCallback() {
    const setMessage = this.moneyManager.setMessage.bind(this.moneyManager);
    this.moneyManager.conversionMoneyCallback = function (data) {
      ApiConnector.convertMoney(data, (responseBody) => {
        if (responseBody.success) {
          ProfileWidget.showProfile(responseBody.data);
          setMessage(true, "Конвертация успешно выполнена.");
        } else {
          setMessage(false, responseBody.error);
        }
      });
    }
  }

  setSendMoneyCallback() {
    const setMessage = this.moneyManager.setMessage.bind(this.moneyManager);
    this.moneyManager.sendMoneyCallback = function (data) {
      ApiConnector.transferMoney(data, (responseBody) => {
        if (responseBody.success) {
          ProfileWidget.showProfile(responseBody.data);
          setMessage(true, "Перевод валюты упешно выполнен.");
        } else {
          setMessage(false, responseBody.error);
        }
      });
    }
  }

  /* Работа с избранным */

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

  setAddUserCallback() {
    const setMessage = this.moneyManager.setMessage.bind(this.moneyManager);
    const upgateFavorites = this.setFavoritesList.bind(this);
    this.favoritesWidget.addUserCallback = function (data) {
      ApiConnector.addUserToFavorites(data, (responseBody) => {
        if (responseBody.success) {
          upgateFavorites();
          setMessage(true, `Пользователь ${data.name} успешно добавлен в адресную книгу`);
        } else {
          setMessage(false, responseBody.error);
        }
      });
    }
  }

  setRemoveUserCallback() {
    const setMessage = this.moneyManager.setMessage.bind(this.moneyManager);
    const upgateFavorites = this.setFavoritesList.bind(this);
    this.favoritesWidget.removeUserCallback = function (data) {
      ApiConnector.removeUserFromFavorites(data, (responseBody) => {
        if (responseBody.success) {
          upgateFavorites();
          setMessage(true, `Пользователь c id=${data} удален из адресной книги`);
        } else {
          setMessage(false, responseBody.error);
        }
      });
    }
  }

}

new HomePageManager().init();



