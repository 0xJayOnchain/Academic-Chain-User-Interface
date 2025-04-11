import styled from "styled-components";

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
  return (
    <Nav>
      <SearchBar placeholder="Search" />
      <UserInfo>
        <span>James Dean</span>
        <UserAvatar />
      </UserInfo>
    </Nav>
  );
}

export default Navbar;