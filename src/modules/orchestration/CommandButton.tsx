import Button, { ButtonProps } from '@mui/material/Button';
import styled from '@mui/material/styles/styled';

const CommandButton = styled((props: ButtonProps) => (
  <Button {...props} variant="contained">
    {props.children}
  </Button>
))(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

export default CommandButton;
