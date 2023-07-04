import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  console.log("getAlluserssdfsdfsdf");
  try {
    const users = await User.find().limit(3);
    res.status(200).json(users);
  } catch (err) {
    console.log("err ", err);
    res.status(500).json({ message: err.message });
  }
};


export const editProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, location, occupation, phoneNumber } =
      req.body;
    const userProfile = await User.findById(req.user.id);
    if (!userProfile) {
      return res.status(404).json({ message: "userProfile not found" });
    }
    userProfile.firstName = firstName;
    userProfile.lastName = lastName;
    userProfile.email = email;
    userProfile.location = location;
    userProfile.phoneNumber = phoneNumber;
    await userProfile.save();
    res.status(200).json({ updatedUser: userProfile });
  } catch (err) {
    console.log("ee ", err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
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

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
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
