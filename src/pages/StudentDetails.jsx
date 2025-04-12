import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import { getContract } from "../utils/contract";

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SubHeading = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.subheading};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Button = styled(RouterLink)`
  background-color: ${({ color, theme }) => color || theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  font-weight: 500;
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: inline-block;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
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

function StudentDetails() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [gpa, setGpa] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const contract = await getContract();
        const studentData = await contract.getStudentData(studentId);
        setStudent({
          name: studentData.name,
          age: studentData.age,
          wallet: studentData.wallet,
          courses: studentData.courses,
        });
        const gpaData = await contract.getGPA(studentId);
        setGpa((gpaData / 100).toFixed(2));
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudent();
  }, [studentId]);

  if (!student) return <Spinner />;

  return (
    <div>
      <Heading>Student Details</Heading>
      <Card>
        <CardTitle>{student.name}</CardTitle>
        <CardText>Age: {student.age}</CardText>
        <CardText>Wallet: {student.wallet.slice(0, 6)}...{student.wallet.slice(-4)}</CardText>
        <CardText>GPA: {gpa || "N/A"}</CardText>
        <Button to={`/courses/${studentId}`} color={theme.colors.primary}>
          Manage Courses
        </Button>
      </Card>

      <SubHeading>Courses</SubHeading>
      <Grid>
        {student.courses.map((course, index) => (
          <Card key={index}>
            <CardTitle>{course.name}</CardTitle>
            <CardText>Credits: {course.credits}</CardText>
            <CardText>Grade: {course.grade}</CardText>
          </Card>
        ))}
      </Grid>
    </div>
  );
}

export default StudentDetails;