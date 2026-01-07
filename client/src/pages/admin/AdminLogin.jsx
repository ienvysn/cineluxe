import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Film, Lock, User, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        const userData = {
          name: 'Admin User',
          email: 'admin@cineluxe.com',
          role: 'admin'
        };

        localStorage.setItem('cineluxe_token', mockToken);
        localStorage.setItem('cineluxe_user', JSON.stringify(userData));

        toast.success('Login Successful', {
          description: 'Welcome to the admin panel.',
        });
        navigate('/admin');
      } else {
        toast.error('Login Failed', {
          description: 'Invalid username or password.',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-glow-pulse" />

      <div className="w-full max-w-md animate-fade-in relative z-10">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Main Page
        </Link>

        <div className="glass-card p-10 relative overflow-hidden border-white/5 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gold-gradient mb-6 shadow-xl">
              <Film className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Admin <span className="text-primary italic">Login</span></h1>
            <p className="text-muted-foreground mt-3 font-light">Please sign in to manage your cinema.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Username</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 bg-white/5 border-white/5 h-12 rounded-xl focus:border-primary/30 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 bg-white/5 border-white/5 h-12 rounded-xl focus:border-primary/30 transition-all"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="gold" size="xl" className="w-full mt-4 font-bold tracking-widest uppercase text-xs h-14" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
             <p className="text-[9px] text-muted-foreground uppercase tracking-[2px] font-bold">Demo Credentials</p>
             <div className="flex gap-4">
                <div className="text-[10px] text-muted-foreground"><span className="text-primary font-bold">User:</span> admin</div>
                <div className="text-[10px] text-muted-foreground"><span className="text-primary font-bold">Pass:</span> admin123</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
