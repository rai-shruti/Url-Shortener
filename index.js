const express = require("express");
const {connectToMongoDB}=require("./connect");
const urlRoute = require('./routes/url');
const URL=require('./models/url');

const app=express();
const PORT=8001;


connectToMongoDB('mongodb://localhost:27017/short-url').then(()=>console.log('Mongodb connected'));
app.use(express.json());

app.use("/url",urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true } // Optional: Returns the updated document
    );

    
    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send("URL not found");
    }
});

app.listen(PORT,()=>console.log(`Server started at Port:${PORT}`));
