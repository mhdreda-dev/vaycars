export type Vehicle = {
  id: string; slug: string; brand: string; model: string; category: string;
  fuel: string; transmission: string; seats: number; doors: number; luggage: number;
  airConditioning: boolean; images: string[]; availability: "Disponible" | "Sur demande";
  featured: boolean; badge?: string; shortDescription: string; fullDescription: string;
  active: boolean; displayOrder: number;
};

const carImage = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

export const vehicles: Vehicle[] = [
  ["dacia-logan","Dacia","Logan","Berline","Diesel","Manuelle",5,"Disponible",true,"Populaire","Un choix fiable et spacieux pour tous vos trajets.","La Dacia Logan allie confort, espace et simplicité pour vos déplacements au Maroc.","photo-1549317661-bd32c8ce0db2"],
  ["dacia-sandero","Dacia","Sandero","Citadine","Essence","Manuelle",5,"Disponible",true,"Économique","Compacte et agile, idéale pour la ville.","Une citadine pratique, propre et agréable à conduire au quotidien.","photo-1503376780353-7e6692767b70"],
  ["dacia-duster","Dacia","Duster","SUV","Diesel","Manuelle",5,"Sur demande",true,"SUV","De l’espace pour explorer en toute sérénité.","Le Duster convient aux familles et aux escapades sur les routes marocaines.","photo-1533473359331-0135ef1b58bf"],
  ["renault-clio","Renault","Clio","Citadine","Diesel","Manuelle",5,"Disponible",true,"","Une voiture polyvalente et agréable.","La Renault Clio est une valeur sûre pour circuler facilement et confortablement.","photo-1492144534655-ae79c964c9d7"],
  ["renault-megane","Renault","Mégane","Berline","Diesel","Manuelle",5,"Sur demande",false,"","Confort et élégance pour vos longs trajets.","Une berline équilibrée offrant une conduite souple et un bel espace intérieur.","photo-1552519507-da3b142c6e3d"],
  ["peugeot-208","Peugeot","208","Citadine","Essence","Automatique",5,"Disponible",true,"Automatique","Moderne, maniable et bien équipée.","La Peugeot 208 facilite vos déplacements avec un format urbain et soigné.","photo-1609521263047-f8f205293f24"],
  ["peugeot-301","Peugeot","301","Berline","Diesel","Manuelle",5,"Disponible",false,"","Une berline pratique pour voyager sereinement.","La 301 offre un coffre généreux et le confort essentiel pour prendre la route.","photo-1504215680853-026ed2a45def"],
  ["opel-corsa","Opel","Corsa","Citadine","Essence","Manuelle",5,"Sur demande",false,"","Une solution simple pour vos trajets du quotidien.","Une citadine à la prise en main naturelle, parfaite pour Sidi Kacem et ses environs.","photo-1542282088-72c9c27ed0cd"],
  ["opel-astra","Opel","Astra","Berline","Diesel","Automatique",5,"Sur demande",false,"","Un équilibre entre espace et confort.","L’Opel Astra convient aux voyageurs qui souhaitent davantage de confort sur route.","photo-1511919884226-fd3cad34687c"],
  ["citroen-c3","Citroën","C3","Citadine","Essence","Manuelle",5,"Disponible",false,"","Compacte, confortable et facile à vivre.","Un choix souple et convivial pour les déplacements personnels ou professionnels.","photo-1530046339160-ce3e530c7d2f"],
  ["fiat-tipo","Fiat","Tipo","Berline","Diesel","Manuelle",5,"Sur demande",false,"","Une berline fonctionnelle pour tous les itinéraires.","La Fiat Tipo propose l’espace et le confort nécessaires aux séjours et aux trajets en famille.","photo-1462396881884-de2c07cb95ed"],
].map(([slug, brand, model, category, fuel, transmission, seats, availability, featured, badge, shortDescription, fullDescription, image], index) => ({
  id: `car-${index + 1}`, slug: slug as string, brand: brand as string, model: model as string, category: category as string, fuel: fuel as string, transmission: transmission as string, seats: seats as number, doors: 5, luggage: 2, airConditioning: true, images: [carImage(image as string)], availability: availability as Vehicle["availability"], featured: featured as boolean, badge: badge as string || undefined, shortDescription: shortDescription as string, fullDescription: fullDescription as string, active: true, displayOrder: index + 1,
}));

export const getVehicleBySlug = (slug: string) => vehicles.find((vehicle) => vehicle.slug === slug);
