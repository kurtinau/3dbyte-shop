import { AnyMxRecord } from "dns";
import { checkVariantColor, hasColorVariant } from "./productVariantHandler";

const prependHostname = (url) => {
  let newUrl = url;
  if (url && !(url.startsWith("http://") || url.startsWith("https://"))) {
    // console.log('env:: ', process.env.NEXT_PUBLIC_GRAPHQL_API_HOST);
    newUrl = process.env.NEXT_PUBLIC_GRAPHQL_API_HOST.concat(url);
  }
  return newUrl;
};

type Product = {
  id?: string;
  title?: string;
  price?: number;
  discountInPercent?: number;
  salePrice?: number;
  description?: string;
  shortDescription?: string;
  categories?: Array<any>;
  image?: any;
  gallery?: Array<any>;
  variant?: any;
  variants?: any;
};

const formatProductImageUrl = (product: Product) => {
  let productWithImage: Product = { image: [] };
  if (
    product.gallery.length <= 0 &&
    product.variants.length > 0 &&
    hasColorVariant(product.variants)
  ) {
    product.variants.map((variant) => {
      if (checkVariantColor(variant)) {
        const imageFormats = variant.image[0].formats;
        console.log('imageformatss:: ', imageFormats)
        const originalUrl = variant.image[0].url;
        productWithImage.image.push({
          thumbnail: imageFormats.thumbnail
            ? imageFormats.thumbnail.url
            : originalUrl,
          large: imageFormats.large ? imageFormats.large.url : originalUrl,
          medium: imageFormats.medium ? imageFormats.medium.url : originalUrl,
          small: imageFormats.small ? imageFormats.small.url : originalUrl,
          url: originalUrl,
        });
      }
    });
  } else if (!hasColorVariant(product.variants) && product.gallery.length > 0) {
    product.gallery.map((item) => {
      const imageFormats = item.formats;
      const originalUrl = item.url;
      productWithImage.image.push({
        thumbnail: imageFormats.thumbnail
          ? imageFormats.thumbnail.url
          : originalUrl,
        large: imageFormats.large ? imageFormats.large.url : originalUrl,
        medium: imageFormats.medium ? imageFormats.medium.url : originalUrl,
        small: imageFormats.small ? imageFormats.small.url : originalUrl,
        url: originalUrl,
      });
    });
  }
  productWithImage = Object.assign(productWithImage, product);
  // if (product.gallery.length <= 0 && product.Color.length > 0) {
  //     product.Color.map(item => {
  //       const imageFormats = item.Image[0].formats;
  //       const originalUrl = item.Image[0].url;
  //       productWithImage.image.push({
  //         "thumbnail": imageFormats.thumbnail ? imageFormats.thumbnail.url : originalUrl,
  //         "large": imageFormats.large ? imageFormats.large.url : originalUrl,
  //         "medium": imageFormats.medium ? imageFormats.medium.url : originalUrl,
  //         "small": imageFormats.small ? imageFormats.small.url : originalUrl,
  //         url: originalUrl
  //       });
  //     });
  //   } else if (product.Color.length <= 0 && product.gallery.length > 0) {
  //     product.gallery.map(item => {
  //       const imageFormats = item.formats;
  //       const originalUrl = item.url;
  //       productWithImage.image.push({
  //         "thumbnail": imageFormats.thumbnail ? imageFormats.thumbnail.url : originalUrl,
  //         "large": imageFormats.large ? imageFormats.large.url : originalUrl,
  //         "medium": imageFormats.medium ? imageFormats.medium.url : originalUrl,
  //         "small": imageFormats.small ? imageFormats.small.url : originalUrl,
  //         url: originalUrl
  //       });
  //     });
  //   }
  //   productWithImage = Object.assign(productWithImage, product);
  return productWithImage;
};

export { prependHostname, formatProductImageUrl };
