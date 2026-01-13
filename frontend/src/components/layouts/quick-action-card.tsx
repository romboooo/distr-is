import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickActionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export function QuickActionCard({
  title,
  description,
  onClick,
}: QuickActionCardProps) {
  return (
    <Card
      className='hover:shadow-md transition-shadow cursor-pointer'
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className='text-lg'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </CardContent>
    </Card>
  );
}
