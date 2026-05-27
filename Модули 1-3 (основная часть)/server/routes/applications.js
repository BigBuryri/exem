const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { Application, User } = require('../models');
const { isValidRussianDate } = require('../utils/dateValidation');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['fullName', 'email', 'phone']
      }]
    });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении заявок' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, data } = req.body;

    if (data?.startDate && !isValidRussianDate(data.startDate)) {
      return res.status(400).json({
        message: 'Некорректная дата начала банкета. Формат: ДД.ММ.ГГГГ'
      });
    }
    
    const application = await Application.create({
      userId: req.user.id,
      type,
      data,
      status: 'new'
    });
    
    res.status(201).json({
      message: 'Заявка создана успешно',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании заявки' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    
    const application = await Application.findOne({
      where: { id, userId: req.user.id }
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }
    
    if (application.status === 'new') {
      return res.status(400).json({ message: 'Отзыв можно оставить после обработки заявки администратором' });
    }
    
    await application.update({ rating, review });
    
    res.json({
      message: 'Отзыв добавлен',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении заявки' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Application.destroy({
      where: { id, userId: req.user.id, status: 'new' }
    });
    
    if (result === 0) {
      return res.status(404).json({ message: 'Заявка не найдена или не может быть удалена' });
    }
    
    res.json({ message: 'Заявка удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении заявки' });
  }
});

module.exports = router;
