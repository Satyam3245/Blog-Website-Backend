import express, { Request, Response, Router } from 'express';
import userRoute from './routes/user';
import blogRoute from './routes/blog';
const app = express();
const router = Router();
const port = 3000;
app.use(express.json())
app.use('/api/v1/user/',userRoute)
app.use('/api/v1/blog/',blogRoute)


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
