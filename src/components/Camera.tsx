import * as React from 'react';

import { Button } from 'antd';
import webcamjs from 'webcamjs';
import styled, { css } from 'styled-components';

const PageContainer = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const CameraContainer = styled.div`
  width: 100%;
  height: 450px;

  border: 1px solid rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.3);
`;
const CameraDiv = styled.div`
  width: 100%;
  height: 450px;
`;
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
`;
const PhotoItem = styled.img`
  width: 100px;
  height: 40px;
`;

const imagesWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
  justify-items: center;
`;

const API_HOST = 'http://localhost:8080';

const Camera: React.SFC<any> = () => {
  const cameraDiv = React.useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [images, setImage] = React.useState<Array<string>>([]);

  const syncImages = React.useCallback(async () => {
    setLoading(true);
    const response = await fetch(`${API_HOST}/photos`);
    const photos = await response.json();
    setImage(photos);
    setLoading(false);
  }, []);

  const uploadImage = React.useCallback(content => {
    fetch(`${API_HOST}/photo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    }).then(() => {});
  }, []);

  React.useEffect(() => {
    if (cameraDiv.current !== null) {
      webcamjs.attach(cameraDiv.current);
    }
    syncImages();
  }, [cameraDiv]);

  const makeShot = React.useCallback(() => {
    webcamjs.snap((image: string) => uploadImage(image));
  }, [uploadImage]);

  return (
    <PageContainer>
      <CameraContainer>
        <CameraDiv ref={cameraDiv} />
      </CameraContainer>
      <Controls>
        <Button
          className={css`
            margin-top: 30px;
          `}
          type="primary"
          onClick={makeShot}
        >
          {'Take a photo'}
        </Button>
        <div className={imagesWrapperStyles}>
           {images.map(image => (
            <PhotoItem key={image.id} src={image.content} />
           ))}
        </div>
      </Controls>
    </PageContainer>
  );
};

export default Camera;
