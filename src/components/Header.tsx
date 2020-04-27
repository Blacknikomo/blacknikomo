import * as React from "react";
import { Link } from "gatsby";
import { Layout, Menu } from "antd";
import styled from "styled-components";

import "modern-normalize";
import "../styles/normalize";

const { Header } = Layout;

const TopHeader = styled(Header)`
  height: auto;
`;

const activeStyle = {
  color: "white",
  height: "100%",
  width: "100%",
};

const MenuItem = styled(Menu.Item)`
  padding: 0;
`;

const StyledLink = styled(Link)`
  padding: 0 20px;
  &:hover {
    background-color: #1769aa;
    text-decoration: none;
  }
`;

const HeaderSection: React.FC = () => {
  return (
    <TopHeader>
      <Menu theme="dark" mode="horizontal">
        <MenuItem key="1">
          <StyledLink to="/" activeStyle={activeStyle}>
            Home
          </StyledLink>
        </MenuItem>
        <MenuItem key="2">
          <StyledLink to="/video" activeStyle={activeStyle}>
            Video
          </StyledLink>
        </MenuItem>
      </Menu>
    </TopHeader>
  );
};

export default HeaderSection;
