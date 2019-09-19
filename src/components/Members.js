import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
  InviteWindow,
  CloseContainer,
  InviteCloseSvg,
  Content,
  Container,
  Title
} from "./Invite/Invite";
import { API_URL } from "../api/index";
import Alert from "./Alert/Alert";

const MemberWindow = styled(InviteWindow)``;
const MemberWindowCloseSvg = styled(InviteCloseSvg)``;

const OuterContainer = styled(Container)`
  max-width: 60rem;
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  background: #cce5ff;
  font-family: "Roboto", sans-serif;
  padding: 1rem;
  :nth-of-type(even) {
    background: white;
  }
`;
const MemberContainer = styled.div`
  margin-top: 2rem;
`;
const LoaderContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 80px);
  grid-row-gap: 10px;
  margin-top: 2rem;
  grid-template-columns: minmax(100px, 600px);
`;

const Name = styled.h2`
  font-size: 2rem;
`;

const Email = styled.p`
  font-size: 1.5rem;
  color: var(--font-color);
`;

function Members(props) {
  const [dataFetchingError, updateDateError] = useState(null);
  const [isFetching, updateFetchingState] = useState(true);
  const [memberData, updateMemberData] = useState([]);
  const [serverError, updateServerErrorMessage] = useState({
    status: false,
    message: null
  });
  const { hideMemberWindow } = props;

  useEffect(() => {
    const { tripId } = props;
    document.body.style.overflow = "hidden";

    async function fetchMemberData() {
      try {
        const response = await fetch(`${API_URL}/members/${tripId}`);
        const responseObject = await response.json();
        updateFetchingState(false);

        if (response.status === 200) {
          updateMemberData(responseObject.data);
        } else {
          updateServerErrorMessage({
            message: responseObject.msg,
            status: true
          });
        }
      } catch (e) {
        updateFetchingState(false);
        updateServerErrorMessage({
          message: "Server is down. Please try after some time",
          status: true
        });
      }
    }
    fetchMemberData();
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <MemberWindow>
      <CloseContainer
        onClick={() => {
          hideMemberWindow("showMemberWindow");
        }}
      >
        <MemberWindowCloseSvg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 352 512"
        >
          <path
            fill="currentColor"
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
          ></path>
        </MemberWindowCloseSvg>
      </CloseContainer>
      <Content>
        <OuterContainer>
          <Title>Members</Title>
          <>
            {serverError.status ? (
              <Alert type="error" message={serverError.message} />
            ) : (
              <>
                {isFetching ? (
                  <LoaderContainer>
                    <div className="loadingDiv" />
                    <div className="loadingDiv" />
                    <div className="loadingDiv" />
                  </LoaderContainer>
                ) : (
                  <MemberContainer>
                    {memberData.map(member => {
                      return (
                        <MemberInfo key={member.id}>
                          <Name>{member.name}</Name>
                          <Email>{member.email}</Email>
                        </MemberInfo>
                      );
                    })}
                  </MemberContainer>
                )}
              </>
            )}
          </>
        </OuterContainer>
      </Content>
    </MemberWindow>
  );
}

export default Members;
