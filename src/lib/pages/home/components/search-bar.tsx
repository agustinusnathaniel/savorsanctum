'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/lib/components/ui/input-group';

interface SearchBarProps {
  onChange: (value: string) => void;
}

export function SearchBar({ onChange }: SearchBarProps) {
  const [input, setInput] = useState('');

  const handleClear = () => {
    onChange('');
    setInput('');
  };

  return (
    <InputGroup>
      <InputGroupInput
        value={input}
        placeholder="Search places or products..."
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={handleClear}>
          <X />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
