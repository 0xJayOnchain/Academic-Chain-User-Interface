import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  &:disabled {
    background-color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const EditButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const RemoveButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.red};
`;

const MoreDetailsButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.textSecondary};
`;

const AddCourseButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.green};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
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
  ${({ truncate }) => truncate && "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

function StudentManagement() {
  const [form, setForm] = useState({ id: "", name: "", age: "", wallet: "" });
  const [students, setStudents] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStudents = async () => {
      const contract = await getContract();
      const studentCount = await contract.studentCount();
      const studentList = [];
      for (let i = 0; i < studentCount; i++) {
        const { name, age, wallet, exists } = await contract.getStudentData(i);
        if (exists) studentList.push({ id: i, name, age: age.toString(), wallet });
      }
      setStudents(studentList);
    };
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contract = await getContract();
      if (isUpdate) {
        await contract.updateStudent(form.id, form.name, parseInt(form.age), form.wallet);
      } else {
        await contract.addStudent(form.name, parseInt(form.age), form.wallet);
      }
      setForm({ id: "", name: "", age: "", wallet: "" });
      setIsUpdate(false);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (student) => {
    setForm(student);
    setIsUpdate(true);
  };

  const handleRemove = async (id) => {
    try {
      const contract = await getContract();
      await contract.removeStudent(id);
      window.location.reload();
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

    const handleMoreDetails = (id) => {
        navigate(`/student/${id}`);
    };

    const handleAddCourse = async (id) => {
        navigate(`/courses/${id}`);
    };

  return (
    <div>
      <Heading>Manage Students</Heading>
      <FormCard>
        <Form onSubmit={handleSubmit}>
          {isUpdate && (
            <FormGroup>
              <Label>Student ID</Label>
              <Input name="id" value={form.id} disabled />
            </FormGroup>
          )}
          <FormGroup>
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Age</Label>
            <Input
              name="age"
              type="number"
              value={form.age}
              onChange={handleInputChange}
              placeholder="Enter age"
              min={16}
              max={150}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Wallet Address</Label>
            <Input
              name="wallet"
              value={form.wallet}
              onChange={handleInputChange}
              placeholder="Enter wallet address"
              required
            />
          </FormGroup>
          <Button type="submit">
            {isUpdate ? "Update Student" : "Add Student"}
          </Button>
        </Form>
      </FormCard>

      <SubHeading>Student List</SubHeading>
      <Grid>
        {students.map((student) => (
          <Card key={student.id}>
            <CardTitle>{student.name}</CardTitle>
            <CardText>Age: {student.age}</CardText>
            <CardText truncate>Wallet: {student.wallet}</CardText>
            <ButtonGroup>
              <EditButton onClick={() => handleEdit(student)}>
                Edit
              </EditButton>
              <RemoveButton onClick={() => handleRemove(student.id)}>
                Remove
              </RemoveButton>
              <MoreDetailsButton onClick={() => handleMoreDetails(student.id)}> 
                More Details
              </MoreDetailsButton>
              <AddCourseButton onClick={() => handleAddCourse(student.id)}> 
                Add Course
              </AddCourseButton>
            </ButtonGroup>
          </Card>
        ))}
      </Grid>
    </div>
  );
}

export default StudentManagement;