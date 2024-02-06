import Mongoose from 'mongoose';

export let UserSchema: Mongoose.Schema;
try {
  UserSchema = Mongoose.model('User').schema;

  // DATABASE MIGRATION
  // UserSchema.add({
  //   limit: {
  //     type: Number,
  //     required: true,
  //     default: 81000,
  //   },
  // });
  // const User = Mongoose.model('User', UserSchema);
  // User.updateMany({}, { $set: { limit: 81000 } })
  //   .then((res) => console.log(res))
  //   .catch((error) => console.log(error));

} catch (error) {
  UserSchema = new Mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      limit: {
        type: Number,
        required: true,
        default: 81000,
      },
    },
    { collection: 'users', timestamps: true }
  );
}
