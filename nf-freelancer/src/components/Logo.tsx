import FluencyWhite from '@/public/logo.svg';
import FluencyBLue from '@/public/logo.svg';
import Image, { StaticImageData } from 'next/image';

export default function Logo(props: any) {
  return (
    <Image
      src={
        props.color === 'dark' ? FluencyBLue : (FluencyWhite as StaticImageData)
      }
      alt={'Logo'}
      {...props}
    ></Image>
  );
}
