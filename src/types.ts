export interface ColorSwatch {
  name: string;
  hex: string;
  type: 'base' | 'secondary' | 'accent' | 'zari';
  description: string;
}

export interface MotifItem {
  name: string;
  category: string; // e.g., 'Traditional Indian', 'Floral', 'Geometrical', 'Fauna'
  placement: string; // e.g., 'Neckline yoke', 'Daman border', 'Overall body butis'
  technique: string; // e.g., 'Gold Zari Grid Weave', 'Gota Patti Work', 'Resham Threadwork'
}

export interface AccompanyingElement {
  component: string; // e.g., 'Dupatta', 'Bottom Fabric', 'Lace Border', 'Latkans / Tassels'
  fabricType: string;
  details: string;
}

export interface CatalogPrompt {
  id: 'shot1_hero' | 'shot2_model' | 'shot3_macro' | 'shot4_lifestyle';
  title: string;
  shotType: string;
  prompt: string;
  negativePrompt: string;
  cameraSettings: string;
  lightingSetup: string;
  backgroundDescription: string;
  aspectRatioRecommendation: string;
  midjourneyFlags: string;
  platformComplianceNotes: string;
  previewImageUrl?: string;
  isGeneratingPreview?: boolean;
}

export interface ProductListingSpec {
  skuSuggested: string;
  marketplaceTitle: string;
  topFabric: string;
  topLength: string;
  bottomFabric: string;
  bottomLength: string;
  dupattaFabric: string;
  dupattaLength: string;
  innerLining: string;
  workType: string;
  patternPrint: string;
  stitchType: string;
  neckStyle: string;
  sleeveLength: string;
  colorFamily: string;
  occasion: string;
  washCare: string;
  packageContents: string;
  countryOfOrigin: string;
  hsnCode: string;
  gstRate: string;
  priceRangeSuggestion: string;
  bulletPoints: string[];
  backendKeywords: string[];
  productDescriptionHtml: string;
}

export interface CatalogAnalysisResult {
  productTitle: string;
  category: string; // e.g., 'Unstitched Salwar Suit Material', 'Banarasi Silk Saree', 'Organza Dupatta Set'
  recommendedSilhouette: string; // e.g., 'Straight-cut Kurta with Straight Pants and Dupatta'
  targetOccasions: string[]; // e.g., ['Festive Diwali', 'Wedding Sangeet', 'Puja Ceremonies']
  
  colorPalette: {
    primaryBase: ColorSwatch;
    secondaryColors: ColorSwatch[];
    zariMetallic: ColorSwatch | null;
  };
  
  fabricDetails: {
    primaryFabric: string; // e.g., 'Pure Organza Silk'
    finishAndSheen: string; // e.g., 'Semi-sheer with soft lustrous metallic sheen'
    textureAndWeave: string; // e.g., 'Fine powerloom weave with crisp handfeel'
    fallAndDrape: string; // e.g., 'Structured flare with airy translucent volume'
  };
  
  embroideryAndEmbellishments: {
    types: string[]; // e.g., ['Gold Zari Jaal', 'Cutdana Beads', 'Gota Patti Hemline']
    density: string; // e.g., 'Heavy yoke with delicate scattered butis on body'
    metallicTones: string; // e.g., 'Antique Champagne Gold 22k'
  };
  
  motifs: MotifItem[];
  accompanyingElements: AccompanyingElement[];
  
  listingSpecs?: ProductListingSpec;

  ecommerceGuidelines: {
    meeshoScore: number; // 0 - 100
    amazonScore: number; // 0 - 100
    myntraScore: number; // 0 - 100
    complianceTips: string[];
    recommendedTitle: string;
    bulletPoints: string[];
    searchKeywords: string[];
  };

  prompts: {
    heroStudioShot: CatalogPrompt;
    fullBodyModelShot: CatalogPrompt;
    textureMacroShot: CatalogPrompt;
    curatedLifestyleShot: CatalogPrompt;
  };

  rawAnalysisSummary: string;
}

export type PlatformPreset = 'meesho' | 'myntra' | 'amazon_in' | 'ajio' | 'general';
export type GeneratorPreset = 'midjourney_v6' | 'flux_dev' | 'imagen_3' | 'sdxl';
export type ModelPosePreference = 'standing_front' | 'three_quarter_twirl' | 'walking_graceful' | 'seated_regal';
export type JewelleryPreference = 'temple_gold' | 'polki_kundan' | 'oxidised_silver' | 'minimal_pearl' | 'none';

export type ApiProviderType = "openrouter" | "agentrouter" | "gemini" | "custom";

export interface CustomApiConfig {
  provider: ApiProviderType;
  apiKey: string;
  baseUrl: string;
  modelName: string;
}
