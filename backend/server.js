const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs"); // Import fs to interact with the file system
const path = require("path");
const countBook = require("./countBook");
const insertBook = require("./InsertBookPg");
const app = new express();

app.use(cors());
app.use(express.json());
app.use(countBook);

// Define the folder where books will be uploaded
const UPLOAD_DIR = "./uploadBooks";

// Function to count the number of files in the upload directory
function getBookCount() {
  try {
    const files = fs.readdirSync(UPLOAD_DIR); // Read the folder's content
    return files.length; // Return the number of files
  } catch (err) {
    console.error("Error reading uploadBooks directory:", err);
    return 0; // Return 0 if there's an error (e.g., folder doesn't exist)
  }
}

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR); // Specify the folder
  },
  filename: function (req, file, cb) {
    const bookCount = getBookCount() + 1; // Get the total count and add 1
    const fileExtension = path.extname(file.name); // Extract the file extension
    const newFileName = `${bookCount}${fileExtension}`; // Name the file as 'count.extension'
    cb(null, newFileName); // Use the new filename
  },
});

// Set up multer
const upload = multer({ storage: storage });

// Define the upload API
app.post("/bookUpload", upload.single("wordFile"), (req, res) => {
  try {
    const { name, price, description } = req.body;
    const wordFile = req.file; // Access uploaded file using req.file

    // Check if the file was uploaded
    if (!wordFile) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // Respond with success message and file details
    res.status(200).json({
      message: "Book uploaded successfully!",
      bookDetails: { name, price, description },
      file: wordFile.filename, // Send back the filename
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading the book", error: err });
  }
});

// Use the other middlewares
app.use(insertBook);

// Start the server
app.listen(8000, () => {
  console.log("Hi I am running on port 8000");
});
