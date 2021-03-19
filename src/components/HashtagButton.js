import {Button} from "@material-ui/core";

const HashtagButton = (props) => {
  const {value, setSelectedHashtag} = props;
  return (
    <Button
      style={{
        'textTransform': 'lowercase',
        'margin': '5px',
        'borderRadius': '20px',
        'minWidth': 'auto',
      }}
      variant='outlined'
      color='primary'
      key={value}
      onClick={(e) => {
        e.preventDefault();
        setSelectedHashtag(value);
      }}
    >
      {`#${value}`}
    </Button>
  );
}

export default HashtagButton;