'use strict';

import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Shop",
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

//Export the model
export default model(DOCUMENT_NAME, keyTokenSchema);