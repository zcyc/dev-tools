import Link from 'next/link';

// This page renders when a route like `/unknown` is accessed.
// Since we use a `[locale]` segment, this will only apply to
// routes that are not matched by any page.

export default function NotFound() {
  return (
    <html lang="zh">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">页面未找到</h1>
            <p className="text-muted-foreground mb-8">您访问的页面不存在</p>
            <Link 
              href="/zh" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              返回首页
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}