import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, message, roomId } = req.body;

    if (!senderId || !receiverId || !message || !roomId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMessage = new Message({ senderId, receiverId, message, roomId });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
