import { GetStaticProps } from 'next';
import { GET_PRODUCTS } from 'graphql/query/products.query';
import { initializeApollo } from 'utils/apollo';
import { Banner } from 'components/banner/banner-two';
import { ProductGrid } from 'components/product-grid/product-grid';
import { Modal } from '@redq/reuse-modal';
import { ModalProvider } from 'contexts/modal/modal.provider';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import css from '@styled-system/css';
import { SEO } from 'components/seo';
import { GET_CATEGORIES_TREE } from 'graphql/query/category.query';
import { SidebarWithCardMenu } from 'layouts/sidebar/sidebar-with-card-menu';
import FurnitureImgOne from 'assets/images/banner/furniture-banner-1.jpg';
import FurnitureImgTwo from 'assets/images/banner/furniture-banner-2.jpg';
import {
  SidebarSection
} from 'assets/styles/pages.style';

const Sidebar = dynamic(() => import('layouts/sidebar/sidebar'));
const CartPopUp = dynamic(() => import('features/carts/cart-popup'), {
  ssr: false,
});

const bannerSlides = [
  {
    img: FurnitureImgOne,
    alt: 'Slide One',
  },
  {
    img: FurnitureImgTwo,
    alt: 'Slide Two',
  },
];

const PAGE_TYPE = 'furniture-two';
export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GET_PRODUCTS,
    variables: {
      start: 0,
      limit: 3,
      // limit: 20,
    },
  });
  await apolloClient.query({
    query: GET_CATEGORIES_TREE,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
};

export default function Home1({ deviceType }) {
  return (
    <>
      <SEO title={"3D Byte Home"} description={"3D Byte Home Page"} />
      <ModalProvider>
        <Modal>
          <ContentArea>
            {/* <SidebarWithCardMenu type={PAGE_TYPE} /> */}
            <SidebarSection>
              <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
            </SidebarSection>
            <main>
              <Banner data={bannerSlides} />
              <ProductGrid deviceType={deviceType} />
            </main>
          </ContentArea>
          <CartPopUp deviceType={deviceType} />
        </Modal>
      </ModalProvider>
    </>
  );
}

const ContentArea = styled.div<any>(
  css({
    overflow: 'hidden',
    padding: ['68px 0 100px', '68px 0 50px', '110px 2rem 50px'],
    display: 'grid',
    minHeight: '100vh',
    gridColumnGap: '30px',
    gridRowGap: ['15px', '20px', '0'],
    gridTemplateColumns: [
      'minmax(0, 1fr)',
      'minmax(0, 1fr)',
      '300px minmax(0, 1fr)',
    ],
    backgroundColor: '#f9f9f9',
  })
);
