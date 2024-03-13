const { model,Schema,models } = require("mongoose");

var sss=new Schema({
    email: String,
    firstname: String,
    lastname: String,
    password: String,
    bookmarks: Array,
    createdAt: Object,
    updatedAt: Object

});
var ddd=new Schema({})

var satff =models.staffs|| model('staffs',ddd);
var User =models.Users|| model('Users', sss)
module.exports={satff,User};