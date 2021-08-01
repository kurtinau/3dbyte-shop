import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Sticky from 'react-stickynode';
import { useAppState } from 'contexts/app/app.provider';
import Header from './header/header';
import { LayoutWrapper } from './layout.style';
import { isCategoryPage } from './is-home-page';
import { MyAuthProvider } from 'contexts/auth/auth.provider';
const MobileHeader = dynamic(() => import('./header/mobile-header'), {
  ssr: false,
});

type LayoutProps = {
  className?: string;
  token?: string;
};

const Layout: React.FunctionComponent<LayoutProps> = ({
  className,
  children,
  // deviceType: { mobile, tablet, desktop },
  token,
}) => {
  const { pathname, query } = useRouter();
  const isSticky =
    useAppState('isSticky') ||
    pathname === '/home';

  const isHomePage = pathname === '/home';
  return (
    <LayoutWrapper className={`layoutWrapper ${className}`}>
      <Sticky enabled={isSticky} innerZ={1001}>
        <MobileHeader
          className={`${isSticky ? 'sticky' : 'unSticky'} ${
            isHomePage ? 'home' : ''
          } desktop`}
        />

        {/* <MyAuthProvider> */}
        <Header
          className={`${isSticky ? 'sticky' : 'unSticky'} ${
            isHomePage ? 'home' : ''
          }`}
        />
        {/* </MyAuthProvider> */}
      </Sticky>
      {children}
    </LayoutWrapper>
  );
};

export default Layout;
