import jsonServer from 'json-server';
import auth from 'json-server-auth';

console.log("auth type:", typeof auth);
console.log(auth);
const app = jsonServer.create();
const router = jsonServer.router('db.json');
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://kb-4dollar.github.io");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


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
