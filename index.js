const express = require("express");
const { connectToMongoDB } = require("./connect");
const dotenv = require('dotenv');
const urlRoute = require("./routes/url");
const URL = require("./models/url")

dotenv.config();

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.MONGO_URI).then(() => console.log("Mongodb Connected"));

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    },{
        $push: {
            visitHistory: {timestamp: Date.now()},
        },
    });
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));