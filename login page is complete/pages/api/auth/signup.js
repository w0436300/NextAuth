import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { firstname, lastname, email, password } = req.body;

        // await mongoose.connect('mongodb://localhost:27017/nextapp');
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            email,
            firstname,
            lastname,
            password: hashedPassword,
            role: 'user',
            bookmarks: [],
            createdAt: new Date(),
            updatedAt: null,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}