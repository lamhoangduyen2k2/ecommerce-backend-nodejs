'use strict';

import {findById} from "../services/apikey.service.js";

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: 'authorization',
}

export const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error",
            })
        }
        // check objKey
        const objKey = await findById(key);
        console.log(objKey)

        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error",
            })
        }
        req.objKey = objKey;

        return next();
    } catch (error) {
        return next(error)
    }
}

export const permission = ( permission ) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Denied",
            });
        }

        console.log(`permissions::`, req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: "Permission Denied",
            });
        }

        return next();
    }
}

