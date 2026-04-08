import jsonServer from 'json-server';
import auth from 'json-server-auth';
import cors from 'cors'; 
console.log("auth type:", typeof auth);
console.log(auth);
const app = jsonServer.create();
const router = jsonServer.router('db.json');

// resolve CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kb-4dollar.github.io"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.options('*', cors());

// 기본 미들웨어
app.use(jsonServer.defaults());

// 🔥 이 2줄이 핵심
app.db = router.db;
app.use(auth);

// 라우터 연결
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running');
});
