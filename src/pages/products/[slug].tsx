import React from "react";
import dynamic from "next/dynamic";
import { initializeApollo } from "utils/apollo";
import { GET_PRODUCT_DETAILS } from "graphql/query/product.query";
import { Modal } from "@redq/reuse-modal";
import ProductSingleWrapper, {
  ProductSingleContainer,
} from "assets/styles/product-single.style";
import { ModalProvider } from "contexts/modal/modal.provider";

const ProductDetails = dynamic(
  () => import("components/product-details/product-details")
);

const CartPopUp = dynamic(() => import("features/carts/cart-popup"), {
  ssr: false,
});
interface Props {
  data: any;
  deviceType: any;
}

export async function getServerSideProps({ params }) {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: GET_PRODUCT_DETAILS,
    variables: {
      where: { slug: params.slug },
    },
  });
  return {
    props: {
      data,
    },
  };
}
const ProductDetailsPage = ({ data, deviceType }: Props) => {
  let content = (
    <ProductDetails product={data.productByUID} deviceType={deviceType} />
  );
  // if (data.product.type === 'BAKERY') {
  //   content = (
  //     <ProductDetailsBakery product={data.product} deviceType={deviceType} />
  //   );
  // }
  // if (data.product.type === 'GROCERY') {
  //   content = (
  //     <ProductDetailsGrocery product={data.product} deviceType={deviceType} />
  //   );
  // }
  return (
    <ModalProvider>
      <Modal>
        <ProductSingleWrapper>
          <ProductSingleContainer>
            {content}
            <CartPopUp deviceType={deviceType} />
          </ProductSingleContainer>
        </ProductSingleWrapper>
      </Modal>
    </ModalProvider>
  );
};
export default ProductDetailsPage;
