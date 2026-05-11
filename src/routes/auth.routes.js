import { Router } from 'express';
import { showRegister, register, showLogin, login, logout } from '../controllers/auth.controller.js';

export const authRoutes = Router();

authRoutes.get('/register',  showRegister);
authRoutes.post('/register', register);
authRoutes.get('/login',     showLogin);
authRoutes.post('/login',    login);
authRoutes.get('/logout',    logout);