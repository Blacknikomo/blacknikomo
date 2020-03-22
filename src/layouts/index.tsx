import * as React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { Layout } from 'antd';

import 'modern-normalize';
import '../styles/normalize';

import LayoutRoot from '../components/LayoutRoot';
import LayoutMain from '../components/LayoutMain';
import HeaderSection from "../components/Header";

interface StaticQueryProps {
  site: {
    siteMetadata: {
      title: string;

      description: string;
      keywords: string;
    };
  };
}

const IndexLayout: React.FC = ({ children }) => {
  return (
    <StaticQuery
      query={graphql`
        query IndexLayoutQuery {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
      `}
      render={(data: StaticQueryProps) => (
        <LayoutRoot>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: 'description', content: data.site.siteMetadata.description },
              { name: 'keywords', content: data.site.siteMetadata.keywords },
            ]}
          />
          <Layout>
            <HeaderSection />
            <LayoutMain>{children}</LayoutMain>
          </Layout>
        </LayoutRoot>
      )}
    />
  );
};

export default IndexLayout;
