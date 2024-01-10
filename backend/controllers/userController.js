const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// USER CREATING API REGISTRATION
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  const profileImg = req.files ? req.files.pic : null;
  let pic;
  try {
    if (!name && !email && !password) {
      return res.status(400).json({ message: "Please Enter All the Fields" });
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    // IF User UPLOAD A Profile Pic
    if (profileImg) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"]; // Allowed Exteniosn
      const fileExtension = path.extname(profileImg.name).toLowerCase(); // Checking User File Extension

      //if user have not allowed extensions
      if (!allowedExtensions.includes(fileExtension)) {
        return res
          .status(400)
          .json({ message: "Invalid file type. Please Try Another File Type" });
      }

      const uniqueImageName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      const folderPathImage = path.join(
        __dirname,
        "..",
        "public",
        "users_profile_images"
      );
      if (!fs.existsSync(folderPathImage)) {
        fs.mkdirSync(folderPathImage, { recursive: true });
      }

      const imagePath = path.join(
        folderPathImage,
        uniqueImageName + fileExtension
      );
      // Move the uploaded file to the server
      await profileImg.mv(imagePath);
      pic = `/users_profile_images/${uniqueImageName + fileExtension}`;
    } else {
      pic = "/default/default_profile_pic.png";
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const userCreated = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });
    res.status(200).json({ message: "User Created Sucessfully", userCreated });
  } catch (error) {
    console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      return res.status(400).json({ message: "Please Enter Email and Password" });
    }
 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(402).json({ message: "User May Not Found" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Cridentials" });
    }

    // If the password is correct, create and send a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email},
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );
    res.status(200).json({ message: 'Login successful',  token: token });
  } catch (error) {
    console.log(error);
        res.status(500).json({ message: 'Internal Server Error' })
  }
};

const getAllUser = async(req, res)=>{
  const userId = req.user.userId;
  const keywords = req.query.search ? {
    $or: [
      {name: {$regex: req.query.search, $options: "i"}},
      {email: {$regex: req.query.search, $options: "i"}},
    ]
  }:{};

  const users = await User.find(keywords).find({_id:{$ne: userId }})

  res.status(200).json(users)

}

const currentUser = async(req, res)=>{
  const userId = req.user.userId;
  try {
    const userData = await User.findOne({_id: userId});
    if (!userData) {
      return res.status(400).json({ message: "User May Not Found" });
    }
    res.status(200).json(userData)
    
  } catch (error) {
    console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
  }
}



module.exports = {
  signupUser,
  loginUser,
  getAllUser,
  currentUser,
};
