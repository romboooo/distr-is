import { LabelReleaseForm } from '@/components/label/label-release-form';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_label/label/releases/new')({
  component: ReleaseNewPage,
})

function ReleaseNewPage() {
  return (
    <div className='py-8 container'>
      <div className='mx-auto max-w-4xl'>
        <LabelReleaseForm />
      </div>
    </div>
  );
}
