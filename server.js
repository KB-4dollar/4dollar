import jsonServer from 'json-server';
import auth from 'json-server-auth';

const app = jsonServer.create();
const router = jsonServer.router('db.json');

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
