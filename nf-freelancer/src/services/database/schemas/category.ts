import Mongoose from 'mongoose';

export let CategorySchema: Mongoose.Schema;
try {
  CategorySchema = Mongoose.model('Category').schema;
} catch (error) {
  CategorySchema = new Mongoose.Schema(
    {
      userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      active: {
        type: Boolean,
        required: true,
        default: true,
      },
    },
    { collection: 'categories', timestamps: true }
  );
}
