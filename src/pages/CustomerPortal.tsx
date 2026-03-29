import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your portal...</p>
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
    <div className="min-h-screen">
      <LandstarSidebar />
      <div className="ml-16">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Customer Portal</h1>
                <p className="text-muted-foreground mt-2">Welcome back, {user.email}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Active Shipments
                  </CardTitle>
                  <CardDescription>
                    Track your current shipments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockShipments.map((shipment) => (
                      <div key={shipment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{shipment.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            shipment.status === 'In Transit' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {shipment.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {shipment.origin} → {shipment.destination}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Pickup: {shipment.pickupDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {shipment.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <Button className="w-full">Request New Quote</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                      <span>Bill of Lading - DM-2025-001</span>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                      <span>Proof of Delivery - DM-2025-002</span>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                      <span>Invoice - DM-2025-002</span>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                    <p className="text-foreground">Standard Customer</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-sm">No payment methods on file</p>
                    <Button variant="outline" className="mt-4">
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default CustomerPortal;