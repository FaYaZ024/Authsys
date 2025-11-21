import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";


const app = express();
const port = process.env.PORT || 4000
connectDB();

const allowOrgins = ['http://localhost:5173',
    'https://authsys-app.web.app',
    'https://authsys-app.firebaseapp.com'
]

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowOrgins, credentials: true }));

//ApI endpoints
app.get('/', (req, res) => res.send("API running"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => console.log(`server running on port:${port}`));