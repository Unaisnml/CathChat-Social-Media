import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/* READ */
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getFriendList = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, 'fhfhfhfhfh');
    const user = await User.findById(id);
    console.log(user, 'kitti');
    const friends = await Promise.all(user.friends.map((userId) => User.findById(userId)));
    console.log(friends, 'frrrrrrrrrrrrrrrrr');
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    console.log('id:', id, 'friendId:', friendId);
    const user = await User.findById(id);
    console.log(user, 'user vannuuu', id);
    const friend = await User.findById(friendId);
    console.log(friend, 'friendne kitti', friendId);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
        console.log(formattedFriends, 'formated friiiiiiiiiiiind');
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const id = req.params.id;

  const { _id, firstName, lastName, occupation, location } = req.body;

  if (id === _id) {
    try {
      const user = await User.findByIdAndUpdate(id, req.body, {
        new: true
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.status(200).json({ user, token, success: true });
    } catch (error) {
      console.log(error);
      res.status(400).json(error, 'error');
    }
  } else {
    res.status(403).json('Access Denied! You can update only your own Account.');
  }
};
