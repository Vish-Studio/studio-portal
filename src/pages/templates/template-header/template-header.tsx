import { DocDivider } from "@/src/components/admin/templates/template-shell";
import { FunctionComponent } from "react";

type Info = {
  name: string;
  email: string;
  city: string;
  country?: string;
}

interface Props {
  className?: string;
  title: string;
  clientInfo: Info;
  clientSubtitle?: string;
  contractorInfo?: Info;
  contractorSubtitle?: string;
}


const TemplateHeader: FunctionComponent<Props> = ({
  className,
  title,
  clientSubtitle = 'To',
  contractorSubtitle = 'From',
  clientInfo,
  contractorInfo = {
    name: 'Vishroy Seenarain',
    email: 'hello@vish.studio',
    city: 'Grand Gaube',
    country: 'Mauritius'
  }
}) => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="template-header">
      {/* ── Title ── */}
      <h1 className="text-[56px] font-normal tracking-tight text-gray-900 mb-8 leading-none">
        {title}
      </h1>

      <DocDivider className="mb-8" />

      {/* ── Header ── */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">{clientSubtitle}</p>
          <p className="text-[13px] text-gray-800 leading-relaxed">
            {clientInfo.name} <br /> {clientInfo.email} <br /> {clientInfo.city} {clientInfo.country && (<>, {clientInfo.country}</>)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">{contractorSubtitle}</p>
          <p className="text-[13px] text-gray-800 leading-relaxed">
            {contractorInfo.name} <br /> {contractorInfo.email} <br /> {contractorInfo.city}, {contractorInfo.country}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-500 mb-2">Date</p>
          <p className="text-[13px] font-semibold text-gray-800">{formattedDate}</p>
        </div>
      </div>

      <DocDivider className="mb-10" />
    </div>
  )
}


export default TemplateHeader;
TemplateHeader.displayName = 'Template Header';