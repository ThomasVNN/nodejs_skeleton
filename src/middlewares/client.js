import { AppError } from '../components/core/errors';
import { Common } from '../helpers/common';
import { Context } from '../helpers/context';

export const ClientMiddleware = {
  /**
   * Assign client_uuid for super admin user
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  setAdminClient(req, res, next) {
    // Only apply for below method
    const applyMethod = ['POST', 'PUT', 'GET'];
    if (!applyMethod.includes(req.method)) {
      next();
      return;
    }

    const context = new Context();
    const isSuperAdmin = Common.isSuperAdmin();
    if (isSuperAdmin && ['POST', 'PUT'].includes(req.method)) {
      if (!req.body.client_uuid && req.method === 'POST') {
        next(new AppError('Client is required', 422));
        return;
      }

      context.currentUser = {
        ...context.currentUser,
        client_uuid: req.body.client_uuid
      };

      next();
      return;
    }

    if (isSuperAdmin && req.method === 'GET' && req.query.client_uuid) {
      context.currentUser = {
        ...context.currentUser,
        client_uuid: req.query.client_uuid
      };
    }

    next();
  }
};
