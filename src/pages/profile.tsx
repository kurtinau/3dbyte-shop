import { GetServerSideProps } from 'next';
import { useQuery } from '@apollo/client';
import { Modal } from '@redq/reuse-modal';
import { GET_LOGGED_IN_CUSTOMER } from 'graphql/query/customer.query';
import { ProfileProvider } from 'contexts/profile/profile.provider';
import SettingsContent from 'features/user-profile/settings/settings';
import {
  PageWrapper,
  SidebarSection,
  ContentBox,
} from 'features/user-profile/user-profile.style';
import Sidebar from 'features/user-profile/sidebar/sidebar';
import { SEO } from 'components/seo';
import Footer from 'layouts/footer';
import ErrorMessage from 'components/error-message/error-message';
import { useSession, getSession } from 'next-auth/client';
import Error from 'next/error';
import { useEffect } from 'react';


/**
 * //TODO: 
 * 2.change delivery address input form
 * 3.give info to customer if there is no card existed.
 * 
 */



type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const ProfilePage = ({ deviceType, session }) => {
  if (!session) {
    return <Error statusCode={403} />
  }
  console.log('profile session:: ',session);

  const { data, error, loading } = useQuery(GET_LOGGED_IN_CUSTOMER, {
    context: { headers: { "Authorization": "Bearer "+session.jwt }},
    skip: !session,
  });
  console.log('profile::::data: ', data);
  if (!data || loading) {
    return <div>loading...</div>;
  }
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <SEO title="Profile - PickBazar" description="Profile Details" />
      <ProfileProvider initData={data.me.user}>
        <Modal>
          <PageWrapper>
            <SidebarSection>
              <Sidebar />
            </SidebarSection>
            <ContentBox>
              <SettingsContent deviceType={deviceType} userId = {session.id} token={session.jwt}/>
            </ContentBox>

            <Footer />
          </PageWrapper>
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

export default ProfilePage;
