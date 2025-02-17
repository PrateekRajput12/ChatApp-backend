import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt, { hash } from 'bcryptjs'
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            console.log(fullName, email, password);
            return res.status(400).json({ message: "all fields are required" })

        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at lease 6 characters" })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // generate jwt token 
            generateToken(newUser.id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,


            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error " })

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Unvalid credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePics
        })
    } catch (error) {
        console.log("Erro in login controlller ", error.message);
        res.status(500).json({ message: "Invalid Server Error" })
    }
}

export const logout = (req, res) => {
    try {
        // res.send("logout route")
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out Successfully" })
    } catch (error) {
        console.log("Error in logout controller ", error.message);
        res.status(500).jsoYn({ message: "Internal Server Error" })
    }
}