'use strict';

import keytokenModel from "../models/keytoken.model.js";
import mongoose from "mongoose";

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // });
            // console.log(`Keys::`, tokens)
            // return tokens ? tokens.publicKey : null;
            const filter = { user: userId }, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }, options = { upsert: true, new: true }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new mongoose.Types.ObjectId(userId) }).lean();
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    }
}

export default KeyTokenService;