import { ArrowLeft } from '@/src/shared/components/material-icon/material-lucide-icons';
import { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";


interface Props {
  className?: string;
  previousLink: string;
  previousPageName: string;
  currentPageName: string;
  action?: ReactNode;
}

const Breadcrumb: FunctionComponent<Props> = ({
  className,
  previousLink,
  previousPageName,
  currentPageName,
  action,
}) => {
  return (
    <div
      className={cn(
        "breadcrumb sticky top-0 z-30 -mx-4 flex w-auto items-center justify-between gap-4 bg-white px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
        className,
      )}
    >
      <div className="breadcrumb-path flex min-w-0 items-center gap-3">
        <Link
          to={previousLink}
          className="breadcrumb-back flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-800"
        >
          <ArrowLeft size={15} />
        </Link>
        <span className="breadcrumb-previous text-sm font-medium text-gray-400">{previousPageName}</span>
        <span className="breadcrumb-separator text-gray-200">/</span>
        <span className="breadcrumb-current truncate text-sm font-semibold text-gray-700">{currentPageName}</span>
      </div>
      {action && <div className="breadcrumb-action shrink-0">{action}</div>}
    </div>
  )
}


export default Breadcrumb;
Breadcrumb.displayName = "Breadcrumb";
