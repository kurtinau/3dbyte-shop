import React, { useRef, useState } from 'react';
import Router from 'next/router';
// import { closeModal } from '@redq/reuse-modal';
import { Button } from 'components/button/button';
import Select from 'components/select/select';
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
  OptionsWrapper
} from './quick-view.style';
import { CloseIcon } from 'assets/icons/CloseIcon';
import { CartIcon } from 'assets/icons/CartIcon';
import { CURRENCY } from 'utils/constant';

import ReadMore from 'components/truncate/truncate';
import CarouselWithCustomDots from 'components/multi-carousel/multi-carousel';
import { useLocale } from 'contexts/language/language.provider';
import { useCart } from 'contexts/cart/use-cart';
import { Counter } from 'components/counter/counter';
import { FormattedMessage } from 'react-intl';

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
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    id,
    title,
    price,
    discountInPercent,
    salePrice,
    description,
    categories,
    image,
    Color
  } = modalProps;


  const { isRtl } = useLocale();

  console.log('modalProps:: ', modalProps);
  const colorOptions = [];
  Color.map((item, index) => {
    const newOption = Object.assign({}, { value: item.value, label: item.value, stock: item.stock, index: index });
    colorOptions.push(newOption);
  });

  const [variants, setVariants] = useState(colorOptions[0]);


  const handleAddClick = (e: any) => {
    e.stopPropagation();
    ////TODO reformate modalProps to fit cart finished?
    const { Color, categories, description, gallery, shortDescription, image, ...newItemWithVariant } = modalProps;
    newItemWithVariant.variant = variants;
    newItemWithVariant.image = image[variants.index];
    console.log('newItemWithVariant: ', newItemWithVariant);
    addItem(newItemWithVariant);
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    const { Color, categories, description, gallery, shortDescription, image, ...newItemWithVariant } = modalProps;
    newItemWithVariant.variant = variants;
    newItemWithVariant.image = image[variants.index];
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
      <QuickViewWrapper className='quick-view-mobile-wrapper'>
        <ProductDetailsWrapper className='product-card' dir='ltr'>
          {!isRtl && (
            <ProductPreview>
              <CarouselWithCustomDots items={image} deviceType={deviceType} ref={carouselRef} />
              {!!discountInPercent && (
                <DiscountPercent>{discountInPercent}%</DiscountPercent>
              )}
            </ProductPreview>
          )}
          <ProductInfoWrapper dir={isRtl ? 'rtl' : 'ltr'}>
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
                    : ''}
                </MetaSingle>
              </ProductMeta>

              <OptionsWrapper>
                <Select options={colorOptions}
                  defaultValue={colorOptions[0]}
                  onChange={(value, action) => {
                    console.log('eee: ', value);
                    console.log('actionsss: ', action)
                    if (carouselRef.current) {
                      carouselRef.current.goToSlide(value.index);
                    }
                    setVariants(colorOptions[value.index]);
                  }}
                  menuPlacement={"top"}
                />
                {variants.stock <= 0 && <SoldOutSign><strong>out of stock</strong></SoldOutSign>}
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
                  {!isInCart(id, variants.index) ? (
                    <Button
                      className='cart-button'
                      variant='secondary'
                      borderRadius={100}
                      onClick={handleAddClick}
                      disabled={variants.stock <= 0}
                    >
                      <CartIcon mr={2} />
                      <ButtonText>
                        <FormattedMessage
                          id='addCartButton'
                          defaultMessage='Cart'
                        />
                      </ButtonText>
                    </Button>
                  ) : (
                      <Counter
                        value={getItem(id, variants.index).quantity}
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
