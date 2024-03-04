import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface DoneProps {
  type: true | false;
}

const Done = ({ type }: DoneProps) => {
  const styleDiv = type === true ? "bg-green-500" : "border-2";

  return (
    <div
      className={`relative w-6 h-6 ${styleDiv} text-white rounded-full mr-3`}
    >
      <FontAwesomeIcon
        icon={faCheck}
        className="absolute text-xs top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default Done;
