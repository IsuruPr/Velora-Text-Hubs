
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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AlertCircle, Loader2, User, Edit, Trash2, Search, FileDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import jsPDF from 'jspdf';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email });
    setEditDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.admin.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      setSelectedUser(null);
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete customer',
        variant: 'destructive',
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setIsSubmitting(true);
      const updatedUser = await api.admin.updateUser(editingUser._id, editForm);
      
      setUsers(users.map(user => 
        user._id === editingUser._id ? updatedUser : user
      ));
      
      if (selectedUser?._id === editingUser._id) {
        setSelectedUser(updatedUser);
      }
      
      setEditDialogOpen(false);
      setEditingUser(null);
      
      toast({
        title: 'Success',
        description: 'Customer updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update customer',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text('Customer Report', 14, 20);
      
      // Date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 14, 28);
      
      // Summary
      doc.setFontSize(12);
      doc.text(`Total Customers: ${filteredUsers.length}`, 14, 38);
      
      // Table headers
      let y = 50;
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Name', 14, y);
      doc.text('Email', 70, y);
      doc.text('Joined Date', 140, y);
      
      // Draw header line
      doc.line(14, y + 2, 196, y + 2);
      y += 8;
      
      // Customer data
      doc.setFont(undefined, 'normal');
      filteredUsers.forEach((user, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(user.name.substring(0, 25), 14, y);
        doc.text(user.email.substring(0, 30), 70, y);
        doc.text(formatDate(user.createdAt), 140, y);
        y += 8;
      });
      
      // Save the PDF
      doc.save(`customer-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: 'Success',
        description: 'Customer report downloaded successfully',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF report',
        variant: 'destructive',
      });
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-semibold">Customer Management</h2>
        <Button onClick={generatePDFReport} variant="default" className="gap-2">
          <FileDown className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-muted/30">
              {searchQuery ? 'No customers match your search' : 'No customers found'}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow 
                      key={user._id} 
                      className={`${selectedUser?._id === user._id ? 'bg-muted' : ''}`}
                    >
                      <TableCell 
                        className="font-medium cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(user)}
                      >
                        {user.name}
                      </TableCell>
                      <TableCell 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(user)}
                      >
                        {user.email}
                      </TableCell>
                      <TableCell 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(user)}
                      >
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
                        {searchQuery 
                          ? `${filteredUsers.length} of ${users.length} customer${users.length === 1 ? '' : 's'}`
                          : `${users.length} customer${users.length === 1 ? '' : 's'}`
                        }
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Customer'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
