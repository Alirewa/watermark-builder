'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-mesh flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex size-20 rounded-3xl bg-destructive/10 items-center justify-center mx-auto">
          <AlertTriangle className="size-9 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">خطایی رخ داد</h2>
          <p className="text-muted-foreground text-sm">
            متأسفانه مشکلی پیش آمده. لطفاً دوباره تلاش کنید.
          </p>
        </div>
        <Button onClick={reset} variant="brand" size="lg">
          <RotateCcw className="size-4" />
          تلاش مجدد
        </Button>
      </div>
    </div>
  );
}
