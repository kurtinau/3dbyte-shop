type ImageFormateType = {
  name?: string;
  hash?: string;
  ext?: string;
  mime?: string;
  width?: number;
  height?: number;
  size?: number;
  path?: string | null;
  url?: string;
};

type ProductVariantType = {
  __typename?: string;
  value?: string;
  stock?: number;
  width?: number;
  length_?: number;
  height?: number;
  image?: {
    url?: string;
    formats?: { [k in string]: ImageFormateType };
  };
};

const hasColorVariant = (variants: ProductVariantType[]) => {
  return variants.some((element) => element.__typename.includes("Color"));
};

const checkVariantColor = (variant: ProductVariantType) => {
    return variant.__typename.includes("Color");
}


const getColorVariant = (variants: ProductVariantType[]) => {};

const getColorImage4Cover = (variants: ProductVariantType[]) => {
  return variants.find((element) => element.__typename.includes("Color"))
    .image[0].formats.small.url;
};

const hasSizeVariant = (variants: ProductVariantType[]) => {
  return variants.some((element) => element.__typename.includes("Size"));
};

const checkVariantSize = (variant: ProductVariantType) => {
    return variant.__typename.includes("Size");
}

const getSizeVariant = (variants: ProductVariantType[]) => {};

const hasVariant = () => {};

export {
  hasColorVariant,
  hasSizeVariant,
  hasVariant,
  getColorVariant,
  getColorImage4Cover,
  checkVariantColor,
  checkVariantSize
};
