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
    'https://authsys-git-main-fayaz-ahameds-projects.vercel.app',
    'https://authsys-omega.vercel.app'
]

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});



app.use(express.json());
app.use(cookieParser());

app.options('*', (req, res) => {
  res.sendStatus(200);
});


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked: " + origin));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
}));

//ApI endpoints
app.get('/', (req, res) => res.send("API running"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => console.log(`server running on port:${port}`));