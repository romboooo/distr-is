// src/components/forms/account-type-field.tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RegisterFormValues } from '@/services/schemas';
import { User, Music } from 'lucide-react';
import type { Control } from 'react-hook-form';

interface AccountTypeFieldProps {
  control: Control<RegisterFormValues>;
}

export function AccountTypeField({ control }: AccountTypeFieldProps) {
  return (
    <FormField
      control={control}
      name='type'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select account type' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value='ARTIST'>
                <div className='flex items-center'>
                  <User className='mr-2 w-4 h-4' />
                  Artist
                </div>
              </SelectItem>
              <SelectItem value='LABEL'>
                <div className='flex items-center'>
                  <Music className='mr-2 w-4 h-4' />
                  Label
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
