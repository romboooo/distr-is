import { createFileRoute } from '@tanstack/react-router';

export const HomePage = () => {
  return <div>hello from home!</div>;
};

export const Route = createFileRoute('/')({
  component: HomePage,
});
