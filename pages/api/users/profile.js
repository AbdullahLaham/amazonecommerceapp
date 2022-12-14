import axios from 'axios';
import nc from 'next-connect';
import { isAuth, signToken } from '../../../utils/auth';
import config from '../../../utils/config';

const handler = nc();

handler.use(isAuth);
handler.put(async (req, res) => {
    const tokenWithWriteAccess = 'skEAloPNTcA6TAiIdFkI5vnCLmAfkNBf6waWx3t5fOtZnKMfVrGPXfQ2EkGYUV4ltI5Y6SSkx0FoYRgwAcbBENbyBXM3XDVUZZiOtyXPqBcU4c7OoLkY67ZohI5UA7t8EsdQ2i42L9N6bWBShAd4GNTtHDLSXs4qzsWGrVH3WTxDWjoEHSiL';
    const {name, email} = req.body;
  await axios.post(
    `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
    {
      mutations: [
        {
          patch: {
            id: req.user._id,
            set: {
                name: name,
                email: email,
              
            },
          },
        },
      ],
    },
    {
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );

  const user = {
    _id: req.user._id,
    name: req.body.name,
    email: req.body.email,
    isAdmin: req.user.isAdmin,

}
const token = signToken(user);
res.send({...user, token})
});



export default handler;