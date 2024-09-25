const express = require("express");
const router = express.Router(); // Using router instead of app
const fs = require("fs");
const path = require("path");

router.get("/countFiles", (req, res) => {
  const folderPath = path.join(__dirname, "uploadBooks");

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Unable to scan folder", error: err });
    }

    // Filter out non-files (if necessary)
    const fileCount = files.length;

    res.status(200).json({
      files: fileCount,
    });
  });
});

module.exports = router; // Exporting router for use in the main backend file
