import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Link,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { getApiInstance } from '@/services/api';
import { AppContext } from '@/contexts/app';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import Page from '@/components/Page';
import { withIronSessionSsr } from 'iron-session/next';

export const getServerSideProps = withIronSessionSsr(
  ({ req }) => {

    if (('user' in req.session))
      return {
        redirect: {
          destination: '/private',
          permanent: false,
        },
      };
    else
      return {
        props: {
          user: null,
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

type IForm = {
  email: string;
  password: string;
};

export default function SignIn() {
  const toast = useToast();
  const appContext = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const api = getApiInstance();
  const router = useRouter();

  useEffect(() => {
    appContext.onCloseLoading();
  }, []);

  const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Password must contain at least 8 characters!')
      .required('Required'),
  });

  const onSubmit = async (values: IForm) => {
    try {
      appContext.onOpenLoading();

      const credentials = {
        email: values.email,
        password: values.password,
      };

      const { data } = await api.post('/api/auth/signin', credentials);

      toast({
        title: 'Sucesso',
        description: 'Seja bem vindo!',
        status: 'success',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      router.push('private');
    } catch (error: any) {
      const errorMessage = error.response.data || 'Erro desconhecido';
      toast({
        title: 'Não foi possível entrar.',
        description: errorMessage,
        status: 'error',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      appContext.onCloseLoading();
    }
  };

  return (
    <Page
      path='/signin'
      title='NF Freelancer - Login'
      description='Controle financeiro para freelancer!'
    >
      <Flex
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Formik
          initialValues={{
            email: '',
            password: '',
            rememberMe: false,
          }}
          validationSchema={SigninSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                  <Heading fontSize={'4xl'}>Entrar</Heading>
                  <Text fontSize={'lg'} color={'gray.600'}></Text>
                </Stack>

                <Box
                  rounded={'lg'}
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  p={8}
                >
                  <Stack spacing={4}>
                    <FormControl
                      id='email'
                      isInvalid={!!errors.email && touched.email}
                    >
                      <FormLabel fontSize={{ base: "sm", md: "md", lg: "md" }}>Email</FormLabel>
                      <Field as={Input} name='email' />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      id='password'
                      isInvalid={!!errors.password && touched.password}
                    >
                      <FormLabel fontSize={{ base: "sm", md: "md", lg: "md" }}>Senha</FormLabel>
                      <InputGroup>
                        <Field
                          as={Input}
                          name='password'
                          type={showPassword ? 'text' : 'password'}
                        />
                        <InputRightElement h={'full'}>
                          <Button
                            variant={'ghost'}
                            onClick={() =>
                              setShowPassword((showPassword) => !showPassword)
                            }
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <Stack spacing={10}>
                      <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                        justify={'space-between'}
                      >
                        <FormControl width={150}>
                          {/* <Checkbox name={"rememberMe"}>Mantenha-me conectado</Checkbox> */}
                        </FormControl>
                      </Stack>
                      <Button
                        color={useColorModeValue('#fff', '#fff')}
                        bg={useColorModeValue('#ffc03f', '#ffc03f')}
                        _hover={{ filter: 'brightness(110%)' }}
                        type={'submit'}
                      >
                        Entrar
                      </Button>
                      <Stack>
                        <Text align={'center'}>
                          Não tem uma conta?{' '}
                          <Link as={NextLink} href='./signup' color={'#ffc03f'}>
                            Cadastre-se
                          </Link>
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </Flex>
    </Page>
  );
}
