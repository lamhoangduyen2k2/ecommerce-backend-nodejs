'use strict';

import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "./keyToken.service.js";
import {createTokenPair} from "../auth/authUtils.js";
import {getInfoData} from "../utils/index.js";
import {BadRequestError} from "../core/error.response.js";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
}

class AccessService {
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