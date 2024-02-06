import {
  Box,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useToast,
  IconButton,
  Stack,
  Heading,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  Switch,
  DrawerHeader,
  DrawerBody,
  FormLabel,
  FormControl,
  Input,
  DrawerFooter,
  Button,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/contexts/app';
import Page from '@/components/Page';
import { AxiosInstance } from 'axios';
import { getApiInstance } from '@/services/api';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
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
export default function Services({ user }: any) {
  const appContext = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState([]);
  const {
    isOpen: formIsOpen,
    onOpen: formOnOpen,
    onClose: formOnClose,
  } = useDisclosure();
  const toast = useToast();

  const onSubmit = async (values: any) => {
    try {
      appContext.onOpenLoading();

      let res: any;

      if (isEditing) res = await api.put(`/api/categories`, values);
      else res = await api.post(`/api/categories`, values);

      updateData(res.data);
      appContext.onCloseLoading();
      toast({
        title: 'Sucesso!',
        description: 'Os dados foram salvos!',
        status: 'success',
        position: 'top-right',
        duration: 9000,
        isClosable: true,
      });
      setIsEditing(false);
      formOnClose();
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
      name: '',
      description: '',
      active: true,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(2).max(50).required(),
      description: Yup.string().min(2).max(200).required(),
      active: Yup.boolean().required(),
    }),
    onSubmit: onSubmit,
  });

  useEffect(() => {
    api = getApiInstance(user);
    getData();
  }, []);

  const updateData = (item: any) => {
    const indice = data.findIndex((d: any) => d._id === item._id);
    if (indice > -1) {
      const newArray = [...data];
      //@ts-ignore
      newArray[indice] = item;
      setData(newArray);
    } else {
      //@ts-ignore
      setData((prevArray: any) => [...prevArray, item]);
    }
  };

  const getData = async () => {
    try {
      appContext.onOpenLoading();
      const { data } = await api.get(`/api/categories`);

      setData(data);

      appContext.onCloseLoading();
    } catch (error) {
      console.log(error);

      appContext.onCloseLoading();
    }
  };

  const handleDelete = async (item: any) => {
    try {
      appContext.onOpenLoading();
      const { data } = await api.delete(`/api/categories?_id=${item._id}`);

      setData((prevArray) => prevArray.filter((d: any) => d._id !== item._id));

      appContext.onCloseLoading();
    } catch (error) {
      console.log(error);
      appContext.onCloseLoading();
    }
  };

  return (
    <Page
      user={user}
      path='/categories'
      title='NF Freelancer - Cadastro de categorias'
      description='Controle de financeiro para freelancers!'
    >
      <Stack h={'full'} m={5}>
        <Heading mb={5} fontSize={'2xl'} textAlign={'center'}>
          Cadastro de Categorias
        </Heading>
        <TableContainer shadow={'#cccccc4e 0px 0px 2px 1px'} rounded={20}>
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Descrição</Th>
                <Th>Ativo</Th>
                <Th width={50}>Opções</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item: any) => (
                <Tr key={item._id}>
                  <Td>{item.name}</Td>
                  <Td>{item.description}</Td>
                  <Td>{item.active ? 'Sim' : 'Não'}</Td>
                  <Td>
                    <IconButton
                      size={'sm'}
                      icon={<EditIcon />}
                      colorScheme='blue'
                      aria-label='Editar'
                      mr={1}
                      onClick={() => {
                        formik.setValues(item);
                        setIsEditing(true);
                        formOnOpen();
                      }}
                    />
                    <DeleteConfirmationModal
                      onDelete={() => handleDelete(item)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Box position='fixed' bottom={'80px'} zIndex={1} right={4}>
          <IconButton
            colorScheme='blue'
            icon={<AddIcon />}
            isRound
            size='lg'
            aria-label='Adicionar'
            onClick={() => {
              formik.resetForm();
              setIsEditing(false);
              formOnOpen();
            }}
          />
        </Box>
      </Stack>

      <Drawer
        isOpen={formIsOpen}
        placement='right'
        size={'xl'}
        onClose={() => 1}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Categoria</DrawerHeader>

          <DrawerBody>
            <FormControl
              mb={3}
              id='name'
              isRequired
              isInvalid={!!formik.errors.name && formik.touched.name}
            >
              <FormLabel fontSize={{ base: 'sm', md: 'md', lg: 'md' }}>
                Nome
              </FormLabel>
              <Input
                type='text'
                name='name'
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl
              mb={3}
              id='description'
              isRequired
              isInvalid={
                !!formik.errors.description && formik.touched.description
              }
            >
              <FormLabel fontSize={{ base: 'sm', md: 'md', lg: 'md' }}>
                Descrição
              </FormLabel>
              <Input
                type='text'
                name='description'
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl
              display='flex'
              alignItems='center'
              mb={3}
              id='active'
              isRequired
              isInvalid={!!formik.errors.active && formik.touched.active}
            >
              <FormLabel htmlFor='active' mb='0'>
                Ativo? {formik.values.active}
              </FormLabel>
              <Switch
                id='active'
                isChecked={formik.values.active}
                onChange={formik.handleChange}
              />
            </FormControl>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button
              variant='outline'
              mr={3}
              onClick={() => {
                setIsEditing(false);
                formOnClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              colorScheme='blue'
              //@ts-ignore
              onClick={formik.handleSubmit}
            >
              Salvar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Page>
  );
}
