import express from 'express';
import { signUp, login, logout ,onboard } from '../controller/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);
 
router.post('/logout', logout);

router.post('/onboard', protectedRoute, onboard);
//check current user logged in 
router.get('/me', protectedRoute, (req, res) => {
  res.status(200).json({success:true,user:req.user});
});

export default router;