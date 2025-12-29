import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { RegisterFormValues } from '@/services/schemas';
import type { Control } from 'react-hook-form';

interface ArtistFieldsProps {
  control: Control<RegisterFormValues>;
  isSubmitting: boolean;
}

export function ArtistFields({ control, isSubmitting }: ArtistFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Artist Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Stage name or band name"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="realName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Legal Name (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Your legal name"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input
                placeholder="Country of origin"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
