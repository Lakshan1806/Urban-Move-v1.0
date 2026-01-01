import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  console.log("Received message POST request"); 
  try {
    const { senderId, receiverId, message, roomId } = req.body;
    const newMessage = new Message({ senderId, receiverId, message, roomId });
    await newMessage.save();
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);  
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
