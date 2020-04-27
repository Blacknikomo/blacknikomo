import * as React from "react";
import useMeasure from "../../hooks/useMeasure";
import styled from "styled-components";

const FaceBox = styled.div`
  position: absolute;

  width: ${(props: DOMRect) => props.width}px;
  height: ${(props: DOMRect) => props.height}px;
  top: ${(props: DOMRect) => props.top}px;
  left: ${(props: DOMRect) => props.left}px;

  border: 1px solid yellow;
`;

interface OwnProps {
  id?: string;

  item: React.ElementRef<any>;
  relativeWidth: number;
  relativeHeight: number;
  relativeTop: number;
  relativeLeft: number;
}

const FaceBorder: React.FunctionComponent<OwnProps> = ({ item, relativeHeight, relativeWidth, relativeLeft, relativeTop }) => {
  const box = useMeasure(item);

  const faceBox = React.useMemo(() => {
    if (!box) {
      console.warn("Box2 model could not be retrieved");
      return null;
    }

    const width = relativeWidth * box?.width ?? null;
    const height = relativeHeight * box?.height ?? null;
    const top = relativeTop * box?.height ?? null;
    const left = relativeLeft * box?.width ?? null;

    return {
      width,
      height,
      top,
      left,
    };
  }, [box, relativeTop, relativeHeight, relativeWidth, relativeLeft]);

  if (!box || !faceBox) {
    console.warn("Box model could not be retrieved");
    return null;
  }

  return <FaceBox key={faceBox.height + faceBox.width} {...faceBox} />;
};
export default FaceBorder;
