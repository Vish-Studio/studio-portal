import { forwardRef, type InputHTMLAttributes } from 'react';
import { inputCls } from '../form-field/form-field';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ hasError = false, className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`${inputCls(hasError)} ${className}`}
      {...props}
    />
  ),
);

TextInput.displayName = 'TextInput';

export default TextInput;
