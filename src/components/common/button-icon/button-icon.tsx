import MaterialIcon from "../material-icon/material-icon";


interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  iconName: string;
  label?: string;
  children?: React.ReactNode;
  clickHandler: () => void;
}

const baseStyles = "relative w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors shrink-0";

const ButtonIcon: React.FC<Props> = ({
  className = '',
  iconName,
  label,
  clickHandler,
  children,
  ...rest
}) => {
  return (
    <button
      className={`button-icon ${baseStyles} ${className}`}
      onClick={clickHandler}
      aria-label={rest['aria-label'] ?? label ?? iconName}
      {...rest}>
      <MaterialIcon name={iconName} size={18} />
      {children}
    </button>
  );
};

export default ButtonIcon;
