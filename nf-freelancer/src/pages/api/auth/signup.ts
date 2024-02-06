import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../services/database';
import bcrypt from 'bcrypt';
import { createDossie } from '@/utils/createDossie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const body = JSON.parse(JSON.stringify(req.body));

      const newUser = {
        name: body.userName,
        email: body.email,
        password: body.password,
      };

      const user = new User(newUser);

      const password = await bcrypt.hash(user.password, 10);

      user.password = password;

      await user.save();

      delete user.password;

      await createDossie({
        //@ts-ignore
        userId: user._id,
        action: 'signup',
        identfier: 'user',
      });

      user._id;

      return res.status(201).json(user);
    }

    return res
      .status(404)
      .json({ data: undefined, message: 'Rota inexistente' });
  } catch (error: any) {
    const body = JSON.parse(JSON.stringify(req.body));
    await User.deleteOne({ email: body.email });
    return res.status(500).json({ data: error, message: error.message });
  }
}
