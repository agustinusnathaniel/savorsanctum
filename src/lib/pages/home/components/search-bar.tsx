'use client';

import { Search, X } from 'lucide-react';
import { type ChangeEventHandler, useState } from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/lib/components/ui/input-group';

interface SearchBarProps {
  initialValue: string | undefined;
  onChange: (value: string) => void;
}

export function SearchBar({ initialValue, onChange }: SearchBarProps) {
  const [input, setInput] = useState(initialValue ?? '');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
    setInput(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    setInput('');
  };

  return (
    <InputGroup>
      <InputGroupInput
        value={input}
        placeholder="Search places or products..."
        onChange={handleChange}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {input.length ? (
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={handleClear}>
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}
