
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/services/api';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription 
} from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, User } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching users...');
        const data = await api.admin.getUsers();
        console.log('Users fetched successfully:', data);
        
        // Filter out admin user
        const filteredUsers = data.filter(user => user.email !== 'admin@example.com');
        setUsers(filteredUsers);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load users';
        console.error('Error fetching users:', error);
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setUserDetailLoading(true);
      console.log('Fetching user details for ID:', userId);
      const userDetails = await api.admin.getUserById(userId);
      console.log('User details fetched successfully:', userDetails);
      setSelectedUser(userDetails);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user details';
      console.error('Error fetching user details:', error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setUserDetailLoading(false);
    }
  };

  const handleRowClick = (user: User) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null);
    } else {
      fetchUserDetails(user._id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAccountAge = (createdAt: string) => {
    const days = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 30) {
      return `${days} days`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(days / 365);
      const remainingMonths = Math.floor((days % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading customers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Customer Management</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <p className="text-sm">Please ensure you are logged in as an admin user.</p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {users.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/30">
              No customers found
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user._id} 
                      className={`cursor-pointer hover:bg-muted/50 ${selectedUser?._id === user._id ? 'bg-muted' : ''}`}
                      onClick={() => handleRowClick(user)}
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {formatDate(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="p-2 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink>
                        {`${users.length} customer${users.length === 1 ? '' : 's'}`}
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          {selectedUser ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {selectedUser.name}
                </CardTitle>
                <CardDescription>
                  Customer Profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userDetailLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Customer ID</h3>
                      <p className="text-sm font-mono bg-muted p-1 rounded">{selectedUser._id}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                      <p className="text-sm break-all">{selectedUser.email}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Customer Since</h3>
                      <p className="text-sm">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Account Age</h3>
                      <Badge variant="outline" className="text-xs">
                        {calculateAccountAge(selectedUser.createdAt)}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6 h-[240px]">
                <User className="h-12 w-12 text-muted-foreground/60 mb-4" />
                <p className="text-muted-foreground text-center">
                  Select a customer to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
