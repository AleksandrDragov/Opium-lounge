import { Hero } from '../../components/Hero/Hero';
import { Marquee } from '../../components/Marquee/Marquee';
import { About } from '../../components/About/About';
import { Advantages } from '../../components/Advantages/Advantages';
import { VipRooms } from '../../components/VipRooms/VipRooms';
import { Gallery } from '../../components/Gallery/Gallery';
import { Contacts } from '../../components/Contacts/Contacts';
import './HomePage.scss';

export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Advantages />
      <VipRooms />
      <Gallery />
      <Contacts />
    </>
  );
}
