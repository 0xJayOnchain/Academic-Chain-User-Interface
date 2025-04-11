import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.grayLight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.brand};
`;

function App() {
  return (
    <Container>
      <Title>AcademicChain UI</Title>
    </Container>
  );
}

export default App;