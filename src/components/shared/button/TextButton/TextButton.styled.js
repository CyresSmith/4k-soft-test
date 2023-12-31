import styled from '@emotion/styled';
import theme from 'theme';

export const ButtonBox = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${p => (p.color ? p.color : theme.colors.primary.regular)};
  transition: ${theme.transition.primary};
  padding: ${theme.space[1]} ${theme.space[2]};
  border-radius: 19.5px;

  svg {
    transition: ${theme.transition.primary};
    color: ${p => (p.color ? p.color : theme.colors.black)};
    transform-origin: center;
  }

  :disabled {
    pointer-events: none;
  }

  :hover:not(:disabled) {
    background-color: ${theme.colors.primary.light};

    svg {
      fill: ${theme.colors.primary.regular};
    }

    span {
      color: ${theme.colors.primary.regular};
    }
  }
`;

export const Text = styled.span`
  color: ${p => (p.color ? p.color : theme.colors.black)};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.l};
  font-weight: ${theme.fontWeights.regular};
  transition: ${theme.transition.primary};
  margin-left: ${p => (p.isIconThere ? theme.space[2] : theme.space[0])};
`;
