import Mongoose from 'mongoose';

export let CompanySchema: Mongoose.Schema;
try {
  CompanySchema = Mongoose.model('Company').schema;
} catch (error) {
  CompanySchema = new Mongoose.Schema(
    {
      userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
        unique: true,
      },
      document: {
        type: String,
        required: true,
        unique: true,
      },
    },
    {
      collection: 'companies',
      timestamps: true,
    }
  );
}
