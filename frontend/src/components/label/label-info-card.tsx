import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import type { UserWithDetails } from '@/hooks/use-user-detail-hooks';
import { SelfLabelCreationDialog } from '@/components/artist/self-label-creation-dialog';

interface LabelInfoCardProps {
  userData: UserWithDetails;
  onLabelCreated: () => void;
}

export function LabelInfoCard({ userData, onLabelCreated }: LabelInfoCardProps) {
  const navigate = useNavigate();

  // Helper function to get label details for artists
  const getArtistLabelName = (user: UserWithDetails) => {
    if (user.type === 'ARTIST' && user.artistDetails?.labelId) {
      return "Associated Label";
    }
    return null;
  };

  const hasLabel = userData.type === 'LABEL' || getArtistLabelName(userData);
  const isLabelOwner = userData.type === 'LABEL';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Label Information</CardTitle>
        <CardDescription>
          {hasLabel
            ? "Your current label information"
            : "Create your own label to manage releases"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasLabel ? (
          <div className="space-y-3">
            {isLabelOwner && userData.type === 'LABEL' && userData.labelDetails ? (
              <>
                <div>
                  <Label className="text-muted-foreground">Label Name</Label>
                  <p className="mt-1 font-medium">{userData.labelDetails.contactName || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Country</Label>
                  <p className="mt-1 font-medium">{userData.labelDetails.country || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact Phone</Label>
                  <p className="mt-1 font-medium">{userData.labelDetails.phone || 'N/A'}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => navigate({ to: '/label/profile' })}
                >
                  Manage Label
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-muted-foreground">Label Status</Label>
                  <p className="mt-1 font-medium">Signed to a label</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Label Name</Label>
                  <p className="mt-1 font-medium">{getArtistLabelName(userData) || 'N/A'}</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  disabled
                >
                  Contact Label Manager
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-destructive/10 p-4 border border-destructive/20 rounded-lg">
              <h3 className="font-medium text-destructive">No Label Associated</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                You don&apos;t have a label yet. Create a self-label to start managing your releases independently.
              </p>
            </div>

            <SelfLabelCreationDialog
              userId={userData.id}
              artistDetails={userData.type === 'ARTIST' ? userData.artistDetails : undefined}
              onLabelCreated={onLabelCreated}
            />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Feature coming soon: Sign with existing label')}
              disabled
            >
              Sign with Existing Label
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
