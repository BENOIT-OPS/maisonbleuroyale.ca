/** 100 avis courts et credibles (donnees de demonstration). */
const prenoms = [
  "Marie",
  "Sophie",
  "Julien",
  "Emilie",
  "Marc",
  "Catherine",
  "Nicolas",
  "Anne",
  "Philippe",
  "Isabelle",
  "David",
  "Karine",
  "Simon",
  "Valerie",
  "Antoine",
  "Julie",
  "Etienne",
  "Melanie",
  "Francois",
  "Lucie",
] as const;

const villes = [
  "Montreal",
  "Quebec",
  "Ottawa",
  "Laval",
  "Gatineau",
  "Trois-Rivieres",
  "Sherbrooke",
  "Levis",
  "Longueuil",
  "Saguenay",
] as const;

const phrases = [
  "Une equipe a l'ecoute, zero pression.",
  "Notre bouledogue est calme et en pleine sante.",
  "Transparence du premier e-mail a la remise.",
  "Nous recommandons sans hesiter.",
  "Suivi apres adoption vraiment present.",
  "Elevage propre, chiots bien socialises.",
  "Contrat clair, conseils precieux.",
  "Reponse rapide et humaine a nos questions.",
  "Notre famille est comblee.",
  "Professionnalisme et douceur rares.",
  "Visite accueillante, chiots heureux.",
  "Photos regulieres pendant la croissance.",
  "On se sent en confiance totale.",
  "Caractere du chiot decrit avec honnetete.",
  "Deux ans apres, ils repondent encore a nos questions.",
];

function initial(seed: number): string {
  return String.fromCharCode(65 + (seed % 26));
}

export type AvisClient = { quote: string; name: string; meta: string };

export const avisClients100: AvisClient[] = Array.from({ length: 100 }, (_, i) => {
  const prenom = prenoms[i % prenoms.length];
  const ville = villes[Math.floor(i / 10) % villes.length];
  const phrase = phrases[i % phrases.length];
  const variante = i % 7 === 0 ? " Merci pour tout." : "";
  const annee = 2023 + (i % 4);
  return {
    quote: `${phrase}${variante}`,
    name: `${prenom} ${initial(i)}.`,
    meta: `${ville}, ${annee}`,
  };
});
