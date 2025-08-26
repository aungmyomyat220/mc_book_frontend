'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {

  const router = useRouter();
  const handleClick = () => {
    if(typeof window !== 'undefined'){
      localStorage.setItem('admin_logged_in', 'true');
    }
    router.push('/admin/dashboard');
  };
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <span>Myanmar</span>
            <span className="text-red-500">Comic</span>
          </CardTitle>
          <CardDescription>Login to your account!</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleClick}
                >
                  Login
                </Button>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
