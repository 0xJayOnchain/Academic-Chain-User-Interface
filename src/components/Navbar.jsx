import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getContract } from "../utils/contract";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SearchBar = styled.input`
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  width: 200px;
  font-size: 0.875rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: 50%;
`;

function Navbar() {
    // Lets force student for now
  const studentId = 1;
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    const fetchStudentName = async () => {
      if (studentId) {
        console.log('Student ID:', studentId);
        try {
          const contract = await getContract();
          const { name } = await contract.getStudentData(studentId);
          setStudentName(name || "Student");
        } catch (error) {
          console.error("Error fetching student name:", error);
          setStudentName("Student");
        }
      }
    };
    fetchStudentName();
  }, [studentId]);

  return (
    <Nav>
      <SearchBar placeholder="Search" />
      <UserInfo>
        <span>{studentName}</span>
        <UserAvatar />
      </UserInfo>
    </Nav>
  );
}

export default Navbar;