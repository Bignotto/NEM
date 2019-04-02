const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

app.get('/',(req,res) => {
    res.send('Server UP and running!');
})

require('./app/controllers/index')(app);

app.listen(3000,()=>{
    console.log('Server up and listeing on port 3000');
});
