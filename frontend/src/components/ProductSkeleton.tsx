import { Skeleton } from './ui/skeleton';

export function ProductSkeleton() {
  return (
    <div className="frosted-glass border border-white/30 rounded-sm overflow-hidden h-full flex items-center justify-center p-8">
      <p className="text-[#262930]" style={{ fontSize: '16px' }}>
        Loading...
      </p>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <p className="text-[#262930]" style={{ fontSize: '16px' }}>
        Loading...
      </p>
    </div>
  );
}
