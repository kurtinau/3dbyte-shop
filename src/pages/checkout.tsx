import React from "react";
import { NextPage, GetStaticProps, GetServerSideProps } from "next";
import { useQuery } from "@apollo/client";
import { Modal } from "@redq/reuse-modal";
import { SEO } from "components/seo";
import Checkout from "features/checkouts/checkout-two/checkout-two";
import { GET_LOGGED_IN_CUSTOMER } from "graphql/query/customer.query";

import { ProfileProvider } from "contexts/profile/profile.provider";
import { initializeApollo } from "utils/apollo";
import { getSession } from "next-auth/client";
import Error from "next/error";
import { Session } from "next-auth";
import ErrorMessage from "components/error-message/error-message";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  session: Session;
};
const CheckoutPage: NextPage<Props> = ({ deviceType, session }) => {
  console.log('checkout session:: ',session);
  if (!session) {
    return <Error statusCode={403} />;
  }
  const token = session.jwt;
  const { data, error, loading } = useQuery(GET_LOGGED_IN_CUSTOMER, {
    context: { headers: { "Authorization": "Bearer "+token }},
    skip: !session,
  });
  console.log('checkout::::data: ', data);
  if (!data || loading) {
    return <div>loading...</div>;
  }
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <SEO title="Checkout - 3D Byte" description="Checkout Details" />
      <ProfileProvider initData={data.me.user}>
        <Modal>
          <Checkout token={token} deviceType={deviceType} />
        </Modal>
      </ProfileProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  return {
    props: {
      session,
    },
  };
};

export default CheckoutPage;
