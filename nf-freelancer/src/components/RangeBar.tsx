import { Center, Text } from '@chakra-ui/react';
import React from 'react';

const RangeBar = ({ amount, limit }: any) => {
  const percentage = (amount / limit * 100)
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  const redIntensity = normalizedPercentage / 100;
  const backgroundColor = `rgba(255, ${255 * (1 - redIntensity)}, 0, 0.4)`;

  return (
    <Center display={'block'} maxW={300} m={'auto'}>
      <Text textAlign={'center'}> Você atingiu {percentage.toLocaleString('pt-BR')}% do seu limite MEI de R${limit.toLocaleString('pt-BR')}, ainda restam R${(limit - amount).toLocaleString('pt-BR')}. </Text>
      <div
        style={{
          width: '100%',
          height: '20px',
          background: '#eee',
          marginTop: '10px',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${normalizedPercentage}%`,
            height: '100%',
            background: backgroundColor,
            borderRadius: 'inherit',
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </div>
    </Center>
  );
};

export default RangeBar;
