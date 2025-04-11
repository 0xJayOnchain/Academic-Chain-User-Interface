import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import { getContract } from "../utils/contract";

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WelcomeCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WelcomeText = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.cardTitle};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: underline;
  font-size: 0.875rem;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 4px solid ${({ theme }) => theme.colors.textSecondary};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [gpa, setGpa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const contract = await getContract();
        const signer = await contract.signer.getAddress();
        // Assume studentId 0 for demo; adjust based on user
        const studentData = await contract.getStudentData(0);
        setStudent({
          name: studentData.name,
          age: studentData.age,
          wallet: studentData.wallet,
          courses: studentData.courses,
        });
        const gpaData = await contract.getGPA(0);
        setGpa((gpaData / 100).toFixed(2));
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  if (loading || !student) return <Spinner />;

  return (
    <div>
      <WelcomeCard>
        <WelcomeText>Welcome back, {student.name} 👋</WelcomeText>
        <CardText>You've completed {student.courses.length} courses this semester!</CardText>
      </WelcomeCard>

      <StatsGrid>
        <StatCard>
          <StatValue>{student.courses.length}/5</StatValue>
          <StatLabel>Courses</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{student.age}</StatValue>
          <StatLabel>Age</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{gpa || "N/A"}</StatValue>
          <StatLabel>GPA</StatLabel>
          <Link to="/student/0">Go to report</Link>
        </StatCard>
      </StatsGrid>

      <Grid>
        <Card>
          <CardTitle>Courses</CardTitle>
          {student.courses.map((course, index) => (
            <CardText key={index}>
              {course.name} - Credits: {course.credits}, Grade: {course.grade}
            </CardText>
          ))}
          <Link to="/courses/0">Manage Courses</Link>
        </Card>
        <Card>
          <CardTitle>Student Info</CardTitle>
          <CardText>Name: {student.name}</CardText>
          <CardText>Wallet: {student.wallet.slice(0, 6)}...{student.wallet.slice(-4)}</CardText>
          <Link to="/student/0">More details</Link>
        </Card>
      </Grid>
    </div>
  );
}

export default Dashboard;