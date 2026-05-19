import { FunctionComponent } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  status: 'active' | 'inactive' | 'pending';
}

const StatusIcon: FunctionComponent<Props> = ({
  className,
  status,
  ...rest
}) => {

  const color = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-500',
  }[status];

  return (
    <div
      className={`status-icon w-2 h-2 rounded-full ${color} ${className || ''}`}
      {...rest}
    />
  );
}


export default StatusIcon;