import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

const SidebarWrapper = styled.aside`
  width: 80px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-right: 1px solid ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NavItem = styled(RouterLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
  &:hover:not(.active) {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const NavLabel = styled.span`
  font-size: 0.75rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

function Sidebar() {
  return (
    <SidebarWrapper>
      <Logo>AC</Logo>
      <NavItem to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 2.83L18 11v7H6v-7l6-6.17z" />
        </svg>
        <NavLabel>Home</NavLabel>
      </NavItem>
      <NavItem to="/students">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <NavLabel>Students</NavLabel>
      </NavItem>
    </SidebarWrapper>
  );
}

export default Sidebar;