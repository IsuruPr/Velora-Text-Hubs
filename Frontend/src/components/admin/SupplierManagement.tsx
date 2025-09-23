import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { api } from '@/services/api';


const supplierSchema = z.object({
  quotationId: z.string().min(1, { message: 'Please select a quotation' }),
  quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Quantity must be a positive number',
  }),
  productName: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  productImage: z.string().url({ message: 'Please enter a valid image URL' }),
  productCode: z.string().min(3, { message: 'Product code must be at least 3 characters' }),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface ApprovedQuotation {
  _id: string;
  name: string;
  email: string;
  companyName: string;
}

interface Supplier {
  _id: string;
  name: string;
  email: string;
  quantity: number;
  productName: string;
  productImage: string;
  productCode: string;
  status: string;
  quotationId: {
    _id: string;
    name: string;
    email: string;
    companyName: string;
  };
  createdAt: string;
}

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [approvedQuotations, setApprovedQuotations] = useState<ApprovedQuotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      quotationId: '',
      quantity: '',
      productName: '',
      productImage: '',
      productCode: '',
    },
  });

  useEffect(() => {
    fetchSuppliers();
    fetchApprovedQuotations();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await api.suppliers.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load suppliers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedQuotations = async () => {
    try {
      const data = await api.suppliers.getApprovedQuotations();
      setApprovedQuotations(data);
    } catch (error) {
      console.error('Error fetching approved quotations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load approved quotations',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await api.suppliers.delete(id);
      setSuppliers(suppliers.filter(supplier => supplier._id !== id));
      toast({
        title: 'Success',
        description: 'Supplier deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete supplier',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.reset({
      quotationId: supplier.quotationId._id,
      quantity: supplier.quantity.toString(),
      productName: supplier.productName,
      productImage: supplier.productImage,
      productCode: supplier.productCode,
    });
    setIsEditDialogOpen(true);
  };

  async function onSubmit(data: SupplierFormValues) {
    try {
      setIsSubmitting(true);
      
      const supplierData = {
        quotationId: data.quotationId,
        quantity: Number(data.quantity),
        productName: data.productName,
        productImage: data.productImage,
        productCode: data.productCode,
      };

      if (editingSupplier) {
        
        const response = await api.suppliers.update(editingSupplier._id, supplierData);
        toast({
          title: 'Success',
          description: 'Supplier updated successfully',
        });
        setIsEditDialogOpen(false);
        setEditingSupplier(null);
      } else {
        
        const response = await api.suppliers.create(supplierData);
        toast({
          title: 'Success',
          description: 'Supplier created successfully',
        });
        setIsAddDialogOpen(false);
      }
      
      
      form.reset();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save supplier',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const openAddDialog = () => {
    setEditingSupplier(null);
    form.reset();
    setIsAddDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading suppliers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Supplier Management</h2>
        <Button className="flex items-center gap-2" onClick={openAddDialog}>
          <Plus size={18} /> Add New Supplier
        </Button>
      </div>
      
      {suppliers.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/30">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
          <p className="text-muted-foreground mb-4">Create your first supplier to get started</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Product Code</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img 
                        src={supplier.productImage} 
                        alt={supplier.productName}
                        className="w-8 h-8 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <span className="truncate max-w-[120px]" title={supplier.productName}>
                        {supplier.productName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{supplier.productCode}</TableCell>
                  <TableCell>{supplier.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{supplier.quotationId?.companyName || 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(supplier._id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="quotationId"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Select Approved Quotation</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from approved quotations" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {approvedQuotations.map((quotation) => (
                            <SelectItem key={quotation._id} value={quotation._id}>
                              {quotation.name} - {quotation.companyName} ({quotation.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PRD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Product Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/product-image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Supplier...' : 'Create Supplier'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="quotationId"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Select Approved Quotation</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select from approved quotations" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {approvedQuotations.map((quotation) => (
                            <SelectItem key={quotation._id} value={quotation._id}>
                              {quotation.name} - {quotation.companyName} ({quotation.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PRD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Product Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/product-image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingSupplier(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating Supplier...' : 'Update Supplier'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManagement;