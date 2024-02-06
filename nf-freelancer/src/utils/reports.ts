import moment from 'moment';

export const groupDataByMonth = (data: any) => {
  const groupedData = data.reduce((acc: any, item: any) => {
    const month = moment(item.date, 'YYYY-MM-DD').format('MMMM');
    const year = moment(item.date, 'YYYY-MM-DD').format('YYYY');
    const key = `${year}-${month}`;

    const existingItem = acc.find((group: any) => group.date === key);

    if ('number' in item) {
      item.type = 'nf';
    } else {
      item.type = 'expenses';
      item.value = item.value * -1;
    }

    if (existingItem) {
      existingItem.value += item.value;
    } else {
      acc.push({ date: key, value: item.value });
    }
    return acc;
  }, []);

  const sortedData = groupedData.sort(
    (a: any, b: any) =>
      //@ts-ignore
      moment(a.date, 'YYYY-MMMM').toDate() -
      //@ts-ignore
      moment(b.date, 'YYYY-MMMM').toDate()
  );

  return sortedData.map((item: any) => ({
    date: item.date,
    value: item.value,
  }));
};

export const getAmount = (data: any) => {
  let amount = 0;

  data.forEach((el: any) => {
    amount += el.value;
  });

  return amount;
};
