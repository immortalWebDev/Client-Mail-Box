// import { Button } from "react-bootstrap";
import Button from "react-bootstrap/Button"
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/authSlice";

const Logout = () => {
  
  const dispatch = useDispatch();
  const history = useHistory();

  const logoutHandler = () => {

    localStorage.setItem("manualLogout", true);
    dispatch(logout());
    history.replace("/auth");
    
  };
  return (
    <Button
      onClick={logoutHandler}
      variant="light"
      className="border-2 rounded-2 bg-danger text-light"
    >
      Logout
    
    </Button>
  );
};

export default Logout;
