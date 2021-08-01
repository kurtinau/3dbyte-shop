import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { Button } from "components/button/button";
import Popover from "components/popover/popover";
import Select from "components/select/select";
import { MenuDown } from "assets/icons/MenuDown";
import * as categoryMenuIcons from "assets/icons/category-menu-icons";
import {
  ProductDetailsWrapper,
  ProductPreview,
  BackButton,
  ProductInfo,
  ProductTitlePriceWrapper,
  ProductTitle,
  ProductDescription,
  ButtonText,
  ProductMeta,
  ProductCartWrapper,
  ProductPriceWrapper,
  ProductPrice,
  SalePrice,
  ProductCartBtn,
  MetaTitle,
  MetaSingle,
  MetaItem,
  DetailsWrapper,
  DetailsTitle,
  Description,
  RelatedItems,
  OptionsWrapper,
  SelectedItem,
  Arrow,
  Icon,
  IconWrapper,
  MenuItem,
  SoldOutSign,
} from "./product-details.style";
import { LongArrowLeft } from "assets/icons/LongArrowLeft";
import { CartIcon } from "assets/icons/CartIcon";
import ReadMore from "components/truncate/truncate";
import CarouselWithCustomDots from "components/multi-carousel/multi-carousel";
import { CURRENCY } from "utils/constant";
import { FormattedMessage } from "react-intl";
import { useLocale } from "contexts/language/language.provider";
import { useCart } from "contexts/cart/use-cart";
import { Counter } from "components/counter/counter";
import { ProductGrid } from "components/product-grid/product-grid";
import { formatProductImageUrl } from "utils/imageFormatUtil";
import Carousel from "react-multi-carousel";
import {
  checkVariantColor,
  hasColorVariant,
  hasSizeVariant,
} from "utils/productVariantHandler";

