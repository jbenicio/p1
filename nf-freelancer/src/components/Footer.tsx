import {
  Box,
  chakra,
  Container,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import Logo from '@/components/Logo';
import { useRouter } from 'next/router';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      _hover={{ filter: 'brightness(110%)' }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function SmallWithLogoLeft() {
  const router = useRouter();
  return (
    <Box
      zIndex={0}
      w='full'
      position={'absolute'}
      bottom={0}
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Flex
          alignItems={'center'}
          cursor={'pointer'}
          onClick={() => router.push('/')}
        >
          <Logo color={'dark'} height={32} />
        </Flex>
        <Text>© 2024 NF Freelancer. By Álvaro Ferreira. </Text>
      </Container>
    </Box>
  );
}
