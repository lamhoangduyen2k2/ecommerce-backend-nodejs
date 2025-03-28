'use strict';

import mongoose from "mongoose"

const connectString = "mongodb+srv://duyen0289:duyen0289@duyencluster.umn5a.mongodb.net/shopDev?retryWrites=true&w=majority";
mongoose.connect(connectString).then(_ => console.log("Connected Mongodb Success")).catch(err => console.log("Error Connect!"))

//Dev
if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

export default mongoose;