const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { User } = require('../models');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'login', 'fullName', 'phone', 'email', 'role', 'createdAt']
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении профиля' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, email } = req.body;
    
    await User.update(
      { fullName, phone, email },
      { where: { id: req.user.id } }
    );
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'login', 'fullName', 'phone', 'email', 'role']
    });
    
    res.json({
      message: 'Профиль обновлен',
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
});

module.exports = router;
