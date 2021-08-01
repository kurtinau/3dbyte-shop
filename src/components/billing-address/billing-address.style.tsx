import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const RowFieldWrapper = styled.div`
  display: felx;
  flex-direction: row;
  margin-bottom: 15px;
  justify-content: space-between;
`;

const FirstnameWrapper = styled.div`
  margin-right: 10px;
  flex-grow: 1;
`;

const LastnameWrapper = styled.div`
  flex-grow: 1;
`;

const StateWrapper = styled.div`
  margin-right: 10px;
  flex-grow: 2;
`;

const PostcodeWrapper = styled.div`
  flex-grow: 1;
`;

export {
  FieldWrapper,
  RowFieldWrapper,
  FirstnameWrapper,
  LastnameWrapper,
  StateWrapper,
  PostcodeWrapper,
};
