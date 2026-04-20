import { Router } from 'express';
import { listMessages, sendMessage, showForm, showEditForm, updateMessage } from '../controllers/request.controller.js';

export const requestRoutes = Router();

requestRoutes.get('/',          showForm);
requestRoutes.post('/send',     sendMessage);
requestRoutes.get('/messages',  listMessages);
requestRoutes.get('/edit/:id',  showEditForm);
requestRoutes.post('/edit/:id', updateMessage);