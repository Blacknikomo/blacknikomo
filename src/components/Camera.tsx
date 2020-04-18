import * as React from 'react';
import styled, {css} from 'styled-components';
import {Button} from "antd";

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;

  height: 100%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const CameraContainer = styled.div`
  width: 100%;
  height: 450px;

  display: flex;
  justify-items: center;
  justify-content: center;

  border: 1px solid rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.3);
`;
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
`;

const CanvasHook = styled.canvas`
display: none;
  position: absolute;
  top: 50px;
  left: 200px;
  //left: -9999px;
`
const PhotoItem = styled.img`
  width: 100px;
  height: 60px;
`;

const imagesWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: center;
  justify-items: center;
`;

const API_HOST = 'http://localhost:8080';

const constraints = {
  audio: false,
  video: {
    width: 1280,
    height: 430
  },
}

interface Photo {
  id: string;
  content: string;
  timestamp: string
}

const Camera: React.SFC<any> = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const cameraContainerRef = React.useRef<HTMLDivElement>(null);
  const canvasHookRef = React.useRef<HTMLCanvasElement>(null);
  const stream = React.useRef<any>(null);

  const [size, setSize] = React.useState<{width: number; height: number} | null>(null);
  const [images, setImages] = React.useState<Array<Photo>>([]);

  const syncImages = React.useCallback(async () => {
    const response = await fetch(`${API_HOST}/photos`);
    const parsed = await response.json();

    setImages(photos => [
      ...photos,
      ...parsed,
    ])
  }, [setImages]);

  React.useEffect(() => {
    const getVideoContainerSize = () => {
      if (!cameraContainerRef.current) {
        return
      }

      const {width, height} = cameraContainerRef.current.getBoundingClientRect()
      setSize({width, height})
    }

    requestAnimationFrame(getVideoContainerSize)
  }, [cameraContainerRef]);
  React.useEffect(() => {
    const startVideo = async () => {
      try {
        if (videoRef.current !== null && size !== null) {
          stream.current = await navigator.mediaDevices.getUserMedia({...constraints, video: {
              ...constraints.video,
              ...size,
            }})
          videoRef.current.srcObject = stream.current;
          videoRef.current.play();
        }
      } catch (error) {
        console.log("Alert!", error);
      }
    }

    startVideo();
    return () => videoRef?.current?.pause();
  }, [videoRef.current, size]);
  React.useEffect(() => {
    syncImages()
  }, [syncImages]);

  const takeImage = React.useCallback(() => {
    if (canvasHookRef.current == null || stream.current == null || videoRef.current == null) {
      return
    }

    const canvas = canvasHookRef.current;
    const context = canvas.getContext("2d");
    const {width, height} = stream.current.getVideoTracks()[0].getSettings();

    canvas.width = width;
    canvas.height = height;

    context?.drawImage(videoRef.current, 0, 0, width, height);
    return canvas.toDataURL('image/png');

  }, [canvasHookRef, stream, videoRef])
  const uploadImage = React.useCallback(content => {
    fetch(`${API_HOST}/photo`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    }).then(async (data) => {
      if (!data.ok) {
        return
      }

      const result = await data.json();
      setImages(photos => [
        ...photos,
        result,
      ])
    });
  }, []);

  const makeShot = React.useCallback(() => {
    const image = takeImage()
    uploadImage(image)
  }, [takeImage, uploadImage]);

  return (
    <PageContainer>
      <CameraContainer ref={cameraContainerRef}>
        <video ref={videoRef} />
      </CameraContainer>
      <CanvasHook ref={canvasHookRef} />

      <Controls>
        <Button
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
