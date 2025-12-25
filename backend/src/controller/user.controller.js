import User from '../models/Users.js';
import FriendRequest from '../models/friendRequest.js';
import { request } from 'express';

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const getRecommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },//not current user
                { _id: { $nin: currentUser.friends } },//not already friends
                { isOnBoarded: true }//only onboarded(loggedin) users
            ]
        })
        res.status(200).json({ success: true, data: getRecommendedUsers });
    } catch (error) {
        console.error(error, "error in getRecommendedUsers controller ");
        res.status(500).json({ message: "Internal server error" });

    }
}

export async function getUsersFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends").populate('friends', 'fullName profilePic ');
        res.status(200).json(user.friends);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch friends" });
}
}

export async function sendFriendRequest(req, res) {
  try {
    const myid = req.user.id;
    const { id: recipientId } = req.params;

    if (myid === recipientId) {
      return res.status(400).json({ message: "You cannot send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already friends
    if (recipient.friends.map(String).includes(myid.toString())) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Existing request in FriendRequest collection
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myid, recipient: recipientId },
        { sender: recipientId, recipient: myid }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const newRequest = new FriendRequest({
      sender: myid,
      recipient: recipientId
    });

    await newRequest.save();

    res.status(200).json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId  } = req.params;//id of the user who sent the request
        const friendRequest = await FriendRequest.findById(requestId );

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        } //only the recipient can accept the request
        friendRequest.status = 'accepted';
        await friendRequest.save();
        //update both users friends list
        //$addToSet adds a value to an array only if the value is not already present in the array
        await User.findByIdAndUpdate(friendRequest.sender, { $addToSet: { friends: friendRequest.recipient } });
        await User.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { friends: friendRequest.sender } });
        res.status(200).json({ success: true, message: "Friend request accepted" });


    } catch (error) {
        console.log(error, "error in acceptFriendRequest controller");
        res.status(500).json({ message: "Internal server error" });


    }
};

export async function rejectFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params; // friend request ID

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to reject this request" });
    }

    await User.findByIdAndUpdate(friendRequest.sender, {
      $pull: { outgoingFriendRequests: friendRequest._id },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $pull: { incomingFriendRequests: friendRequest._id },
    });

    await FriendRequest.findByIdAndDelete(friendRequest._id);

    return res
      .status(200)
      .json({ message: "Friend request rejected successfully" });
  } catch (error) {
    console.error("Error in rejectFriendRequest controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function getFriendRequest(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({ recipient: req.user.id, status: 'pending' }).populate('sender', 'fullName profilePic learningLanguage nativeLand');
        const acceptedRequests = await FriendRequest.find({ sender: req.user.id, status: 'accepted' }).populate('sender', 'fullName profilePic');
        res.status(200).json({ success: true, incomingRequests, acceptedRequests });
    } catch (error) {
        console.log(error, "error in getFriendRequest controller");
        res.status(500).json({ message: "Internal server error" });
        

    }
};

export async function getOutgoingFriendRequest(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({ sender: req.user.id, status: 'pending' }).populate('recipient', 'fullName profilePic');
        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log(error, "error in getOutgoingFriendRequest controller");
        res.status(500).json({ message: "Internal server error" });
        
    }
}