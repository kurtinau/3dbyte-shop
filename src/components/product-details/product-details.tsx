import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Button } from 'components/button/button';
import Popover from 'components/popover/popover';
import Select from 'components/select/select';
import { MenuDown } from 'assets/icons/MenuDown';
import * as categoryMenuIcons from 'assets/icons/category-menu-icons';
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
    SoldOutSign
} from './product-details.style';
import { LongArrowLeft } from 'assets/icons/LongArrowLeft';
import { CartIcon } from 'assets/icons/CartIcon';
import ReadMore from 'components/truncate/truncate';
import CarouselWithCustomDots from 'components/multi-carousel/multi-carousel';
import { CURRENCY } from 'utils/constant';
import { FormattedMessage } from 'react-intl';
import { useLocale } from 'contexts/language/language.provider';
import { useCart } from 'contexts/cart/use-cart';
import { Counter } from 'components/counter/counter';
import { ProductGrid } from 'components/product-grid/product-grid';
import { formateProductImageUrl } from 'utils/imageFormateUtil';

type ProductDetailsProps = {
    product: any;
    deviceType: {
        mobile: boolean;
        tablet: boolean;
        desktop: boolean;
    };
};

const ProductDetails: React.FunctionComponent<ProductDetailsProps> = ({
    product,
    deviceType,
}) => {
    const { addItem, removeItem, isInCart, getItem } = useCart();
    const carouselRef = useRef<HTMLDivElement>(null);
    const data = product;
    let carouselItems = product.gallery;
    const color = product.Color;
    const colorOptions = [];
    if (product.gallery.length <= 0 && color.length > 0) {
        carouselItems = Object.assign([], carouselItems);
        color.map(item => {
            item.Image.map(i => carouselItems.push({ url: i.formats.medium.url }))
        });
        color.map((item, index) => {
            const newOption = Object.assign({}, { value: item.value, label: item.value, stock: item.stock, index: index });
            colorOptions.push(newOption);
        });
    }

    console.log('product-details:::carouselItems: ', carouselItems);
    const [variants, setVariants] = useState(colorOptions.length > 0 ? colorOptions[0] : { index: -1 });

    const handleAddClick = (e) => {
        e.stopPropagation();
        ////TODO reformate data to fit cart finished?
        const formatedProduct = formateProductImageUrl(product);
        if (colorOptions.length > 0) {
            console.log('product-details:::product: ', product);
            const { Color, categories, description, gallery, shortDescription, ...newItemWithVariant } = formatedProduct;
            newItemWithVariant.variant = variants;
            newItemWithVariant.image = formatedProduct.image[variants.index];
            console.log('product-details:::newItemWithVariant ', newItemWithVariant);
            addItem(newItemWithVariant);
        } else {
            const { Color, categories, description, gallery, shortDescription, image, ...newItem } = formatedProduct;
            addItem(newItem);
        }
    };

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        const formatedProduct = formateProductImageUrl(product);
        if (colorOptions.length > 0) {
            const { Color, categories, description, gallery, shortDescription, ...newItemWithVariant } = formatedProduct;
            newItemWithVariant.variant = variants;
            newItemWithVariant.image = formatedProduct.image[variants.index];
            removeItem(newItemWithVariant);
        } else {
            const { Color, categories, description, gallery, shortDescription, image, ...newItem } = formatedProduct;
            removeItem(newItem);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 500);
    }, []);


    return (
        <>
            <ProductDetailsWrapper className='product-card'>
                <ProductPreview>
                    <BackButton>
                        <Button
                            type="button"
                            size="small"
                            style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #f1f1f1',
                                color: '#77798c',
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
                        <ProductTitle>{product.title}</ProductTitle>
                    </ProductTitlePriceWrapper>

                    <ProductPriceWrapper>
                        <ProductPrice>
                            {CURRENCY}
                            {product.salePrice ? product.salePrice : product.price}
                        </ProductPrice>

                        {product.discountInPercent ? (
                            <SalePrice>
                                {CURRENCY}
                                {product.price}
                            </SalePrice>
                        ) : null}
                    </ProductPriceWrapper>

                    <ProductDescription>
                        <ReadMore character={600}>{product.shortDescription}</ReadMore>
                    </ProductDescription>
                    {color.length > 0 &&
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
                            />
                            {variants.stock <= 0 && <SoldOutSign><strong>out of stock</strong></SoldOutSign>}
                        </OptionsWrapper>
                    }

                    <ProductCartWrapper>
                        <ProductCartBtn>
                            {!isInCart(data.id, variants.index !== -1 ? variants.index : undefined) ? (
                                <Button
                                    className='cart-button'
                                    variant='primary'
                                    size='big'
                                    onClick={handleAddClick}
                                    disabled={colorOptions.length > 0 ? variants.stock <= 0 : false}
                                >
                                    <CartIcon mr={2} />
                                    <ButtonText>
                                        <FormattedMessage
                                            id='addToCartButton'
                                            defaultMessage='Add to cart'
                                        />
                                    </ButtonText>
                                </Button>
                            ) : (
                                    <Counter
                                        value={getItem(data.id, variants.index !== -1 ? variants.index : undefined).quantity}
                                        onDecrement={handleRemoveClick}
                                        onIncrement={handleAddClick}
                                        className='card-counter'
                                        variant='altHorizontal'
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
                <Description>{product.description}</Description>
            </DetailsWrapper>

            <RelatedItems>
                <h2>
                    <FormattedMessage
                        id='intlRelatedItems'
                        defaultMessage='Related Items'
                    />
                </h2>

                <ProductGrid
                    loadMore={false}
                    fetchLimit={5}
                    style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    }}
                />
            </RelatedItems>
        </>
    );
};

export default ProductDetails;
