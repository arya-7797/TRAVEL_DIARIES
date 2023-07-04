import GroupsModel from "../models/GroupsModel.js";

export const createGroup = async (req, res) => {
  console.log("cggg ", req.body);
  try {
    const { name, description, creator, members, image } = req.body;
    const newGroup = new GroupsModel({
      name,
      description,
      creator,
      members,
      image,
    });
    const savedGroup = await newGroup.save();
    const createdGroup = await GroupsModel.findById(savedGroup._id).populate(
      "creator",
      "firstName lastName picturePath email"
    );
    res.status(201).json(createdGroup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const getGroups = async (req, res) => {
  try {
    const groups = await GroupsModel.find().populate(
      "creator",
      "firstName lastName picturePath email"
    );
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
