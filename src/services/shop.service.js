'use strict';

import shopModel from "../models/shop.model.js";

export const findByEmail = async ({ email, select = { email: 1, password: 0, name: 1, status: 1, roles: 1}}) => {
    return await shopModel.findOne({ email }).select(select);
}