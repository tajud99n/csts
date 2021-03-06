import { Response, NextFunction } from "express";
import httpCodes from "http-status-codes";
import { http_responder } from "../utils/http_response";
import Utils from "../utils/utils";
import AdminService from "../services/AdminService";
import UserService from "../services/UserService";

 /**
   * authToken
   * @desc A middleware to authenticate users token
   * @param {Object} req request any
   * @param {Object} res response object
   * @param {Function} next nextFunction middleware
   * @returns {void|Object} object
   */
export const authToken = (req: any, res: Response, next: NextFunction) => {
	const bearerToken = req.headers["authorization"];
	if (!bearerToken) {
		const errMessage = "Access denied. No token provided.";

		return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
    }
	const token = bearerToken.split(' ')[1];
	// Verify token
	try {
		const decoded = Utils.verifyToken(token);

		req.id = decoded.id;
		next();
	} catch (err) {
		const errMessage = "Invalid token. Please login";
		return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
	}
};

 /**
   * authAdmin
   * @desc A middleware to authenticate admin users
   * @param {Object} req request any
   * @param {Object} res response object
   * @param {Function} next nextFunction middleware
   * @returns {void|Object} object
   */
export const authAdmin = async (req: any, res: Response, next: NextFunction) => {
	try {
		const admin = await AdminService.getAdminIdAndRole(req.id);
		if (!admin) {
			const errMessage = "Invalid token. Please login";
			return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
		}
		req.user = admin;
		next();
	} catch (err) {
		const errMessage = "Invalid token. Please login";
		return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
	}
};

 /**
   * adminAccess
   * @desc A middleware to verify admin has the required role
   * @param {Object} req request any
   * @param {Object} res response object
   * @param {Function} next nextFunction middleware
   * @returns {void|Object} object
   */
export const adminAccess = async (req: any, res: Response, next: NextFunction) => {
	try {
		if (req.user.role !== "admin") {
			const errMessage = "Unauthorized action";
			return http_responder.errorResponse(res, errMessage, httpCodes.FORBIDDEN);
		}
		next();
	} catch (err) {
		const errMessage = "Access denied. Unauthorized action";
		return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
	}
};

/**
  * authUser
  * @desc A middleware to authenticate users
  * @param {Object} req request any
  * @param {Object} res response object
  * @param {Function} next nextFunction middleware
  * @returns {void|Object} object
  */
export const authUser = async (req: any, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.checkIfUserExist(req.id);
		if (!user) {
			const errMessage = "Invalid token. Please login";
			return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
		}
		req.user = user;
		next();
	} catch (err) {
		const errMessage = "Invalid token. Please login";
		return http_responder.errorResponse(res, errMessage, httpCodes.UNAUTHORIZED);
	}
};