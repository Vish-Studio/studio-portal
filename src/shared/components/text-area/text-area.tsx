import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { inputCls } from '../form-field/form-field';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ hasError = false, className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`${inputCls(hasError)} resize-none ${className}`}
      {...props}
    />
  ),
);

TextArea.displayName = 'TextArea';

export default TextArea;
