'use strict';

import keytokenModel from "../models/keytoken.model.js";

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            // const publicKeyString = publicKey.toString();
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey,
            });
            console.log(`Keys::`, tokens)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }
}

export default KeyTokenService;