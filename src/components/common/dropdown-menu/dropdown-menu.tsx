import { FunctionComponent } from 'react';

export interface DropdownMenuItemType {
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}

export interface DropdownMenuSectionType {
  header?: string;
  items: DropdownMenuItemType[];
}

interface DropdownMenuProps {
  sections: DropdownMenuSectionType[];
  width?: string;
  align?: 'left' | 'right';
  className?: string;
}

const DropdownMenu: FunctionComponent<DropdownMenuProps> = ({
  className = '',
  sections,
  width = 'w-48',
  align = 'right',
}) => {
  const alignClass = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      className={`dropdown-menu absolute ${alignClass} top-full mt-2 ${width} bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${className}`}
    >
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {sectionIndex > 0 && <div className="h-px bg-gray-100 my-1 w-full" />}
          {section.header && (
            <>
              <div className="px-4 py-2 font-semibold text-sm text-gray-800">{section.header}</div>
              <div className="h-px bg-gray-100 my-1 w-full" />
            </>
          )}
          {section.items.map((item, itemIndex) => (
            <button
              key={itemIndex}
              className={`w-full text-left px-4 py-2 text-sm transition-colors flex flex-col gap-0.5 ${item.danger
                ? 'font-medium text-red-600 hover:bg-red-50'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
              onClick={item.onClick}
            >
              <span>{item.label}</span>
              {item.description && (
                <span className="text-xs text-gray-500 font-normal">{item.description}</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
