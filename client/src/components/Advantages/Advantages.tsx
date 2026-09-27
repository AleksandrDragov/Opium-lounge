import { useTranslation } from 'react-i18next';
import { MusicIcon, SmokeIcon, StarIcon } from '../Icons/Icons';
import './Advantages.scss';

const perks = [
  { icon: <SmokeIcon/>, number: '01', title: 'home.perk1Title', text: 'home.perk1Text' },
  { icon: <MusicIcon/>, number: '02', title: 'home.perk2Title', text: 'home.perk2Text' },
  { icon: <StarIcon/>, number: '03', title: 'home.perk3Title', text: 'home.perk3Text' },
];

export function Advantages() {
  const { t } = useTranslation();
  return (
    <section className="perks section">
      <div className="container"><p className="eyebrow"><span/> {t('home.whyOpium')}</p><div className="perks-grid">{perks.map((perk) => <article className="perk" key={perk.title}><div className="perk-top">{perk.icon}<span>{perk.number}</span></div><h3>{t(perk.title)}</h3><p>{t(perk.text)}</p></article>)}</div></div>
    </section>
  );
}
