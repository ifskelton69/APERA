import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    }
    ,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        required: true,
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },
    friends:[
    {
        type: mongoose.Schema.Types.ObjectId,  //Used as a unique identifier for documents.
        ref: "User",
    },],

}, { timestamps: true }); // Define the user schema with timestamps

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;

}
const User = mongoose.model("User", userSchema);


export default User; 
