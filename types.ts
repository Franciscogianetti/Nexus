
export enum Category {
  POLO = 'Camisas Polo',
  BASIC = 'Básicas & Estampadas',
  PREMIUM = 'Linha Premium',
  KITS = 'Kits Promocionais',
  VESTIDOS = 'Vestidos & Saias',
  BLUSAS = 'Blusas & Tops',
  CALCAS_FEM = 'Calças & Shorts Femininos',
  ACESSORIOS = 'Acessórios',
}

export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino',
  UNISEX = 'Unissex',
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  category: Category;
  gender: Gender;
  image: string; // Keep for backward compatibility/main image
  images?: string[]; // Multiple images
  stock?: number;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[]; // Available sizes for this product
  ref: string;
}

export interface SizeDimension {
  size: string;
  width: string;
  height: string;
  weight: string;
  suggestedHeight: string;
}
