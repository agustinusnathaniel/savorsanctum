import { CircleXIcon } from 'lucide-react';
import {
  type ChangeEventHandler,
  type ComponentProps,
  type ReactNode,
  useState,
} from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/lib/components/ui/input-group';

type TextFieldProps = ComponentProps<'input'> & {
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  prefixIcon?: ReactNode;
};

export const TextField = ({
  onClear,
  onValueChange,
  prefixIcon,
  ...props
}: TextFieldProps) => {
  const [value, setValue] = useState<string>('');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
    onValueChange?.(e.target.value);
  };
  const handleClear = () => {
    setValue('');
    onValueChange?.('');
    onClear?.();
  };

  return (
    <InputGroup>
      <InputGroupInput {...props} onChange={handleChange} value={value} />
      {prefixIcon ? <InputGroupAddon>{prefixIcon}</InputGroupAddon> : null}
      {value ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={handleClear}>
            <CircleXIcon />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
};
