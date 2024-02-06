import Mongoose from 'mongoose';

import { UserSchema } from './schemas/user';
import { DossieSchema } from './schemas/dossie';
import { CompanySchema } from './schemas/company';
import { CategorySchema } from './schemas/category';
import { ExpenseSchema } from './schemas/expense';
import { NFSchema } from './schemas/nf';


if (!process.env.MONGOOSE_URI) {
  console.log('erro');
  throw new Error('Invalid environment variable: "MONGOOSE_URI"');
}

Mongoose.Promise = global.Promise;

const databaseUrl = process.env.MONGOOSE_URI;

const connectToDatabase = async (): Promise<void> => {
  await Mongoose.connect(databaseUrl, {});
};

connectToDatabase();

export const User = Mongoose.model('User', UserSchema);
export const Dossie = Mongoose.model('Dossie', DossieSchema);
export const Company = Mongoose.model('Company', CompanySchema);
export const Category = Mongoose.model('Category', CategorySchema);
export const Expense = Mongoose.model('Expense', ExpenseSchema);
export const NF = Mongoose.model('NF', NFSchema);
