'use strict';

import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "./keyToken.service.js";
import {createTokenPair} from "../auth/authUtils.js";
import {getInfoData} from "../utils/index.js";
import {AuthFailureError, BadRequestError} from "../core/error.response.js";
import {findByEmail} from "./shop.service.js";
import keytokenModel from "../models/keytoken.model.js";
import keyTokenService from "./keyToken.service.js";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
}

class AccessService {

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id);
        console.log('%c DEBUG[ delKey ]-66:', 'font-size:13px; background:pink; color:#483D8B;', delKey);
        return delKey;
    }
    static login = async ({ email, password, refreshToken = null }) => {
        // step 1: check email
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError("Shop not registered!");

        // step 2: check password
        const match  = bcrypt.compareSync(password, foundShop.password);
        if (!match) throw new AuthFailureError("Authentication error");

        // step 3: create AT and RT and save
        const publicKey = crypto.randomBytes(64).toString("hex")
        const privateKey = crypto.randomBytes(64).toString("hex")

        // step 4: create Tokens
        const { _id: userId } = foundShop;
        const tokens = createTokenPair({ userId, email }, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        });

        return {
            shop: getInfoData({ fields: ["_id", "name", "email"], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        //try {
            //step 1: check email
            const holderShop = await shopModel.findOne({ email: email }).lean();
            if (holderShop) {
                throw new BadRequestError("Error: Shop already registered!");
            }

            const passwordHash = bcrypt.hashSync(password, 10);
            const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] });

            if (newShop) {
                // created privateKey, publicKey
                // const { privateKey, publicKey} = crypto.generateKeyPairSync('rsa', { modulusLength: 4096,
                //         publicKeyEncoding: {
                //             type: 'pkcs1', // Public Key Cryptography Standards 1
                //             format: "pem"
                //         },
                //         privateKeyEncoding: {
                //             type: 'pkcs1',
                //             format: 'pem',
                //         }
                //     })

                // Cách đơn giản hơn để create publicKey, privateKey
                const publicKey = crypto.randomBytes(64).toString("hex")
                const privateKey = crypto.randomBytes(64).toString("hex")

                console.log({ privateKey, publicKey }); // save collection KeyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    throw new BadRequestError("Error: KeyStore already created!");
                    // return {
                    //     code: "xxx",
                    //     message: "keyStore error",
                    // }
                }

                // convert publicKeyString to publicKeyObject
                //const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // create token pair
                const tokens = createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log(`Created Token Success::`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ["_id", "name", "email"], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
        // } catch (error) {
        //     return {
        //         code: "xxx",
        //         message: error.message,
        //         status: "error"
        //     }
        // }
    }
}

export default AccessService