const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { Application, User } = require('../models');
const { Op } = require('sequelize');

router.get('/applications', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const allowedSort = ['createdAt', 'status', 'id'];
    const orderField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const orderDir = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    
    const applications = await Application.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone', 'login'],
        where: search ? {
          [Op.or]: [
            { fullName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } }
          ]
        } : undefined
      }],
      order: [[orderField, orderDir]],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      applications: applications.rows,
      total: applications.count,
      pages: Math.ceil(applications.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении заявок' });
  }
});

router.put('/applications/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    
    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }

    const updates = { status };
    if (typeof adminComment === 'string' && adminComment.trim()) {
      updates.adminComment = adminComment.trim();
    }
    
    await application.update(updates);
    
    res.json({
      message: 'Статус заявки обновлен',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса' });
  }
});

router.delete('/applications/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Application.destroy({ where: { id } });
    
    if (result === 0) {
      return res.status(404).json({ message: 'Заявка не найдена' });
    }
    
    res.json({ message: 'Заявка удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении заявки' });
  }
});

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalApplications = await Application.count();
    const newApplications = await Application.count({ where: { status: 'new' } });
    const assignedApplications = await Application.count({ where: { status: 'assigned' } });
    const completedApplications = await Application.count({ where: { status: 'completed' } });
    const totalUsers = await User.count({ where: { role: 'user' } });
    
    res.json({
      totalApplications,
      newApplications,
      assignedApplications,
      completedApplications,
      totalUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
});

module.exports = router;
