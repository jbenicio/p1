import type { NextApiResponse } from 'next';
import { Company } from '../../../services/database';
import { authenticate } from '@/utils/apiAuth';
import { createDossie } from '@/utils/createDossie';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function handler(req: any, res: NextApiResponse) {
    try {
      if (req.method === 'GET') {
        const auth: any = authenticate(req);
        if (!auth) return res.status(401).json({ message: 'Unauthorized' });

        const query = JSON.parse(JSON.stringify(req.query));

        const result = await Company.find({
          userId: req.session.user._id,
          ...query,
        }).lean();

        return res.status(200).json(result);
      } else if (req.method === 'POST') {
        const auth: any = authenticate(req);
        if (!auth) return res.status(401).json({ message: 'Unauthorized' });

        const body = JSON.parse(JSON.stringify(req.body));

        const company = new Company({
          userId: req.session.user._id,
          ...body
        });

        await company.save();

        createDossie({
          userId: auth._id,
          action: 'new',
          identfier: 'company',
        });

        return res.status(201).json(company);
      } else if (req.method === 'PUT') {
        const auth = authenticate(req);
        if (!auth) return res.status(401).json({ message: 'Unauthorized' });

        const body = JSON.parse(JSON.stringify(req.body));

        const _id = body._id;
        delete body._id;
        delete body.updatedAt;
        delete body.createdAt;

        const { modifiedCount } = await Company.updateOne({ _id }, body).lean();

        await createDossie({
          userId: auth._id,
          action: 'update',
          identfier: 'company',
        });

        if (modifiedCount > 0) {
          const companyRes: any = await Company.findOne({ _id }).lean();
          return res.status(200).json(companyRes);
        } else return res.status(500);
      } else if (req.method === 'DELETE') {
        const auth: any = authenticate(req);
        if (!auth) return res.status(401).json({ message: 'Unauthorized' });

        const query = JSON.parse(JSON.stringify(req.query));

        const result = await Company.deleteOne({
          ...query,
        }).lean();

        return res.status(200).json(result);
      } else {
        return res.status(404);
      }
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ data: error, message: error.message });
    }
  },
  {
    cookieName: 'nf_freelancer_cookie',
    //@ts-ignore
    password: process.env.SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);
