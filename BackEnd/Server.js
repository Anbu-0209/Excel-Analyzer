const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const ExcelData = require("./Models/ExcelData");
const UploadHistory = require("./Models/UploadHistory");
const connectDB = require("./config/db");
const User = require("./Models/register");
const LoginLog = require("./Models/login");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// ========== Ensure Directories ==========
const uploadsDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ========== Routes ==========

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email is invalid" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    await new LoginLog({
      email: user.email,
      password: user.password,
      token: token,
    }).save();

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});


app.post('/uploads', async (req, res) => {
  if (!req.files || !req.files.File) return res.status(400).json({ error: "No file uploaded." });

  const file = req.files.File;
  const savePath = path.join(uploadsDir, `${Date.now()}-${file.name}`);

  try {
    await file.mv(savePath);

    const fileSize = (file.size / 1024).toFixed(2) + " KB";

    // Save upload history
    const uploadHistory = new UploadHistory({
      fileName: file.name,
      size: fileSize,
    });

    await uploadHistory.save();

    // Process the file
    const workbook = XLSX.readFile(savePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Save parsed Excel data
    const excelDoc = new ExcelData({ data: jsonData });
    await excelDoc.save();

    res.json({ message: "File uploaded successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to process file", details: err.message });
  }
});

app.get("/excel-data", async (req, res) => {
  try {
    const allData = await ExcelData.find()
      .sort({ uploadedAt: -1 })
      .select("-uploadedAt -__v"); 

    const cleanedData = allData.flatMap(doc => doc.data);

    res.json(cleanedData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data", details: err.message });
  }
});

app.get("/uploadHistory", async (req, res) => {
  try {
    const uploadHistory = await UploadHistory.find()
      .sort({ uploadTime: -1 }) 
      .select("fileName size uploadTime"); 

    res.json(uploadHistory);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch upload history", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
