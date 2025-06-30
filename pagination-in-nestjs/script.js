import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 15 },
  email: { type: String, required: true },
});

mongoose
  //   .connect('mongodb://localhost:27018/test')
  .connect(
    'mongodb+srv://root:root@cluster0.7cbnuam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  )

  .then(async (each) => {
    // console.log('each', each);
    const UserModel = mongoose.model('User', userSchema);
    const users = [];

    console.time('Started');
    for (let i = 0; i <= 100000; i++) {
      users.push({
        name: `random ${i}`,
        email: `random${i}@gmail.com`,
      });
    }

    await UserModel.insertMany(users);

    console.timeEnd('Started');
    await mongoose.disconnect();
  })
  .catch(() => {
    console.log('Something went wrong!!');
  });
