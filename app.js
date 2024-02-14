const express = require('express');
const allRoutes = require('./routes/allRoutes.js');
const db = require ('./models/databaseModel.js')

const app = express();
const PORT = 8080;

app.use(express.json());


// Routes
// db.connect()
//   .then(()=>{
//     app.use('/', allRoutes);

//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
// .catch(error =>{
//   console.error('error while connecting to db',error);
// });
app.use('/', allRoutes);
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
});

module.exports= app;