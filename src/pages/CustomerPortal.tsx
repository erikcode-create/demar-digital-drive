import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  User,
  Package,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CustomerPortal = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      toast.error('Please sign in to access the customer portal');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Successfully signed out');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--surface))]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[hsl(var(--accent))] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockShipments = [
    {
      id: 'DM-2025-001',
      status: 'In Transit',
      origin: 'Dallas, TX',
      destination: 'Miami, FL',
      pickupDate: '2025-01-30',
      deliveryDate: '2025-02-02',
      type: 'Dry Van'
    },
    {
      id: 'DM-2025-002',
      status: 'Delivered',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      pickupDate: '2025-01-28',
      deliveryDate: '2025-01-30',
      type: 'Reefer'
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-low))]">
      <div>
        <Header />

        {/* Portal header bar */}
        <div className="pt-28 pb-8 px-4 bg-[hsl(225_97%_4%)]">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[hsl(var(--accent))] mb-2">
                  Customer Portal
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-white/40 mt-1">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 -mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Active Shipments */}
              <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="h-5 w-5 text-[hsl(var(--accent))]" />
                  <h2 className="text-base font-semibold text-[hsl(var(--primary))]">Active Shipments</h2>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-5">Track your current shipments</p>

                <div className="space-y-3">
                  {mockShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="p-4 rounded-lg bg-[hsl(var(--surface-low))] hover:bg-[hsl(var(--surface))] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[hsl(var(--primary))] tracking-wide">{shipment.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${
                          shipment.status === 'In Transit'
                            ? 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent-foreground))]'
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {shipment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-[hsl(var(--accent))]" />
                          {shipment.origin} → {shipment.destination}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Pickup: {shipment.pickupDate}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3 w-3" />
                          {shipment.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <Button variant="hero" className="w-full" asChild>
                    <Link to="/quote" className="group">
                      Request New Quote
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Documents */}
              <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="h-5 w-5 text-[hsl(var(--accent))]" />
                  <h2 className="text-base font-semibold text-[hsl(var(--primary))]">Recent Documents</h2>
                </div>
                <div className="space-y-1">
                  {[
                    'Bill of Lading - DM-2025-001',
                    'Proof of Delivery - DM-2025-002',
                    'Invoice - DM-2025-002',
                  ].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-lg hover:bg-[hsl(var(--surface-low))] transition-colors">
                      <span className="text-sm text-[hsl(var(--primary))]">{doc}</span>
                      <Button variant="ghost" size="sm" className="text-xs text-[hsl(var(--muted-foreground))]">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Account Info */}
              <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 mb-5">
                  <User className="h-5 w-5 text-[hsl(var(--accent))]" />
                  <h2 className="text-base font-semibold text-[hsl(var(--primary))]">Account</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-[hsl(var(--muted-foreground))]">Email</label>
                    <p className="text-sm text-[hsl(var(--primary))]">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-[hsl(var(--muted-foreground))]">Account Type</label>
                    <p className="text-sm text-[hsl(var(--primary))]">Standard Customer</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium tracking-[0.1em] uppercase text-[hsl(var(--muted-foreground))]">Member Since</label>
                    <p className="text-sm text-[hsl(var(--primary))]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full border-[hsl(var(--primary))] text-[hsl(var(--primary))]" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>

              {/* Billing */}
              <div className="p-6 rounded-xl bg-white shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard className="h-5 w-5 text-[hsl(var(--accent))]" />
                  <h2 className="text-base font-semibold text-[hsl(var(--primary))]">Billing</h2>
                </div>
                <div className="text-center py-6">
                  <CreditCard className="h-10 w-10 mx-auto text-[hsl(var(--muted-foreground))]/30 mb-3" />
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">No payment methods on file</p>
                  <Button variant="outline" size="sm" className="mt-4 border-[hsl(var(--primary))] text-[hsl(var(--primary))]">
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default CustomerPortal;
