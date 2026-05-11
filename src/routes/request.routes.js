import { Router } from 'express';
import { listMessages, sendMessage, showForm, showEditForm, updateMessage } from '../controllers/request.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';

export const requestRoutes = Router();

requestRoutes.get('/',          showForm);
requestRoutes.post('/send',     optionalAuth, sendMessage);
requestRoutes.get('/messages',  optionalAuth, listMessages);
requestRoutes.get('/edit/:id',  requireAuth,  showEditForm);
requestRoutes.post('/edit/:id', requireAuth,  updateMessage);