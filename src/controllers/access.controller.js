'use strict';

import AccessService from "../services/access.service.js";

class AccessController {

    signUp = async (req, res, next) => {
        return res.status(200).json(await AccessService.signUp(req.body));
        /*
        * 200 Ok
        * 201 CREATED
        * */
    }
}

export default new AccessController();