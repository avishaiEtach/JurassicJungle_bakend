interface Dinosaur {
  name: string;
  description: string;
  continent: string;
  diet: "Carnivore" | "Piscivore" | "Herbivore";
  family: string;
  image: string;
  weight: number;
  time_on_earth: string;
  period: string;
  mainArticle: string;
  bodyLength: number;
  author?: string;
}

export { Dinosaur };
