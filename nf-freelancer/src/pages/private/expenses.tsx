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
  DrawerHeader,
  DrawerBody,
  FormLabel,
  FormControl,
  Input,
  DrawerFooter,
  Button,
  Select,
  HStack,
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
import moment from 'moment';

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
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
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
      values.date = moment(values.date, 'YYYY-MM-DD')
      values.payDate = moment(values.payDate, 'YYYY-MM-DD')


      let res: any;

      if (isEditing) res = await api.put(`/api/expenses`, values);
      else res = await api.post(`/api/expenses`, values);

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
      categoryId: '',
      companyId: '',
      value: 0,
      name: '',
      date: moment().format('YYYY-MM-DD'),
      payDate: moment().format('YYYY-MM-DD'),
    },
    validationSchema: Yup.object().shape({
      categoryId: Yup.string().min(2).max(200).required(),
      companyId: Yup.string().min(2).max(50),
      value: Yup.number().required(),
      name: Yup.string().min(2).max(200).required(),
      date: Yup.string().required(),
      payDate: Yup.string().required(),
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
      const { data } = await api.get(`/api/expenses`);

      const { data: categories } = await api.get(`/api/categories?active=true`);
      const { data: companies } = await api.get(`/api/companies`);

      setCompanies(companies);
      setCategories(categories);
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
      const { data } = await api.delete(`/api/expenses?_id=${item._id}`);

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
      path='/expenses'
      title='NF Freelancer - Cadastro de despesas'
      description='Controle de financeiro para freelancers!'
    >
      <Stack h={'full'} m={5}>
        <Heading mb={5} fontSize={'2xl'} textAlign={'center'}>
          Cadastro de Despesas
        </Heading>
        <TableContainer shadow={'#cccccc4e 0px 0px 2px 1px'} rounded={20}>
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Valor</Th>
                <Th width={50}>Opções</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item: any) => (
                <Tr key={item._id}>
                  <Td>{item.name}</Td>
                  <Td>{item.value}</Td>
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
          <DrawerHeader borderBottomWidth='1px'>Despesas</DrawerHeader>
          <DrawerBody>
            <HStack>
              <FormControl
                mb={3}
                id='categoryId'
                isRequired
                isInvalid={
                  !!formik.errors.categoryId && formik.touched.categoryId
                }
              >
                <FormLabel fontSize={{ base: 'sm', md: 'md', lg: 'md' }}>
                  {' '}
                  Categoria{' '}
                </FormLabel>
                <Select
                  name='categoryId'
                  value={formik.values.categoryId}
                  onChange={(e: any) => {
                    formik.setFieldValue('categoryId', e.target.value);
                  }}
                  //@ts-ignore
                  closeMenuOnSelect={false}
                >
                  <option>Selecione um valor</option>
                  {categories.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                mb={3}
                id='companyId'
                isRequired
                isInvalid={
                  !!formik.errors.companyId && formik.touched.companyId
                }
              >
                <FormLabel fontSize={{ base: 'sm', md: 'md', lg: 'md' }}>
                  {' '}
                  Empresa{' '}
                </FormLabel>
                <Select
                  name='companyId'
                  value={formik.values.companyId}
                  onChange={(e: any) => {
                    formik.setFieldValue('companyId', e.target.value);
                  }}
                  //@ts-ignore
                  closeMenuOnSelect={false}
                >
                  <option>Selecione um valor</option>
                  {companies.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            <HStack>
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
                id='value'
                isRequired
                isInvalid={!!formik.errors.value && formik.touched.value}
              >
                <FormLabel fontSize={{ base: 'sm', md: 'md', lg: 'md' }}>
                  Valor
                </FormLabel>
                <Input
                  type='number'
                  name='value'
                  value={formik.values.value}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </HStack>

            <HStack>
              <FormControl
                mb={3}
                id='date'
                isRequired
                isInvalid={!moment(formik.values.date, 'YYYY-MM-DD').isValid()}
              >
                <FormLabel fontSize={{ base: 'sm', md: 'md', lg: 'md' }}>
                  Data da despesa
                </FormLabel>
                <Input
                  type='date'
                  name='date'
                  value={moment(formik.values.date, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                  onChange={formik.handleChange}
                />
              </FormControl>

              <FormControl
                mb={3}
                id='payDate'
                isRequired
                isInvalid={!moment(formik.values.payDate, 'YYYY-MM-DD').isValid()}
              >
                <FormLabel fontSize={{ base: 'sm', md: 'md', lg: 'md' }}>
                  Data da cobrança
                </FormLabel>
                <Input
                  type='date'
                  name='payDate'
                  value={moment(formik.values.payDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </HStack>
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
