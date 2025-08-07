import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section skeleton */}
      <div className="py-12 md:py-20">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-6">
            <Skeleton className="h-12 w-3/4 max-w-xl" />
            <Skeleton className="h-6 w-2/3 max-w-md" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Features section skeleton */}
      <div className="py-12 md:py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events section skeleton */}
      <div className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="mb-8">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories section skeleton */}
      <div className="py-12 md:py-16">
        <div className="container">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-5 w-full max-w-md mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg p-4 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section skeleton */}
      <div className="py-12 md:py-16 bg-primary/10 rounded-lg mt-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <Skeleton className="h-8 w-full max-w-sm" />
              <Skeleton className="h-5 w-full mt-4" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
