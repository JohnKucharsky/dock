const express = require('express');
const mongoose = require('mongoose');
const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
} = require('./config/config');

const postRouter = require('./routes/postRoutes');

const app = express();
app.use(express.json());

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

app.use('/api/v1/posts', postRouter);

const port = process.env.PORT || 4000;

const connectWithRetry = () => {
    mongoose
        .connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('success database'))
        .catch((e) => {
            console.log(e);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

app.get('/', (req, res) => {
    res.json({ message: 'success' });
});

app.listen(port, () => console.log('listen on port 4000'));
