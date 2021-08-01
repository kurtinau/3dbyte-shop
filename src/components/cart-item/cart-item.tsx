import React from 'react';
import { Counter } from 'components/counter/counter';
import { CloseIcon } from 'assets/icons/CloseIcon';
import { CURRENCY } from 'utils/constant';
import {
  ItemBox,
  Image,
  Information,
  Name,
  Price,
  Weight,
  Total,
  RemoveButton,
} from './cart-item.style';
import {prependHostname} from 'utils/imageFormatUtil';
import ImageNotFound from 'assets/images/ImageNotFound.png';

interface Props {
  data: any;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}

export const CartItem: React.FC<Props> = ({
  data,
  onDecrement,
  onIncrement,
  onRemove,
}) => {
  const { title, image, price, salePrice, quantity, variant } = data;
  const displayPrice = salePrice ? salePrice : price;
  return (
    <ItemBox>
      <Counter
        value={quantity}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        variant="lightVertical"
      />
      <Image src={image ? prependHostname(image.thumbnail) : ImageNotFound} />
      <Information>
        <Name>{title}</Name>
        <Price>
          {CURRENCY}
          {displayPrice}
        </Price>
        <Weight>
          {quantity} X {variant ? variant.value : ''}
        </Weight>
      </Information>
      <Total>
        {CURRENCY}
        {(quantity * displayPrice).toFixed(2)}
      </Total>
      <RemoveButton onClick={onRemove}>
        <CloseIcon />
      </RemoveButton>
    </ItemBox>
  );
};
