import { setIsChecked } from "../../store/mailSlice";
import { useDispatch } from "react-redux";
// import { SplitButton, Form, Dropdown } from "react-bootstrap";
import SplitButton from "react-bootstrap/SplitButton"
import Form from "react-bootstrap/Form"
import Dropdown from "react-bootstrap/Dropdown"

const DropdownMenu = ({filteredMails}) => {

  const dispatch = useDispatch();
  const checked = filteredMails.some((mail) => mail.isChecked === false);

  const selectHandler = (select) => {
    // console.log('clicked check')
    dispatch(setIsChecked({ id: null, selector: select }));
  };

  return (
    <SplitButton
      variant="light"
      title={
        <Form>
          <Form.Check
            onChange={() => selectHandler("MAIN-ALL")}
            checked={!checked && filteredMails.length > 0}
          />
        </Form>
      }
      className="p-0"
      disabled={filteredMails.length === 0}
    >
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("DROPDOWN-ALL")}
        eventKey="1"
      >
        All
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("read")}
        eventKey="3"
      >
        Read
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("unread")}
        eventKey="4"
      >
        Unread
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("starred")}
        eventKey="5"
      >
        Starred
      </Dropdown.Item>
      <Dropdown.Item
        as={"button"}
        onClick={() => selectHandler("UNSTARRED")}
        eventKey="6"
      >
        Unstarred
      </Dropdown.Item>
       <Dropdown.Item
        onClick={() => selectHandler("none")}
        as={"button"}
        eventKey="2"
      >
        Un-select all
      </Dropdown.Item>
    </SplitButton>
  );
};

export default DropdownMenu;
