//mongodb connect


const mongoose =require ('mongoose');

//  mongoose.connect('mongodb://localhost:27017/ProWireless');
mongoose
  .connect("mongodb+srv://jesi:NOfu22wMZlqo651I@cluster0.hvwtee8.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));
 const db =mongoose.connection;
 db.on('error', error => console.error(error))
 db.once('open',() => console.log('Connected to Mongoose'))
