import { TailSpin } from "react-loader-spinner";
import styled from "styled-components";
const Loading = ({ height, width, color }) => {
  return (
    <Wrapper className={height ? null : "full-page"}>
      <TailSpin
        visible={true}
        height={height ? height : "80"}
        width={width ? width : "80"}
        color={color ? color : "#4fa94d"}
        ariaLabel="tail-spin-loading"
        radius={"10"}
        wrapperStyle={{}}
        wrapperClass=""
      />
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Loading;
