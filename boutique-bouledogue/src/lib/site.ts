export const siteConfig = {
  name: "Maison Bleu Royale",
  description:
    "Elevage premium de bouledogues francais au Canada. Chiots suivis veterinairement, lignées selectes et accompagnement familial complet.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "bleuroyale@maisonbleuroyale.ca",
  /** Numero WhatsApp (chiffres, ex. 15815551234) pour le bouton wa.me */
  whatsappPhone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "",
  locale: "fr_CA",
  socialImage: "/og-image.jpg",
};

/** Liens principaux (labels via next-intl, clés `nav.*`). */
export const mainNavLinks = [
  { href: "/", navKey: "home" as const },
  { href: "/chiots", navKey: "puppiesAvailable" as const },
  { href: "/reproducteurs", navKey: "breeders" as const },
  { href: "/a-propos", navKey: "about" as const },
  { href: "/blog", navKey: "blogTips" as const },
  { href: "/#contact", navKey: "contact" as const },
];

/** Pied de page — clés `footer.*`. */
export const footerInfoLinks = [
  { href: "/a-propos", key: "infoAboutUs" as const },
  { href: "/conditions-de-vente", key: "infoTerms" as const },
  { href: "/livraison", key: "infoDelivery" as const },
  { href: "/faq", key: "infoFaq" as const },
  { href: "/reservation-acompte", key: "infoReservationDeposit" as const },
] as const;

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Paragraphes séparés par une ligne vide (\\n\\n). */
  content: string;
  publishedAt: string;
  category?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "bien-preparer-l-arrivee-d-un-bouledogue",
    category: "Élevage",
    title: "Bien préparer l'arrivée d'un bouledogue français",
    excerpt:
      "Checklist d'éleveur et de comportementaliste pour accueillir votre chiot sans stress ni imprévus.",
    content: `Le bouledogue français est sensible au changement d'environnement. Anticipez une pièce calme, sans courants d'air, avec une cage ou un parc ouvert au début pour sécuriser les explorations.

Préparez gamelle, eau fraîche, couchage non glissant, jouets auditifs doux et une laisse harnais adaptée dès les sorties courtes. Évitez les escaliers, la surchauffe et les contacts intempestifs avec d'autres chiens avant la fin du protocole vaccinal recommandé par votre vétérinaire.

Planifiez une visite d'intégration sous dix jours : bilan poids, écoute cardiaque et buccale, rappel sur l'alimentation transitionnelle et la prévention des problèmes respiratoires légers.

Ces repères complètent, sans les remplacer, l'avis de votre clinique vétérinaire et du spécialiste que vous aurez choisi pour votre compagnon.`,
    publishedAt: "2026-03-01",
  },
  {
    slug: "nutrition-saine-chiot-bouledogue",
    category: "Nutrition",
    title: "Nutrition saine pour un chiot bouledogue",
    excerpt:
      "Croissance, portions, hydratation et transitions d'aliments selon les standards d'élevage responsable.",
    content: `Choisissez une formule « chiot petite race » équilibrée (AP, énergie, minéraux) plutôt que des excès caloriques. Mesurez chaque ration : le bouledogue gagne facilement en surpoids, ce qui aggrave la charge respiratoire et articulaire.

Fractionnez en trois à quatre repas jusqu'à six mois, puis adaptez avec votre vétérinaire. L'eau doit être proposée en continu ; évitez les friandises riches en sucre ou en gras.

Toute transition alimentaire se fait sur sept à dix jours en mélangeant progressivement la nouvelle croquette. Signalez diarrhée prolongée ou vomit : déshydratation chez le jeune chiot est une urgence relative.

En cas de doute sur la courbe de croissance (courbes publiées pour la race ou avis médical), un bilan pondéral en clinique reste la référence.`,
    publishedAt: "2026-02-15",
  },
  {
    slug: "chaleur-brisme-et-exercice-intelligent",
    category: "Santé",
    title: "Chaleur, brachycephalie et exercice intelligent",
    excerpt:
      "Comprendre la thermorégulation et le BOAS pour protéger votre bouledogue en toute saison.",
    content: `Les races brachycéphales perdent moins efficacement la chaleur par la respiration. Au Québec comme ailleurs, les pics estivaux et l'humidité exigent des sorties tôt le matin ou le soir, eau, ombre et repos obligatoire.

Signes d'effort excessif : halètement discret qui ne se calme pas, gencives pâles ou bleutées, refus de marcher, crachats excessifs. Dans ces cas, stoppez l'effort : rafraîchissement doux (pas de choc thermique) et consultation vétérinaire si le doute persiste.

Les sténoses narinaires ou un palais trop long aggravent la situation : seul un diagnostic clinique permet de discuter chirurgie corrective ou conduite à tenir. Ne courez pas après les mèmes standards d'activité qu'un chien « long museau ».

Les conseils ci-dessus s'appuient sur la littérature vétérinaire interne ; ils ne remplacent pas un examen personnalisé.`,
    publishedAt: "2026-02-28",
  },
  {
    slug: "soin-des-plis-cutanes-et-yeux",
    category: "Soins",
    title: "Soin des plis cutanés, yeux et coussinets au quotidien",
    excerpt:
      "Routine d'hygiène douce pour limiter dermatites, conjonctivites récidivantes et gerçures.",
    content: `Les sillons du museau retiennent humidité et débris. Nettoyez avec une solution recommandée par votre vétérinaire (eau stérile, lingettes hypoallergéniques ou produit antiseptique adapté), puis séchez sans frotter agressivement.

Les yeux proéminents exposent aux poussières et ulcères. Tout larmoiement jaunâtre, tenace clignement ou opacité impose un contrôle sans délai. Ne traitez pas à l'antibiotique sans prescription.

Humidifiez les coussinets en hiver (baume vétérinaire) après les trottoirs salés. Entre deux bains complets, privilégiez brossage et zones locales : sur-laver fragilise la barrière cutanée.

Adaptez la fréquence au terrain de votre chien : allergies, dermatites ou antécédents ? Demandez un protocole écrit à votre clinique.`,
    publishedAt: "2026-01-30",
  },
  {
    slug: "socialisation-cles-8-a-16-semaines",
    category: "Comportement",
    title: "Socialisation : fenêtre 8–16 semaines sans la précipitation",
    excerpt:
      "Expositions positives, seuils de stress et collaboration avec l'équipe soignante.",
    content: `La socialisation n'est pas « tout voir vite » : il s'agit d'associer chaque nouveauté à des émotions positives. Sons ménagers, sols glissants, manipulation des pattes et rencontres calmes avec humains bienveillants préparent un adulte équilibré.

Respectez la fenêtre d'immunisation : les parcs à chiens publics et contacts incontrôlés attendent la validation vétérinaire. En attendant, promenades portées, visites contrôlées et ateliers d'éveil encadré restent possibles.

Surveillez le langage corporel : oreilles basses, grattage, bâillements fréquents peuvent signaler un dépassement du seuil de tolérance. Réduisez l'intensité plutôt que de forcer.

Un éducateur canin certifié peut compléter votre travail ; la cohérence des signalants entre tous les membres du foyer reste le facteur le plus prédictif de réussite.`,
    publishedAt: "2026-01-18",
  },
  {
    slug: "caisse-et-transport-habituation-positive",
    category: "Bien-être",
    title: "Caisse de transport : habituation positive et sécurité routière",
    excerpt:
      "Dénucleariser la cage, sécurisation véhicule et usage en clinique ou en urgence.",
    content: `La caisse n'est ni punition ni rangement : c'est un refuge si l'introduction est progressive. Affamé léger, friandises jetées au fond, porte ouverte au début, puis fermetures courtes prolongées au fil des jours.

En voiture, attachez la caisse (ISO FIX, sangle ou plancher antidérapant selon le véhicule). Un chien libre devient un projectile en cas de choc ; les textes de sécurité routière convergent sur l'immobilisation.

Continuez l'entretien une fois l'adolescence passée — les rappels occasionnels évitent la régression avant voyages ou hospitalisations.

Si la phobie est déjà installée (salivation, destructions), faites appel à un comportementaliste avant d'intensifier les expositions.`,
    publishedAt: "2025-12-10",
  },
  {
    slug: "courbe-de-poids-et-prevention-obesite",
    category: "Nutrition",
    title: "Courbe de poids et prévention de l'obésité chez la petite race",
    excerpt:
      "Pesées, condition corporelle et ajustements avec votre clinique pour préserver le dos et les voies respiratoires.",
    content: `Pesez au moins une fois par mois jusqu'à l'âge adulte et notez sur un carnet ou une appli. Une courbe qui s'infléchit trop vite peut annoncer croissance osseuse inégale ; une stagnation prolongée mérite aussi un avis.

Évaluez la condition corporelle : côtes palpables sans excès de graisse, taille visible en vue de dessus, abdomen remonté côté profil. Les échelles 1–9 sont standardisées — demandez à votre équipe de vous montrer une fois sur votre chien.

Préférez l'activité fractionnée (jeux, parcours d'agilité bas) aux longues sessions forcées. L'obésité majore les risques sous anesthésie et complique la prise en charge du BOAS.

Les objectifs chiffrés (grammes cibles) doivent être fixés avec un vétérinaire qui connaît le chiot ; les moyennes Internet restent indicatives.`,
    publishedAt: "2025-11-22",
  },
  {
    slug: "choisir-son-eleveur-criteres-transparence",
    category: "Élevage",
    title: "Choisir son éleveur : critères de transparence et de santé",
    excerpt:
      "Questions à poser, documents à demander et signaux d'alerte avant tout dépôt.",
    content: `Un éleveur sérieux documente les tests de santé des parents (cardiaques, ophtalmologiques, dépistages pertinents à la race), le suivi vétérinaire des portées et un contrat clair (retours, décès néonatal, garanties limitées dans le cadre légal).

Visites : vous devez voir la mère ou des informations vérifiables sur son environnement. Refus systématique de tout contact avant dépôt, pression commerciale ou multiples races « à la carte » sans équipe dédiée méritent prudence.

Demandez le carnet vaccinal, l'identification, l'âge réel au départ (huit semaines minimum au Québec pour la séparation précoce interdite par la réglementation applicable) et les conseils d'alimentation fournis par écrit.

Ce guide vise les familles acheteuses ; il reflète les bonnes pratiques transmises par les ordres professionnels vétérinaires et associations d'éleveurs reconnus.`,
    publishedAt: "2025-10-08",
  },
  {
    slug: "urgences-symptomes-ne-pas-ignorer",
    category: "Santé",
    title: "Urgences : symptômes à ne pas banaliser chez le bouledogue",
    excerpt:
      "Quand appeler la clinique ou les urgences vétérinaires : dyspnée, vomissements, collapsus.",
    content: `Une aggravation respiratoire soudaine, les lèvres bleutées ou un chien qui refuse de se coucher tout en haletant relève de l'urgence. Mieux vaut un faux alarmisme qu'un retard aux soins intensifs.

Vomissements répétés, abdomen douloureux ou distendu, déficit neurologique, convulsions, méléna ou sang frais dans les selles : contactez immédiatement une structure ouverte ou les urgences de votre région.

Apportez toujours le nom des médicaments, l'heure du dernier repas et un historique de voyage ou de contact avec toxiques (antigel, chocolat, xylène canin).

Ce rappel ne constitue pas un protocole médical ; gardez en permanence les coordonnées de votre clinique et d'une clinique de garde.`,
    publishedAt: "2025-09-14",
  },
  {
    slug: "dentition-et-hygiene-buccale",
    category: "Soins",
    title: "Dentition du chiot à l'adulte : hygiène buccale raisonnée",
    excerpt:
      "Perte des dents de lait, tartre précoce et brossage sans traumatiser.",
    content: `Entre trois et six mois, irritabilité modérée et saignements discrets peuvent accompagner la permutation dentaire. Proposez jouets souples refroidis, évitez les choc contre les murs en jeu brutal.

Apprenez le brossage au doigt ou brosse adaptée dès le calme habituel ; viser trois séances brèves par semaine suffit au début. Les abrasifs trop agressifs blessent les gencives.

Le tartre sur mol décisive impose détartrage sous anesthésie générale après bilan cardiaque et discussion des risques — incontournable chez nombre de brachycéphales.

Programmez une première bouche « de contrôle » avec votre vétérinaire vers six à douze mois selon l'état observé à la maison.`,
    publishedAt: "2025-08-30",
  },
];
