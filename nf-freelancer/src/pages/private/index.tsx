import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/contexts/app';
import Page from '@/components/Page';
import { AxiosInstance } from 'axios';
import { Center, Flex, Stack } from '@chakra-ui/react';
import { withIronSessionSsr } from 'iron-session/next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'moment/locale/pt-br';
import { getApiInstance } from '@/services/api';
import { getAmount, groupDataByMonth } from '@/utils/reports';
import FiltroAno from '@/components/YearFilter';
import moment from 'moment';
import RangeBar from '@/components/RangeBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    if (!('user' in req.session))
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    const user: any = req.session.user;
    return {
      props: {
        user,
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
export default function Panel({ user }: any) {
  const appContext = useContext(AppContext);
  const [expenses, setExpenses] = useState([]);
  const [nfs, setNfs] = useState([]);
  const [balanceData, setBalanceData] = useState([]);

  useEffect(() => {
    api = getApiInstance(user);
    getData();
  }, []);

  const getData = async (year = moment().format('YYYY')) => {
    try {
      const { data: expensesData } = await api.get(
        `/api/expenses?year=${year}`
      );
      const { data: nfsData } = await api.get(`/api/nfs?year=${year}`);

      setExpenses(groupDataByMonth(expensesData));
      setNfs(groupDataByMonth(nfsData));
      setBalanceData(groupDataByMonth(nfsData.concat(expensesData)));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      appContext.onCloseLoading();
    }
  };

  const balanceChartData = {
    labels: balanceData.map((e: any) => e.date),
    datasets: [
      {
        label: 'Balanço',
        data: balanceData.map((b: any) => b.value),
        backgroundColor: 'rgba(146, 99, 255, 0.2)',
        borderColor: '#6375ff',
        borderWidth: 1,
      },
    ],
  };

  const nfsChartData = {
    labels: nfs.map((e: any) => e.date),
    datasets: [
      {
        label: 'Balanço',
        data: nfs.map((b: any) => b.value),
        backgroundColor: 'rgba(99, 255, 187, 0.2)',
        borderColor: '#63ffb4',
        borderWidth: 1,
      },
    ],
  };

  const expensesChartData = {
    labels: expenses.map((e: any) => e.date),
    datasets: [
      {
        label: 'Balanço',
        data: expenses.map((b: any) => b.value),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Page
      user={user}
      path='/private'
      title='NF Freelancer - Painel Geral'
      description='Controle de financeiro para freelancers!'
    >
      <Center mt={5} mb={5}>
        <p> Ano </p>
        <FiltroAno
          onFiltrar={(e: number) =>
            //@ts-ignore
            getData(e)
          }
        />
      </Center>

      <RangeBar amount={getAmount(balanceData)} limit={user.limit} />

      <Flex
        justifyContent={'space-around'}
        alignItems={'center'}
        gap={10}
        wrap={'wrap'}
      >
        <Stack w={'100%'} maxW={'500px'}>
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: `Balanço despesas x NFs R$${getAmount(balanceData).toLocaleString('pt-BR')}`,
                },
              },
            }}
            data={balanceChartData}
          />
        </Stack>

        <Stack w={'100%'} maxW={'500px'}>
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: `NFs R$${getAmount(nfs).toLocaleString('pt-BR')}`,
                },
              },
            }}
            data={nfsChartData}
          />
        </Stack>

        <Stack w={'100%'} maxW={'500px'}>
          <Bar
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: `Despesas R$${getAmount(expenses).toLocaleString('pt-BR')}`,
                },
              },
            }}
            data={expensesChartData}
          />
        </Stack>
      </Flex>
    </Page>
  );
}
