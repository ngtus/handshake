const express = require('express');
//const httpsLocalhost = require("https-localhost")

//const app = httpsLocalhost()
app.use(express.static('./'));

app.listen(3000, () => console.log('Server started'))


