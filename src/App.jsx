// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import StudentDashboard from "./pages/StudentDashboard";
import StudentManagement from "./pages/StudentManagement";
import CourseManagement from "./pages/CourseManagement";
import StudentDetails from "./pages/StudentDetails";

const AppWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

function App() {
  return (
    <Router>
      <AppWrapper>
        <Sidebar />
        <MainContent>
          <Navbar />
          <Container>
            <Routes>
              <Route path="/" element={<StudentManagement />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/courses/:studentId" element={<CourseManagement />} />
              <Route path="/student/:studentId" element={<StudentDetails />} />
            </Routes>
          </Container>
        </MainContent>
      </AppWrapper>
    </Router>
  );
}

export default App;