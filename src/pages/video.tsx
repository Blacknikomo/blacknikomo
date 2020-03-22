import * as React from 'react';
import IndexLayout from '../layouts';
import Page from '../components/Page';
import Container from "../components/Container";
import Camera from "../components/Camera";

const Video = () => {
  return (
    <IndexLayout>
      <Page>
        <Container>
          <Camera />

        </Container>
      </Page>
    </IndexLayout>
  );
};

export default Video;
