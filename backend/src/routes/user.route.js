import express from 'express';
import { getUsersFriends, getRecommendedUsers,sendFriendRequest,acceptFriendRequest,getFriendRequest,getOutgoingFriendRequest, rejectFriendRequest } from '../controller/user.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

//apply auth middleware to all routes after this line
router.use(protectedRoute);
router.get('/', getRecommendedUsers);
router.get('/friends', getUsersFriends);
router.get('/friend-requests/', getFriendRequest);
router.get('/outgoing-friend-requests/', getOutgoingFriendRequest);
router.post('/friend-requests/:id', sendFriendRequest);
router.put('/friend-requests/:id/accept', acceptFriendRequest);
router.put('/friend-requests/:id/reject', rejectFriendRequest);
// router.put('/friend-request/:id/reject', rejectFriendRequest);

export default router;