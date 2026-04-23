import MaterialIcon from "../../ui/material-icon";


interface Props {
  className?: string;
  title: string;
  iconName: string;
  children?: React.ReactNode;
}

const CardHeader: React.FC<Props> = ({
  className = '',
  title,
  iconName,
  children
}) => {
  return (
    <div className={`px-4 md:px-6 py-4 md:py-6 flex items-center justify-between shrink-0 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-(--color-ink)">
        <MaterialIcon name={iconName} size={20} />
        <span className="text-[16px] font-semibold">{title}</span>
      </div>

      {children}
    </div>
  )
}


export default CardHeader;