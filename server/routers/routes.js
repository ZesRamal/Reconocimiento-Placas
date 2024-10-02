import express from 'express';

const router = express.Router();

router.post('/post', async (req, res) => {});

router.get('/get', (req, res) => {
  res.json({ message: 'GET' });
});

export default router;