const mongoose = require("mongoose");
const {model, Schema} = mongoose;

let categorySchema = Schema({
    name : {
        type : String,
        minlength : [3, "Panjang Nama category minimal 3 caracter"],
        maxlength : [20, "panjang nama kategory maksimal 20 karakter"],
        required : [true, "Nama kategori harus diisi"]
    }
})

module.exports = model("Category", categorySchema);