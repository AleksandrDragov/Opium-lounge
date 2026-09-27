import './PageHero.scss';

type PageHeroProps = {
  kicker: string;
  title: string;
  accent: string;
  description: string;
};

export function PageHero({ kicker, title, accent, description }: PageHeroProps) {
  return (
    <header className="page-hero container">
      <p className="eyebrow"><span /> {kicker}</p>
      <h1>{title} <em>{accent}</em></h1>
      <p>{description}</p>
    </header>
  );
}
