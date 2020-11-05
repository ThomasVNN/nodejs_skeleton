import axios from "axios";
import config from "../configs";
const HttpStatus = require("http-status-codes");
import { Context } from "../helpers/context";
import { AppError } from "../components/core/errors";

export const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyToken(req, res, next) {
    const url = req.path;
    if (url.includes("/api/menu/upload/image/")) {
      next();
    }

    const token = req.headers["x-token"];
    if (!token) {
      return next(
        new AppError("Token is not provided", HttpStatus.UNAUTHORIZED)
      );
    }
    try {
      const context = new Context();
      axios.defaults.headers.common["x-token"] = token;
      const { data } = await axios.get(`${config.server.auth_api}/info`);

      data.data.store_uuids = data.data.stores.map(s => s.uuid);
      context.currentUser = data.data;
      next();
    } catch ({ response }) {
      if (response) {
        return next(
          new AppError(response.data.message, HttpStatus.UNAUTHORIZED)
        );
      }

      const errMessage = HttpStatus.getStatusText(
        HttpStatus.SERVICE_UNAVAILABLE
      );
      return next(new AppError(errMessage, HttpStatus.SERVICE_UNAVAILABLE));
    }
  }
};
