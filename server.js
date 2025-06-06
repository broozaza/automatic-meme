require("dotenv").config();
const express = require("express");
const rbx = require("noblox.js");
const app = express();

const groupId = parseInt(process.env.GROUP_ID);
const cookie = process.env.COOKIE;

app.use(express.static("public"));

async function startApp() {
  try {
    await rbx.setCookie(cookie);
    const currentUser = await rbx.getAuthenticatedUser();
    console.log(`✅ Logged in as: ${currentUser.name} [${currentUser.id}]`);
  } catch (err) {
    console.error("❌ Failed to authenticate:", err.message);
    process.exit(1);
  }
}
startApp();

app.get("/ranker", async (req, res) => {
  const userId = parseInt(req.query.userid);
  const rank = parseInt(req.query.rank);

  if (isNaN(userId) || isNaN(rank)) {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing 'userid' or 'rank'. Example: /ranker?userid=123&rank=150"
    });
  }

  try {
    console.log(`📥 Request to rank user ${userId} to rank ${rank}`);
    const result = await rbx.setRank(groupId, userId, rank);
    console.log(`✅ Rank changed successfully for user ${userId}`);
    res.json({ success: true, message: "Rank set successfully!", result });
  } catch (err) {
    console.error("❌ Failed to set rank:", err); // Full error object
    res.status(500).json({ success: false, error: err.message });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 App is listening on port ${listener.address().port}`);
});
