import React, { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { Button } from "components/button/button";
import Select from "components/select/select";
import {
  QuickViewWrapper,
  ProductDetailsWrapper,
  ProductPreview,
  DiscountPercent,
  ProductInfoWrapper,
  ProductInfo,
  ProductTitlePriceWrapper,
  ProductTitle,
  ProductWeight,
  ProductDescription,
  ButtonText,
  ProductMeta,
  ProductCartWrapper,
  ProductPriceWrapper,
  ProductPrice,
  SalePrice,
  ProductCartBtn,
  MetaSingle,
  MetaItem,
  ModalClose,
  SoldOutSign,
  OptionsWrapper,
} from "./quick-view.style";
import { CloseIcon } from "assets/icons/CloseIcon";
import { CartIcon } from "assets/icons/CartIcon";
import { CURRENCY } from "utils/constant";

import ReadMore from "components/truncate/truncate";
import CarouselWithCustomDots from "components/multi-carousel/multi-carousel";
import { useLocale } from "contexts/language/language.provider";
import { useCart } from "contexts/cart/use-cart";
import { Counter } from "components/counter/counter";
import { FormattedMessage } from "react-intl";
import Carousel from "react-multi-carousel";
import { VaraiantType } from "components/product-details/product-details";

type QuickViewProps = {
  modalProps: any;
  onModalClose?: any;
  hideModal: () => void;
  deviceType: any;
};

const QuickViewMobile: React.FunctionComponent<QuickViewProps> = ({
  modalProps,
  onModalClose,
  hideModal,
  deviceType,
}) => {
  const { addItem, removeItem, isInCart, getItem } = useCart();
  const carouselRef = useRef<Carousel>(null);
  const {
    id,
    title,
    price,
    discountInPercent,
    salePrice,
    description,
    categories,
    image,
    variants,
  } = modalProps;

  const { isRtl } = useLocale();

  const [variantOptions, setVariantOptions] = useState<VaraiantType[]>([]);
  const [choosedVariant, setChoosedVariant] = useState<VaraiantType>({});


  useEffect(() => {
    const options = [];
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
      options.push(newOption);
    });
    setVariantOptions(options);
    setChoosedVariant(options[0]);
  }, [modalProps]);

  const handleAddClick = (e: any) => {
    e.stopPropagation();
    if (Object.keys(choosedVariant).length > 0) {
      const {
        categories,
        description,
        gallery,
        shortDescription,
        image,
        variants,
        ...newItemWithVariant
      } = modalProps;
      // newItemWithVariant.variant = choosedVariant;
      newItemWithVariant.variant = {...choosedVariant,...variants[choosedVariant.index]};
      newItemWithVariant.image =
        image[image.length > 1 ? choosedVariant.index : 0];
      console.log("newItemWithVariant: ", newItemWithVariant);
      addItem(newItemWithVariant);
    } else {
      alert("Please select an option.");
    }
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    const {
      categories,
      description,
      gallery,
      shortDescription,
      image,
      ...newItemWithVariant
    } = modalProps;
    newItemWithVariant.variant = choosedVariant;
    newItemWithVariant.image = image[choosedVariant.index];
    removeItem(newItemWithVariant);
  };
  function onCategoryClick(slug) {
    Router.push({
      pathname: `/home`,
      query: { category: slug },
    }).then(() => window.scrollTo(0, 0));
    hideModal();
  }

  return (
    <>
      {/* <ModalClose onClick={onModalClose}>
        <CloseIcon />
      </ModalClose> */}
      <QuickViewWrapper className="quick-view-mobile-wrapper">
        <ProductDetailsWrapper className="product-card" dir="ltr">
          {!isRtl && (
            <ProductPreview>
              <CarouselWithCustomDots
                items={image}
                deviceType={deviceType}
                ref={carouselRef}
              />
              {!!discountInPercent && (
                <DiscountPercent>{discountInPercent}%</DiscountPercent>
              )}
            </ProductPreview>
          )}
          <ProductInfoWrapper dir={isRtl ? "rtl" : "ltr"}>
            <ProductInfo>
              <ProductTitlePriceWrapper>
                <ProductTitle>{title}</ProductTitle>
              </ProductTitlePriceWrapper>

              {/* <ProductWeight>{unit}</ProductWeight> */}
              <ProductDescription>
                <ReadMore character={600}>{description}</ReadMore>
              </ProductDescription>

              <ProductMeta>
                <MetaSingle>
                  {categories
                    ? categories.map((item: any) => (
                        <MetaItem
                          onClick={() => onCategoryClick(item.slug)}
                          key={item.id}
                        >
                          {item.title}
                        </MetaItem>
                      ))
                    : ""}
                </MetaSingle>
              </ProductMeta>

              <OptionsWrapper>
                <Select
                  isValid={Object.keys(choosedVariant).length > 0}
                  value={choosedVariant}
                  options={variantOptions}
                  onChange={(value) => {
                    if (carouselRef.current) {
                      if (image.length > 1)
                        carouselRef.current.goToSlide(value.index);
                    }
                    setChoosedVariant(variantOptions[value.index]);
                  }}
                  menuPlacement={"top"}
                />
                {choosedVariant.stock <= 0 && (
                  <SoldOutSign>
                    <strong>out of stock</strong>
                  </SoldOutSign>
                )}
              </OptionsWrapper>

              <ProductCartWrapper>
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

                <ProductCartBtn>
                  {!isInCart(id, choosedVariant.index) ? (
                    <Button
                      className="cart-button"
                      variant="secondary"
                      borderRadius={100}
                      onClick={handleAddClick}
                      disabled={choosedVariant.stock <= 0}
                    >
                      <CartIcon mr={2} />
                      <ButtonText>
                        <FormattedMessage
                          id="addCartButton"
                          defaultMessage="Cart"
                        />
                      </ButtonText>
                    </Button>
                  ) : (
                    <Counter
                      value={getItem(id, choosedVariant.index).quantity}
                      onDecrement={handleRemoveClick}
                      onIncrement={handleAddClick}
                    />
                  )}
                </ProductCartBtn>
              </ProductCartWrapper>
            </ProductInfo>
          </ProductInfoWrapper>

          {isRtl && (
            <ProductPreview>
              <CarouselWithCustomDots items={image} deviceType={deviceType} />
              {!!discountInPercent && (
                <DiscountPercent>{discountInPercent}%</DiscountPercent>
              )}
            </ProductPreview>
          )}
        </ProductDetailsWrapper>
      </QuickViewWrapper>
    </>
  );
};

export default QuickViewMobile;