type ProductDetailsProps = {
  product: any;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
export interface VaraiantType {
  stock?: number;
  value?: string;
  label?: string;
  index?: number;
}

const ProductDetails: React.FunctionComponent<ProductDetailsProps> = ({
  product,
  deviceType,
}) => {
  const { addItem, removeItem, isInCart, getItem } = useCart();
  const carouselRef = useRef<Carousel>(null);
  const {
    id,
    title,
    price,
    salePrice,
    discountInPercent,
    shortDescription,
    description,
    categories,
    gallery,
    variants,
  } = product;
  const [variantOptions, setVariantOptions] = useState<VaraiantType[]>([]);
  const [choosedVariant, setChoosedVariant] = useState<VaraiantType>({});
  const [carouselItems, setCarouselItems] = useState(gallery);
  useEffect(() => {
    if (gallery.length <= 0 && hasColorVariant(variants)) {
      const newCarouselItems = [];
      const newVariantOptions = [];
      variants.map((variant, index) => {
        if (checkVariantColor(variant)) {
          variant.image.map((i) =>
            newCarouselItems.push({ url: i.formats.medium.url })
          );
        }
        const newOption = Object.assign(
          {},
          {
            value: variant.value,
            label: variant.value,
            stock: variant.stock,
            index: index,
          }
        );
        newVariantOptions.push(newOption);
      });
      setVariantOptions(newVariantOptions);
      setCarouselItems(newCarouselItems);
      setChoosedVariant(newVariantOptions[0]);
    } else if (hasSizeVariant(variants)) {
      const newVariantOptions = [];
      variants.map((variant, index) => {
        const newOption = Object.assign(
          {},
          {
            value: variant.value,
            label: variant.value,
            stock: variant.stock,
            index: index,
          }
        );
        newVariantOptions.push(newOption);
      });
      setCarouselItems(gallery);
      setVariantOptions(newVariantOptions);
      setChoosedVariant(newVariantOptions[0]);
    } else {
      setCarouselItems(gallery);
      setVariantOptions([]);
      setChoosedVariant({});
    }
  }, [product]);

  console.log("product-details:::carouselItems: ", carouselItems);

  const handleAddClick = (e) => {
    e.stopPropagation();
    const formatedProduct = formatProductImageUrl(product);
    if (checkIfChooseVariant) {
      console.log("product-details:::formatedProduct: ", formatedProduct);
      const {
        categories,
        description,
        gallery,
        shortDescription,
        variants,
        ...newItemWithVariant
      } = formatedProduct;
      newItemWithVariant.variant = {
        ...choosedVariant,
        ...variants[choosedVariant.index],
      };
      newItemWithVariant.image =
        formatedProduct.image[
          formatedProduct.image.length > 1 ? choosedVariant.index : 0
        ];
      console.log("product-details:::newItemWithVariant ", newItemWithVariant);
      addItem(newItemWithVariant);
    } else {
      const {
        categories,
        description,
        gallery,
        shortDescription,
        variants,
        ...newItem
      } = formatedProduct;
      newItem.image = formatedProduct.image[0];
      console.log(
        "add product to cart---product details without variant: ",
        newItem
      );
      addItem(newItem);
    }
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    const formatedProduct = formatProductImageUrl(product);
    if (checkIfChooseVariant) {
      const {
        categories,
        description,
        gallery,
        shortDescription,
        variants,
        ...newItemWithVariant
      } = formatedProduct;
      newItemWithVariant.variant = {
        ...choosedVariant,
        ...variants[choosedVariant.index],
      };
      newItemWithVariant.image =
        formatedProduct.image[
          formatedProduct.image.length > 1 ? choosedVariant.index : 0
        ];
      removeItem(newItemWithVariant);
    } else {
      const {
        categories,
        description,
        gallery,
        shortDescription,
        image,
        variants,
        ...newItem
      } = formatedProduct;
      removeItem(newItem);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }, []);

  const checkIfChooseVariant = Object.keys(choosedVariant).length > 0;
  return (
    <>
      <ProductDetailsWrapper className="product-card">
        <ProductPreview>
          <BackButton>
            <Button
              type="button"
              size="small"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #f1f1f1",
                color: "#77798c",
              }}
              onClick={Router.back}
            >
              <LongArrowLeft style={{ marginRight: 5 }} />
              <FormattedMessage id="backBtn" defaultMessage="Back" />
            </Button>
          </BackButton>
          <CarouselWithCustomDots
            items={carouselItems}
            deviceType={deviceType}
            ref={carouselRef}
          />
        </ProductPreview>

        <ProductInfo>
          <ProductTitlePriceWrapper>
            <ProductTitle>{title}</ProductTitle>
          </ProductTitlePriceWrapper>

          <ProductPriceWrapper>
            <ProductPrice>
              {CURRENCY}
              {salePrice ? salePrice : price}
            </ProductPrice>

            {discountInPercent ? (
              <SalePrice>
                {CURRENCY}
                {price}
              </SalePrice>
            ) : null}
          </ProductPriceWrapper>

          <ProductDescription>
            <ReadMore character={600}>{shortDescription}</ReadMore>
          </ProductDescription>
          {(hasColorVariant(variants) || hasSizeVariant(variants)) && (
            <OptionsWrapper>
              <Select
                isValid={checkIfChooseVariant}
                value={choosedVariant}
                options={variantOptions}
                onChange={(value) => {
                  if (carouselRef.current) {
                    if (carouselItems.length > 1)
                      carouselRef.current.goToSlide(value.index);
                  }
                  setChoosedVariant(variantOptions[value.index]);
                }}
              />
              {choosedVariant.stock <= 0 && (
                <SoldOutSign>
                  <strong>out of stock</strong>
                </SoldOutSign>
              )}
            </OptionsWrapper>
          )}

          <ProductCartWrapper>
            {
              //TODO refactor carbtn component
            }
            <ProductCartBtn>
              {!isInCart(
                id,
                checkIfChooseVariant ? choosedVariant.index : undefined
              ) ? (
                <Button
                  className="cart-button"
                  variant="primary"
                  size="big"
                  onClick={handleAddClick}
                  disabled={
                    checkIfChooseVariant ? choosedVariant.stock <= 0 : false
                  }
                >
                  <CartIcon mr={2} />
                  <ButtonText>
                    <FormattedMessage
                      id="addToCartButton"
                      defaultMessage="Add to cart"
                    />
                  </ButtonText>
                </Button>
              ) : (
                <Counter
                  value={
                    getItem(
                      id,
                      checkIfChooseVariant ? choosedVariant.index : undefined
                    ).quantity
                  }
                  onDecrement={handleRemoveClick}
                  onIncrement={handleAddClick}
                  className="card-counter"
                  variant="altHorizontal"
                />
              )}
            </ProductCartBtn>
          </ProductCartWrapper>

          <ProductMeta>
            <MetaTitle>Tags:</MetaTitle>
            <MetaSingle>
              {product?.categories?.map((item: any) => (
                <Link
                  href={`/home?category=${item.slug}`}
                  key={`link-${item.id}`}
                >
                  <a>
                    <MetaItem>{item.title}</MetaItem>
                  </a>
                </Link>
              ))}
            </MetaSingle>
          </ProductMeta>
        </ProductInfo>
      </ProductDetailsWrapper>

      <DetailsWrapper>
        <DetailsTitle>
          <FormattedMessage
            id="descriptionSectionTitle"
            defaultMessage="Description"
          />
        </DetailsTitle>
        <Description>{description}</Description>
      </DetailsWrapper>

      <RelatedItems>
        <h2>
          <FormattedMessage
            id="intlRelatedItems"
            defaultMessage="Related Items"
          />
        </h2>

        <ProductGrid
          loadMore={false}
          fetchLimit={5}
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
          deviceType={deviceType}
        />
      </RelatedItems>
    </>
  );
};

export default ProductDetails;
