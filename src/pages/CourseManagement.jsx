import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const FormCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
`;

const Button = styled.button`
  background-color: ${({ color, theme }) => color || theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
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

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CardTitle = styled.h4`
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

function CourseManagement() {
  const { studentId } = useParams();
  const [form, setForm] = useState({ name: "", credits: "", grade: "" });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const contract = await getContract();
        const { courses: studentCourses } = await contract.getStudentData(studentId);
        setCourses(studentCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [studentId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contract = await getContract();
      await contract.addCourse(
        studentId,
        form.name,
        parseInt(form.credits),
        parseInt(form.grade)
      );
      setForm({ name: "", credits: "", grade: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleRemove = async (courseIndex) => {
    try {
      const contract = await getContract();
      await contract.removeCourse(studentId, courseIndex);
      window.location.reload();
    } catch (error) {
      console.error("Error removing course:", error);
    }
  };

  return (
    <div>
      <Heading>Manage Courses for Student #{studentId}</Heading>
      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Course Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Enter course name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Credits</Label>
            <Input
              name="credits"
              type="number"
              value={form.credits}
              onChange={handleInputChange}
              placeholder="Enter credits"
              min={1}
              max={10}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Grade</Label>
            <Input
              name="grade"
              type="number"
              value={form.grade}
              onChange={handleInputChange}
              placeholder="Enter grade"
              min={0}
              max={100}
              required
            />
          </FormGroup>
          <Button type="submit">Add Course</Button>
        </Form>
      </FormCard>

      <SubHeading>Course List</SubHeading>
      <Grid>
        {courses.map((course, index) => (
          <Card key={index}>
            <CardTitle>{course.name}</CardTitle>
            <CardText>Credits: {course.credits}</CardText>
            <CardText>Grade: {course.grade}</CardText>
            <Button onClick={() => handleRemove(index)} color={theme.colors.textSecondary}>
              Remove
            </Button>
          </Card>
        ))}
      </Grid>
    </div>
  );
}

export default CourseManagement;