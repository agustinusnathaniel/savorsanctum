import { Search, X } from 'lucide-react';
import { type ChangeEventHandler, useEffect, useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
    setInput(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    setInput('');
  };

  useEffect(() => {
    setInput(initialValue ?? '');
  }, [initialValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape' && target === inputRef.current) {
          onChange('');
          setInput('');
          inputRef.current?.blur();
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  return (
    <InputGroup className="bg-background">
      <InputGroupInput
        ref={inputRef}
        value={input}
        placeholder="Search places or products… (press /)"
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
