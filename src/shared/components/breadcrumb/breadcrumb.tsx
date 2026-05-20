import { ArrowLeft } from '@/src/shared/components/material-icon/material-lucide-icons';
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";


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
    <div
      className={cn(
        "breadcrumb sticky top-0 z-30 -mx-4 flex w-auto items-center gap-3 bg-white px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
        className,
      )}
    >
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
  )
}


export default Breadcrumb;
Breadcrumb.displayName = "Breadcrumb";
