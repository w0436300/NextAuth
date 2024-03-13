
//pages/api/[[...hello]].js
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

//// connect to dataBase
var Ifconnect = false;
var logInusers = {};
mongoose.connect('mongodb://localhost:27017/nextapp')
    .then(function () {
        console.log('connect');
        Ifconnect = true
    })
    .catch(function () {
        console.log('noctcoenncte');
    })
///// defining the schema the (mmongoose.models.collection is required for not overwriting the schemas please put it before definig your collection)
var satff = mongoose.models.staffs || mongoose.model('staffs', {});
const User = mongoose.models.Users || mongoose.model('Users', {
  email: String,
  firstname: String,
  lastname: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  bookmarks: Array,
  createdAt: Object,
  updatedAt: Object,
});
/// this object keep record of which users are log-in for  Auth way please put {user_id:true} that another page know that use is login 

export default function Handeler(req, res) {
    console.log(logInusers);
    //// break the url of request to ['',api,....] 
    var UrlParts = req.url.split('/');
    console.log(req.url);
    /// endpoint for fetching the goods data
    if (req.url == '/api/goodsdata') {
        satff.find().then(function (data) {
            res.json(data);
        })
    }
    /// endpoint for fetching the goods that with good's id
    if (UrlParts[2] == 'findbyid') {
        console.log('aaaaa');
        var id = UrlParts[3];
        satff.findById(id)
            .then(function (data) {
                res.json(data);
            })
            .catch(function (er) {
                res.status(404).json({ ok: false });
            })

    }
    //// endpoint for front to ask if the user is login or not
    if (UrlParts[2] == 'IsLogin') {
        var id = UrlParts[3];
        var s = 0;
        /// check if the user is login or not
        if (logInusers['' + id] == true) {
            s = 1;
            res.json({ ok: true })
        }
        if (s == 0) {
            res.json({ ok: false });
        }

    }
    //// this end point for profile page which front  page ask for permision to show profile page 
    // if (UrlParts[2] == 'users') {
    //     console.log('aaaaa');
    //     console.log(logInusers);
    //     var id = UrlParts[3];
    //     if (logInusers['' + id] != undefined) {
    //         /// check if the user is login or not
    //         if (logInusers['' + id] == true) {
    //             User.findById(id)
    //                 .then(function (data) {
    //                     res.status(200).json(data)
    //                 })
    //                 .catch(function (er) {
    //                     res.status(400).json({ ok: false });
    //                 })
    //         }
    //         if (logInusers['' + id] == false) {
    //             res.status(404).json({ ok: false })
    //         }
    //     }
    //     if (logInusers['' + id] == undefined) {
    //         res.status(404).json({ ok: false });
    //     }
    // }
    //// endpoint for sigin-in
    if (req.url == '/api/signin') {
        if (req.method === 'POST') {
            async function siginIn() {
                const { email, password } = req.body;
 
                const user = await User.findOne({ email });
 
                if (!user) {
                    return res.status(400).send('User not Found');
                }
 
                if (password !== user.password) {
                    return res.status(401).send('Invalid Password');
                }
                /// use for refrences for another pages to let access data
                logInusers['' + user._id] = true;
                res.staus(200).json({
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    roles: user.roles,
                    registeredAt: user.registeredAt
                })
            }
            siginIn()
        }
    }
    if (UrlParts[2] === 'users' && UrlParts[3]) {
        const userId = UrlParts[3];
        User.findById(userId)
          .then((user) => {
            if (!user) {
              res.status(404).json({ message: 'User not found' });
            } else {
              res.status(200).json(user);
            }
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }


}

///// To do: need end point for Auth for sign-in , endpoints for dashboard,sing-out endpoint,cookies,..... 