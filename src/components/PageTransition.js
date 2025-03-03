import { Slide } from '@mui/material';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <Slide
      direction="left"
      in={true}
      mountOnEnter
      unmountOnExit
      timeout={300}
    >
      <div>{children}</div>
    </Slide>
  );
};

export default PageTransition;
