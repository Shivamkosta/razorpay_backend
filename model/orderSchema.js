const mongoose = require('mongoose');

const orderScehma = new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    orders:{
        type:Array,
        default:[]
    }
},{timestamps:true});

const orderModel = mongoose.model('Order',orderScehma);

module.exports = orderModel