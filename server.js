const express = require('express');
// const httpsLocalhost = require("https-localhost")

// const app = httpsLocalhost()
const app = express();
app.use(express.static('view/'));

app.listen(3000, () => console.log('Server started'));


