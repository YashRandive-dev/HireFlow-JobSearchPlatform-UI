export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-600" />
    </div>
  );
}
