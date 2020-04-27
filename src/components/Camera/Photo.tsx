import * as React from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { DeleteFilled, CloudSyncOutlined } from "@ant-design/icons";
import { deletePhoto } from "../../requests/photos";

import * as faceApi from "face-api.js";
import { FaceDetection } from "face-api.js";
import FaceBorder from "./FaceBorder";

const Toolbar = styled.div`
  position: absolute;
  display: none;
`;
const ImageItem = styled.img``;
const Container = styled.div`
  display: flex;

  position: relative;

  width: 200px;
  height: 100px;

  background: rgba(0, 0, 0, 0.2);

  &:hover ${Toolbar} {
    display: block;
  }
`;

interface OwnProps {
  id: string;
  content: string;
  username?: string;
  timestamp?: string;

  onDelete: (id: String) => void;
  onEdit?: () => void;
  onResetPerson?: () => void;
}

export const PhotoItem: FunctionComponent<OwnProps> = ({ id, content, username, timestamp, onDelete, onEdit }) => {
  const imageRef = React.useRef<HTMLImageElement>();
  const [detections, setDetections] = React.useState<Array<FaceDetection>>();

  React.useEffect(() => {
    if (!content || !imageRef.current) {
      return;
    }

    const detectFaces = async () => {
      // @ts-ignore
      const result = await faceApi.detectAllFaces(imageRef.current);
      setDetections(result);
    };
    detectFaces();
  }, [imageRef, content]);

  const faceBoxes = React.useMemo(() => {
    if (!detections || !imageRef.current) {
      return null;
    }
    return detections?.map(({ relativeBox }) => (
      <FaceBorder
        id={id}
        item={imageRef.current}
        relativeWidth={relativeBox.width}
        relativeHeight={relativeBox.height}
        relativeTop={relativeBox.top}
        relativeLeft={relativeBox.left}
      />
    ));
  }, [detections]);

  const deleteHandler = React.useCallback(async () => {
    await deletePhoto(id);
    onDelete(id);
  }, [id]);

  return (
    <Container>
      <ImageItem id={id} ref={imageRef} src={content} alt={username ?? "unrecognized photo"} />
      {faceBoxes}
      <Toolbar>
        <DeleteFilled onClick={deleteHandler} />
        <CloudSyncOutlined />
      </Toolbar>
    </Container>
  );
};

export default PhotoItem;
