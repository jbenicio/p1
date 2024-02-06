import Mongoose from 'mongoose';

export let ExpenseSchema: Mongoose.Schema;
try {
  ExpenseSchema = Mongoose.model('Expense').schema;
} catch (error) {
  ExpenseSchema = new Mongoose.Schema(
    {
      userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      categoryId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        required: true,
      },
      companyId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        index: true,
      },
      value: {
        type: Number,
        required: true,
      },
      name: {
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
    { collection: 'expenses', timestamps: true }
  );
}
