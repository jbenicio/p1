import Mongoose from 'mongoose';

export let NFSchema: Mongoose.Schema;
try {
  NFSchema = Mongoose.model('NF').schema;
} catch (error) {
  NFSchema = new Mongoose.Schema(
    {
      userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      companyId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        index: true,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      payDate: {
        type: Date,
        required: true,
      },
    },
    { collection: 'nfs', timestamps: true }
  );
}
