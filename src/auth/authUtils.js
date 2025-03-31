'use strict';

import JWT from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler.js";
import {AuthFailureError, NotFoundError} from "../core/error.response.js";
import keyTokenService from "../services/keyToken.service.js";

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: 'authorization',
}

export const createTokenPair = (payload, publicKey, privateKey) => {
    try {
        //accessToken
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: "2 days",
        });
        //refreshToken
        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: "7 days",
        });

        //verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify::`,err)
            } else {
                console.log(`decode verify::`,decode)
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error
    }
}

export const authentication = asyncHandler(async (req, res, next) => {
    /*
    * 1 - Check userId missing??
    * 2 - get accessToken
    * 3 - verifyToken
    * 4 - check user in dbs
    * 5 - check keyStore with this userId
    * 6 - OK all => return next()
    * */
    // 1
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid Request");

    // 2
    const keyStore = await keyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore");

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid Request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid User");
        req.keyStore = keyStore;

        return next();
    } catch (error) {
        throw error;
    }
})