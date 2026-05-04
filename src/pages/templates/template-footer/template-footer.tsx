import { FunctionComponent } from "react";


interface Props {
  className?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}


const TemplateFooter: FunctionComponent<Props> = ({
  className,
  name = 'Vishroy Seenarain',
  email = 'hello@vish.studio',
  phoneNumber = '+230-5936-8556'
}) => {
  return (
    <footer className="flex items-center justify-between">
      <div className="logo w-10 h-10">
        <img src="/assets/logo-black-trans.png" />
      </div>

      <div className="text-right">
        <p className="font-bold text-2xl text-gray-900 mb-2">Thank You!</p>
        <p className="text-[12px] text-gray-500">{name} <br /> {email} // {phoneNumber}</p>
      </div>
    </footer>
  )
}

export default TemplateFooter;