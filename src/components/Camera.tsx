import * as React from 'react';
import { SFC } from 'react';

import {Button} from "antd"
import webcamjs from 'webcamjs';
import styled, {css} from "styled-components";

console.log("Web Cam JS: ", webcamjs);

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

  border: 1px solid rgba(0, 0, 0, .25);
  background-color: rgba(0, 0, 0, .3);
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

const imagesWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
  justify-items: center;
`;

const PhotoItem = styled.img`
  width: 100px;
  height: 40px;
`

const Camera: SFC<any> = () => {
  const cameraDiv = React.useRef(null);
  const [images, setImage] = React.useState<Array<string>>([]);

  console.log("Camera div", cameraDiv);

  React.useEffect(() => {
    if (cameraDiv.current !== null) {
      webcamjs.attach(cameraDiv.current)
    }
  }, [cameraDiv]);

  const makeShot = React.useCallback(() => {
    webcamjs.snap((image:string) => setImage(list => [...list, image]))
  }, []);

  return <PageContainer>
    <CameraContainer>
      <CameraDiv ref={cameraDiv} />
    </CameraContainer>
    <Controls>
      <Button className={css`margin-top: 30px`} type={"primary"} onClick={makeShot}>{'Take a photo'}</Button>
      <div className={imagesWrapperStyles}>{images.map(image => <PhotoItem key={image} src={image} />)}</div>
    </Controls>
  </PageContainer>;
};

export default Camera;
