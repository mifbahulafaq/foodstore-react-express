const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const deliveryAddressSchema = Schema({
    nama : {
        type : String,
        maxlength : [255,"panjang maksimal nama alamat adalah 255 karakter"],
        required : [true,"nama alamat harus diisi"]
    },
    kelurahan : {
        type : String,
        maxlength : [255,"panjang maksimal kelurahan adalah 255 karakter"],
        required : [true,"kelurahan harus diisi"]
    },
    kecamatan : {
        type : String,
        maxlength : [255,"panjang maksimal kecamatan adalah 255 karakter"],
        required : [true,"kecamatan harus diisi"]
    },
    kabupaten : {
        type : String,
        maxlength : [255,"panjang maksimal kabupaten adalah 255 karakter"],
        required : [true,"kabupaten harus diisi"]
    },
    provinsi : {
        type : String,
        maxlength : [255,"panjang maksimal provinsi adalah 255 karakter"],
        required : [true,"provinsi harus diisi"]
    },
    detail : {
        type : String,
        maxlength : [1000,"panjang maksimal detail alamat adalah 1000 karakter"],
        required : [true,"detail alamat harus diisi"]
    },
    user : [
        {type : Schema.Types.ObjectId, ref : "User"}
    ]
},{timestamps : true})

module.exports = model("DeliveryAddress",deliveryAddressSchema);


