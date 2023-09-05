import { React } from "react";
import styled from "styled-components";
// Bar Styled Component
const Bar = styled.div`
    height: 2em;
    border-radius: 0.5em;
    background: linear-gradient(
        90deg,
        rgba(109, 227, 219, 1) 0%,
        rgba(132, 115, 177, 1) 100%,
        rgba(3, 9, 112, 1) 100%
    );
`;
const LoadingBar = ({ currentProgress }) => {
    //Width State
    return <Bar style={{ width: currentProgress + "%" }}></Bar>;
};
export default LoadingBar;
