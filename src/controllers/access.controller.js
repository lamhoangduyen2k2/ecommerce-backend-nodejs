'use strict';

import AccessService from "../services/access.service.js";
import {CREATED, SuccessResponse} from "../core/success.response.js";

class AccessController {
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout success!",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login( req.body )
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: "Registered OK!",
            metadata: (await AccessService.signUp(req.body)),
            options: {
                limit: 10,
            }
        }).send(res)
        //return res.status(200).json(await AccessService.signUp(req.body));
        /*
        * 200 Ok
        * 201 CREATED
        * */
    }
}

export default new AccessController();