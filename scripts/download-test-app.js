const fs = require("fs");
const path = require("path");
const https = require("https");

// Create apps directory if it doesn't exist
const appsDir = path.join(__dirname, "..", "apps");
if (!fs.existsSync(appsDir)) {
  fs.mkdirSync(appsDir, { recursive: true });
  console.log("Created apps directory");
}

const apkUrl =
  "https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk";
const apkPath = path.join(appsDir, "ApiDemos-debug.apk");

// Check if APK already exists
if (fs.existsSync(apkPath)) {
  console.log("APK already exists, skipping download");
  process.exit(0);
}

console.log("Downloading ApiDemos-debug.apk...");

const file = fs.createWriteStream(apkPath);

https
  .get(apkUrl, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Handle redirect
      const redirectUrl = response.headers.location;
      console.log("Following redirect...");
      https.get(redirectUrl, (res) => {
        res.pipe(file);
      });
    } else {
      response.pipe(file);
    }

    file.on("finish", () => {
      file.close();
      console.log("Download completed!");
    });

    file.on("error", (err) => {
      console.error("Download failed:", err.message);
      // Clean up partial file if download fails
      if (fs.existsSync(apkPath)) {
        fs.unlinkSync(apkPath);
      }
      process.exit(1);
    });
  })
  .on("error", (err) => {
    console.error("Failed to start download:", err.message);
    process.exit(1);
  });
