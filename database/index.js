const mongoose = require("mongoose");
const {dbHost,dbName,dbPass,dbPort,dbUser} = require("../app/config");
mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`,{
    useNewUrlParser:true,
    useUnifiedTopology : true,
    useFindAndModify : false,
    useCreateIndex : true
})

const db = mongoose.connection;
module.exports = db;