const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

router.post('/register', [
  body('login')
    .isLength({ min: 6 }).withMessage('Логин: минимум 6 символов')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('Логин: только латиница и цифры'),
  body('password')
    .isLength({ min: 8 }).withMessage('Пароль: минимум 8 символов'),
  body('fullName')
    .matches(/^[а-яА-ЯёЁ\s]+$/).withMessage('ФИО: только кириллица и пробелы'),
  body('phone')
    .matches(phonePattern).withMessage('Телефон: формат +7 (999) 123-45-67'),
  body('email')
    .isEmail().withMessage('Email: неверный формат')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = errors.array();
      return res.status(400).json({
        message: validationErrors[0].msg,
        errors: validationErrors
      });
    }

    const { login, password, fullName, phone, email } = req.body;

    const existingUser = await User.findOne({ where: { login } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const user = await User.create({
      login,
      password,
      fullName,
      phone,
      email
    });

    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Регистрация успешна',
      token,
      user: {
        id: user.id,
        login: user.login,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Пользователь с такими данными уже существует' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.errors?.[0]?.message || 'Некорректные данные регистрации' });
    }
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
});

router.post('/login', [
  body('login').notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    const user = await User.findOne({ where: { login } });
    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, login: user.login, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user.id,
        login: user.login,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при авторизации' });
  }
});

module.exports = router;
