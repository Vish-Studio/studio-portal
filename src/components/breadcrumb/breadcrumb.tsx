import { ArrowLeft } from "lucide-react";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";


interface Props {
  className?: string;
  previousLink: string;
  previousPageName: string;
  currentPageName: string;
}

const Breadcrumb: FunctionComponent<Props> = ({
  className,
  previousLink,
  previousPageName,
  currentPageName,
}) => {
  return (
    <div className={`breadcrumb flex items-center gap-3 ${className}`}>
      <Link
        to={previousLink}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 hover:border-gray-400 transition-colors shrink-0"
      >
        <ArrowLeft size={15} />
      </Link>
      <span className="text-sm text-gray-400 font-medium">{previousPageName}</span>
      <span className="text-gray-200">/</span>
      <span className="text-sm font-semibold text-gray-700 truncate">{currentPageName}</span>
    </div>
  )
}


export default Breadcrumb;
Breadcrumb.displayName = "Breadcrumb";