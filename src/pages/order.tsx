import React from 'react';
import { NextPage } from 'next';
import { SEO } from 'components/seo';
import Order from 'features/user-profile/order/order';
import {
  PageWrapper,
  SidebarSection,
} from 'features/user-profile/user-profile.style';
import Sidebar from 'features/user-profile/sidebar/sidebar';
import { Modal } from '@redq/reuse-modal';
import { useSession } from 'next-auth/client';
import Error from 'next/error';


const OrderPage: NextPage = () => {
  const [session, loading] = useSession();
  if (loading) {
    return <div>loading...</div>;
  }

  if (!session) {
    return <Error statusCode={403} />
  }

  return (
    <>
      <SEO title="Order - PickBazar" description="Order Details" />
      <Modal>
        <PageWrapper>
          <SidebarSection>
            <Sidebar />
          </SidebarSection>

          <Order />
        </PageWrapper>
      </Modal>
    </>
  );

};



export default OrderPage;
