import MaterialIcon from "../ui/material-icon";


interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  iconName: string;
  clickHandler: () => void;
}

const baseStyles = "w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors shrink-0";

const ButtonIcon: React.FC<Props> = ({
  className = '',
  iconName,
  clickHandler,
  ...rest
}) => {
  return (
    <button onClick={clickHandler} className={`button-icon ${baseStyles} ${className}`} aria-label={iconName}
      {...rest}>
      <MaterialIcon name={iconName} size={18} />
    </button>
  );
};

export default ButtonIcon;