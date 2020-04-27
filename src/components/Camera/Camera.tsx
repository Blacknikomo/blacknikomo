import * as React from "react";
import styled from "styled-components";
import * as faceApi from "face-api.js";
import { Spin } from "antd";

window.FaceApi = faceApi;

import { Button } from "antd";

import { getAllPhotos, uploadPhoto } from "../../requests/photos";

import PhotoItem from "./Photo";
import {FaceDetection, FaceExpressions, FaceLandmarks} from "face-api.js";
import FaceBorder from "./FaceBorder";

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
`;
const ImagesContainer = styled.div`
  width: 100%;
  display: flex;

  justify-content: center;
  justify-items: center;

  flex-wrap: wrap;
`;

const constraints = {
  audio: false,
  video: {
    width: 1280,
    height: 430,
  },
};

interface Photo {
  id: string;
  content: string;
  timestamp: string;
}

console.log("Face API. Networks: ", faceApi.nets);

const Camera: React.FunctionComponent<any> = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const cameraContainerRef = React.useRef<HTMLDivElement>(null);
  const canvasHookRef = React.useRef<HTMLCanvasElement>(null);
  const stream = React.useRef<any>(null);

  const [videoDetections, setVideoDetections] = React.useState<Array<{
    detection: FaceDetection,
    landmarks: FaceLandmarks,
    expressions: FaceExpressions,
  }>>()
  const [loadingShapes, setLoadingShapes] = React.useState(true);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const [images, setImages] = React.useState<Array<Photo>>([]);

  const removeImageFromList = React.useCallback(
    (id: String) => {
      setImages(images => images.filter(image => image.id !== id));
    },
    [images],
  );
  const takeImage = React.useCallback(() => {
    if (canvasHookRef.current == null || stream.current == null || videoRef.current == null) {
      return;
    }

    const canvas = canvasHookRef.current;
    const context = canvas.getContext("2d");
    const { width, height } = stream.current.getVideoTracks()[0].getSettings();

    console.log("x");
    canvas.width = width;
    canvas.height = height;

    context?.drawImage(videoRef.current, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  }, [canvasHookRef, stream, videoRef]);
  const uploadImage = React.useCallback(async content => {
    const response = await uploadPhoto(content);

    if (!response.ok) {
      return;
    }

    const result = await response.json();

    setImages(photos => [...photos, result]);
  }, []);
  const makeShot = React.useCallback(() => {
    const image = takeImage();
    uploadImage(image);
  }, [takeImage, uploadImage]);

  // Initial Images loading
  React.useEffect(() => {
    const syncImages = async () => {
      const response = await getAllPhotos();
      const parsed = await response.json();

      setImages(parsed);
    }
    syncImages()
  }, []);

  // Obtain Video Container Size
  React.useEffect(() => {
    const getVideoContainerSize = () => {
      if (!cameraContainerRef.current) {
        return;
      }

      const { width, height } = cameraContainerRef.current.getBoundingClientRect();
      setSize({ width, height });
    };
    requestAnimationFrame(getVideoContainerSize);
  }, [cameraContainerRef.current]);

  // Start video casting
  React.useEffect(() => {
    const startVideo = async () => {
      try {
        if (videoRef.current !== null && size !== null) {
          stream.current = await navigator.mediaDevices.getUserMedia({
            ...constraints,
            video: {
              ...constraints.video,
              ...size,
            },
          });
          videoRef.current.srcObject = stream.current;
          videoRef.current.play();
        }
      } catch (error) {
        console.log("Alert!", error);
      }
    };

    startVideo();
    return () => videoRef?.current?.pause();
  }, [videoRef.current, size]);

  // Load Shapes for TensorFlow
  React.useEffect(() => {
    const loadShapes = async () => {
      await faceApi.nets.faceExpressionNet.loadFromUri("/models")
      await faceApi.nets.faceLandmark68Net.loadFromUri("/models")
      await faceApi.nets.tinyFaceDetector.loadFromUri("/models")
      await faceApi.nets.ssdMobilenetv1.loadFromUri("/models");
      setLoadingShapes(false);
    };
    loadShapes();
  }, []);
  //
  // await Promise.all([
  //   load(faceapi.nets.tinyFaceDetector, tinyFaceDetectorModelUrl),
  //   load(faceapi.nets.ssdMobilenetv1, ssdMobilenetv1ModelUrl),
  //   load(faceapi.nets.mtcnn, mtcnnModelUrl),
  //   load(faceapi.nets.faceLandmark68Net, faceLandmarkModelUrl),
  //   load(faceapi.nets.faceRecognitionNet, faceRecognitionModelUrl),
  //   load(faceapi.nets.faceExpressionNet, faceExpessionModelUrl)
  // ])


  // Start Face Detection
  React.useEffect(() => {
    if (videoRef.current == null) {
      return;
    }

    const intervalId = setInterval(() => {
      const detectFaces = async () => {
        const detections = await faceApi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceExpressions();
        setVideoDetections(detections)
        console.log("Face API. Detections. Video.", detections);
      };

      detectFaces();
    }, 1000)

    return () => clearInterval(intervalId)
  }, [videoRef.current]);

  const faceBorders = React.useMemo(() => {
    if (!videoDetections || !cameraContainerRef.current) {
      return null
    }

    return videoDetections.map(detections => {
      const {relativeBox} = detections.detection
      return <FaceBorder
        item={cameraContainerRef.current}
        relativeWidth={relativeBox.width}
        relativeHeight={relativeBox.height}
        relativeTop={relativeBox.top}
        relativeLeft={relativeBox.left}
      />
    })
  }, [videoDetections, cameraContainerRef.current])
  if (loadingShapes) {
    return <Spin />;
  }

  return (
    <PageContainer>
      <CameraContainer ref={cameraContainerRef}>
        <video ref={videoRef} />
        {faceBorders}
      </CameraContainer>
      <CanvasHook ref={canvasHookRef} />

      <Controls>
        <Button type="primary" onClick={makeShot}>
          Take a photo
        </Button>
        <ImagesContainer>
          {images.map(image => (
            <PhotoItem onDelete={removeImageFromList} {...image} key={image.id} />
          ))}
        </ImagesContainer>
      </Controls>
    </PageContainer>
  );
};

export default Camera;
