import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-mesh flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex size-20 rounded-3xl bg-muted items-center justify-center mx-auto">
          <SearchX className="size-9 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-5xl font-black gradient-text mb-2">۴۰۴</h1>
          <h2 className="text-xl font-bold mb-2">صفحه یافت نشد</h2>
          <p className="text-muted-foreground text-sm">
            صفحه‌ای که دنبالش می‌گردید وجود ندارد یا منتقل شده است.
          </p>
        </div>
        <Button asChild variant="brand" size="lg">
          <Link href="/">
            <Home className="size-4" />
            بازگشت به داشبورد
          </Link>
        </Button>
      </div>
    </div>
  );
}
