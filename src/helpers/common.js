import axios from "axios";
import {Context} from "./context";
import {AppStatus} from "../constants";
import { Configs} from "../configs"
export const Common = {
  /**
   * Parse array to string
   * @param {array} array
   * @returns {string} token
   */
  parseArrayToString(array)
  {
    let string = "";
    array.forEach(element => {
      string += string === "" ? element.msg : "<br>" + element.msg;
    });
    return string;
  },
  /**
   * Convert any type string to uppercase the first letter "capitalize "
   * @param {string} string
   * @returns {string} string
   */
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /**
   * Set key and value from object to another object
   * @param {object} object
   * @param {object} response
   * @param {array} array
   * @returns {object} string
   */
  setKeyForObject(object, response, array) {
    if (array.length > 0) {
      array.forEach(element => {
        response[element] = object[element];
      });
    }
    return response;
  },

  formatErrMgs(arrErrField) {
    const arrErr = [];
    for (const key in arrErrField) {
      const row = arrErrField[key];
      arrErr.push(row.message);
    }
    return arrErr.join("<br>");
  },

  /**
   * @return bool
   */
  isSuperAdmin() {
    const context = new Context();
    const user = context.currentUser;
    const code = AppStatus.SUPER_ADMIN_CODE;

    return (
      Array.isArray(user.roles) &&
      user.roles.findIndex(r => r.code === code) >= 0
    );
  },

  parseDateMongoIntoMySqlFormat(datetime) {
    return datetime.substring(0, 10) + " " + datetime.substring(11, 19);
  },

  format2Number(input) {
    if (input.length == 1) {
      return "0" + input;
    } else if (input.length >= 2) {
      return  input.substring(0,2);
    } else {
      return "00";
    }
  }
};
