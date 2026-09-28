import LeadForm from './LeadForm';

export default async function LeadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <LeadForm />;
}
