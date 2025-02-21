import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

const ToggleContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  background: ${({ theme }) => (theme === "light" ? "#f1c40f" : "#2c3e50")};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease, transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.1);
  }

  svg {
    font-size: 1.5rem;
    color: ${({ theme }) => (theme === "light" ? "#000" : "#fff")};
  }
`;

export const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <ToggleContainer theme={theme} onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <FaSun />}
        </ToggleContainer>
    );
};
