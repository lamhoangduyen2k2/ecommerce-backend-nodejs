'use strict';

import mongoose from "mongoose"
import { countConnect } from "../helpers/check.connect.js";
import config from "../configs/config.mongodb.js";

const { host, port, name } = config.db;
const connectString = `mongodb+srv://${host}:${port}/${name}?retryWrites=true&w=majority`;

class Database {
    constructor() {
        this.connect()
    }

    connect() {
        //Dev
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString, { maxPoolSize: 50 })
                .then(_ => console.log("Connected Mongodb Success PRO", countConnect()))
                .catch(err => console.log("Error Connect!"))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance();

export default instanceMongoDB;