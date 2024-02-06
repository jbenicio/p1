import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useColorModeValue,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AppContext } from '@/contexts/app';
import Page from '@/components/Page';
import { AxiosInstance } from 'axios';
import { getApiInstance } from '@/services/api';
import { useRouter } from 'next/router';
import { withIronSessionSsr } from 'iron-session/next';

export const getServerSideProps = withIronSessionSsr(
  async ({ req, res }) => {
    if (!('user' in req.session))
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };

    const user = req.session.user;
    return {
      props: {
        user: user,
      },
    };
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

let api: AxiosInstance;
export default function Company({ user }: any) {
  const appContext = useContext(AppContext);
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (values: any) => {
    try {
      appContext.onOpenLoading();
      const { data } = await api.put(`/api/users`, values);
      appContext.onCloseLoading();
      router.push('/private');
      toast({
        title: 'Sucesso!',
        description: 'Os dados da sua empresa foram alterados!',
        status: 'success',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Houve um erro',
        description: error.Message,
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      appContext.onCloseLoading();
    }
  };

  const formik = useFormik({
    initialValues: {
      limit: 81000,
    },
    validationSchema: Yup.object().shape({
      limit: Yup.number().min(80000).max(200000).required(),
    }),
    onSubmit: onSubmit,
  });

  useEffect(() => {
    api = getApiInstance(user);
    getData();
    appContext.onCloseLoading();
  }, []);

  const getData = async () => {
    try {
      console.log(user);
      const { data } = await api.get(`/api/users?_id=${user._id}`);
      if (data.length > 0) {
        formik.setValues(data[0]);
        appContext.onCloseLoading();
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      appContext.onCloseLoading();
    }
  };

  return (
    <Page
      user={user}
      path='/private/company'
      title='NF Freelancer - Suas preferencias'
      description='Controle de financeiro para freelancers!'
    >
      <form onSubmit={formik.handleSubmit}>
        <Box p={4} maxWidth='700px' mx='auto'>
          <Heading mb={5} fontSize={'2xl'} textAlign={'center'}>
            Suas preferencias
          </Heading>

          <VStack spacing={4} align='stretch'>
            <HStack>
              <FormControl
                id='limit'
                isRequired
                isInvalid={!!formik.errors.limit && formik.touched.limit}
              >
                <FormLabel>Limite MEI</FormLabel>
                <Input
                  type='number'
                  name='limit'
                  value={formik.values.limit}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </HStack>

            <Button
              color={useColorModeValue('#fff', '#fff')}
              bg={useColorModeValue('#ffc03f', '#ffc03f')}
              _hover={{ filter: 'brightness(110%)' }}
              type={'submit'}
            >
              Salvar
            </Button>
          </VStack>
        </Box>
      </form>
    </Page>
  );
}
