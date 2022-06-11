import styled from "styled-components";

const TitleDiv = styled.h1`
    width: 100%;
`;

const MainContent = styled.div`
    width: 100%;
    margin:0;
`

const PageContainerDiv = styled.div`
    background-color: #ffffff; 
    display: flex;
    flex-direction:column;
    align-tiems: stretch;
    height: 100%;
    position: fixed;
    x-overflow: hidden;
    margin-left: 5em;
    padding-left: 10px;  
    overflow-y: auto;
    width: 100%;
`;

const PageContainer = ({children, title}) => {
    return(
        <PageContainerDiv>
            <TitleDiv>
                {title}
            </TitleDiv>
            <MainContent>{children}</MainContent>
        </PageContainerDiv>
    );
}

export default PageContainer;