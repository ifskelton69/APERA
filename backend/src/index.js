import express from 'express';
import dotenv from 'dotenv';
import "dotenv/config.js";
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import cookieParser from 'cookie-parser';
import path from "path";
import { connectDB } from './lib/db.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,//allow cookies to be sent by frontend
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/chat",chatRoute);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname,'../frontend/dist')));
//     app.get('*',(req,res)=>{
//         res.sendFile(path.resolve(__dirname,"../frontend","dist","index.html"));
//     });
// }
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});