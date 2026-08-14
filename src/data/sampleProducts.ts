export interface SampleProduct {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  baseColor: string;
  badgeColor: string;
  thumbnailUrl: string;
  description: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: "banarasi-rani-pink",
    name: "Rani Pink Banarasi Silk Suit Material",
    subtitle: "Unstitched suit with 24K Gold Zari Jaal & Emerald Resham Border",
    category: "Unstitched Salwar Suit",
    baseColor: "#E0115F",
    badgeColor: "bg-pink-600 text-white",
    thumbnailUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    description: "Rich magenta-pink pure katan banarasi silk fabric featuring heavy golden zari kadhwa floral weave on the yoke, paired with an organza tissue dupatta with hand-tied tassels."
  },
  {
    id: "peacock-blue-georgette",
    name: "Peacock Blue Georgette Anarkali Set",
    subtitle: "Real Mirror (Shisha) Work with Silver Gota Patti & Scalloped Dupatta",
    category: "Dress Material",
    baseColor: "#0A4D68",
    badgeColor: "bg-cyan-700 text-white",
    thumbnailUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    description: "Deep peacock teal-blue pure 60g georgette fabric embellished with reflective circular mirror work, fine resham thread motifs, and a fluid 2.5m chiffon dupatta."
  },
  {
    id: "chanderi-mint-saree",
    name: "Mint Green Chanderi Silk Saree Fabric",
    subtitle: "Handwoven Tissue Weave with Antique Kalka Paisley Pallu",
    category: "Handloom Saree Fabric",
    baseColor: "#98D8AA",
    badgeColor: "bg-emerald-700 text-white",
    thumbnailUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    description: "Delicate pastel mint green chanderi silk-cotton handloom textile with translucent texture, woven gold zari borders featuring traditional ambi/paisley motifs."
  },
  {
    id: "mustard-organza-lehenga",
    name: "Mustard Haldi Organza Lehenga Fabric",
    subtitle: "Multi-color Floral Resham Embroidery with Scallop Cutwork",
    category: "Lehenga Material",
    baseColor: "#E5A93C",
    badgeColor: "bg-amber-600 text-white",
    thumbnailUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    description: "Vibrant festive mustard yellow organza fabric with intricate Kashmiri-inspired floral vine resham embroidery, micro sequins, and matching santoon lining fabric."
  }
];
