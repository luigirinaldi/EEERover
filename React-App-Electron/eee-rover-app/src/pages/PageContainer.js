import styled from "styled-components";

const TitleDiv = styled.h1`
    width: 100%;
    flex: 0 1 auto;
`;

const MainContent = styled.div`
    width: 100%;
    margin:0;
    margin-bottom: 0.5em;
    flex: 1 1 auto;
`

const PageContainerDiv = styled.div`
    background-color: #ffffff; 
    display: flex;
    flex-direction:column;
    // align-items: stretch;
    height: 100vh;
    position: fixed;
    x-overflow: hidden;
    margin-left: 5em;
    
    padding-left: 10px;  
    overflow-y: hidden;
    width: 94%;
`;

const PageContainer = ({children, title}) => {
    return(
        <PageContainerDiv>
            <TitleDiv>
                {title}
            </TitleDiv>
            <MainContent>
                {children}
            </MainContent>
        </PageContainerDiv>
    );
}

export default PageContainer;