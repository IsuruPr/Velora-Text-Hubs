import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Eye, Check, X, Edit, Calendar, Building, Phone, Mail, User, FileText, Trash2, Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

interface Quotation {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  businessAddress: string;
  companyName: string;
  industrialExperience: string;
  qualification: string;
  productDetails: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
}

const QuotationManagement = () => {
  const { toast } = useToast();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRejected, setShowRejected] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Quotation>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const data = await api.quotations.getAll(showRejected);
      setQuotations(data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quotations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [showRejected]);

  const handleApprove = async (quotationId: string) => {
    try {
      await api.quotations.approve(quotationId);
      toast({
        title: "Success",
        description: "Quotation approved successfully",
      });
      fetchQuotations();
      if (selectedQuotation?._id === quotationId) {
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error('Error approving quotation:', error);
      toast({
        title: "Error",
        description: "Failed to approve quotation",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (quotationId: string) => {
    try {
      await api.quotations.reject(quotationId);
      toast({
        title: "Success",
        description: "Quotation rejected successfully",
      });
      fetchQuotations();
      if (selectedQuotation?._id === quotationId) {
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error('Error rejecting quotation:', error);
      toast({
        title: "Error",
        description: "Failed to reject quotation",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (quotationId: string) => {
    if (!confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) {
      return;
    }

    try {
      await api.quotations.delete(quotationId);
      toast({
        title: "Success",
        description: "Quotation deleted successfully",
      });
      fetchQuotations();
      if (selectedQuotation?._id === quotationId) {
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting quotation:', error);
      toast({
        title: "Error",
        description: "Failed to delete quotation",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    if (selectedQuotation) {
      setEditForm({ ...selectedQuotation });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedQuotation || !editForm) return;

    try {
      await api.quotations.update(selectedQuotation._id, editForm);
      toast({
        title: "Success",
        description: "Quotation updated successfully",
      });
      setIsEditing(false);
      fetchQuotations();
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Error updating quotation:', error);
      toast({
        title: "Error",
        description: "Failed to update quotation",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsDetailModalOpen(true);
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="default">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredQuotations = quotations.filter(quotation =>
    quotation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.phoneNumber.includes(searchTerm) ||
    quotation.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Velora', 10, 10);
    doc.text('Quotation Management Report', 20, 20);
    
    // Date and summary
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${format(new Date(), 'MMMM dd, yyyy at hh:mm a')}`, 20, 30);
    doc.text(`Total Quotations: ${filteredQuotations.length}`, 20, 40);
    
    let yPosition = 55;
    
    // Compact table headers
    const headers = ['Number', 'Name', 'Company', 'Status', 'Date'];
    const columnWidths = [10, 50, 50, 40, 30];
    
    // Draw table header
    doc.setFillColor(200, 200, 200);
    doc.rect(20, yPosition, 180, 8, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    let xPosition = 20;
    headers.forEach((header, index) => {
        doc.text(header, xPosition + 2, yPosition + 5);
        xPosition += columnWidths[index];
    });
    
    yPosition += 8;
    
    // Table rows
    filteredQuotations.forEach((quotation, index) => {
        if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
            
            // Redraw headers
            doc.setFillColor(200, 200, 200);
            doc.rect(20, yPosition, 180, 8, 'F');
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            let xPos = 20;
            headers.forEach((header, idx) => {
                doc.text(header, xPos + 2, yPosition + 5);
                xPos += columnWidths[idx];
            });
            
            yPosition += 8;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, yPosition, 180, 8, 'F');
        }
        
        // Row data
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        
        const rowData = [
            (index + 1).toString(),
            quotation.name || 'N/A',
            quotation.companyName || 'N/A',
            quotation.status || 'N/A',
            quotation.createdAt ? format(new Date(quotation.createdAt), 'MM/dd/yy') : 'N/A'
        ];
        
        let xPos = 20;
        rowData.forEach((data, colIndex) => {
            let displayText = data;
            if (data.length > 25) {
                displayText = data.substring(0, 22) + '...';
            }
            
            doc.text(displayText, xPos + 2, yPosition + 5);
            xPos += columnWidths[colIndex];
        });
        
        yPosition += 8;
    });
    
    // Save the PDF
    doc.save(`quotations-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    toast({
        title: "Success",
        description: "PDF report generated successfully",
    });
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quotation Management</h2>
          <p className="text-muted-foreground">Manage customer quotation requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-rejected">Show Rejected</Label>
            <Switch
              id="show-rejected"
              checked={showRejected}
              onCheckedChange={setShowRejected}
            />
            
          </div>
          <Button
            onClick={generatePDFReport}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-black text-white hover:bg-black hover:text-white"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      

      <Card>
        <CardHeader>
          <CardTitle>Quotation Requests</CardTitle>
          <CardDescription>
            {filteredQuotations.length} of {quotations.length} quotation{quotations.length !== 1 ? 's' : ''} shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredQuotations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No quotations match your search' : 'No quotations found'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created At</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quotation) => (
                  <TableRow key={quotation._id}>
                    <TableCell>
                      {format(new Date(quotation.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{quotation.name}</TableCell>
                    <TableCell>{quotation.email}</TableCell>
                    <TableCell>{quotation.phoneNumber}</TableCell>
                    <TableCell>{quotation.companyName}</TableCell>
                    <TableCell>{getStatusBadge(quotation.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(quotation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {quotation.status === 'PENDING' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(quotation._id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(quotation._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(quotation._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Quotation' : 'Quotation Details'}
            </DialogTitle>
            <DialogDescription>
              {selectedQuotation && (
                <>
                  Submitted on {format(new Date(selectedQuotation.createdAt), 'MMMM dd, yyyy at hh:mm a')}
                  {selectedQuotation.approvedAt && (
                    <> • Approved on {format(new Date(selectedQuotation.approvedAt), 'MMMM dd, yyyy')}</>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedQuotation && (
            <div className="space-y-6">
              {!isEditing ? (
                // View Mode
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label>Name</Label>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded">{selectedQuotation.name}</p>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label>Email</Label>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded">{selectedQuotation.email}</p>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Label>Phone Number</Label>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded">{selectedQuotation.phoneNumber}</p>

                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <Label>Company Name</Label>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded">{selectedQuotation.companyName}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Business Address</Label>
                      <p className="text-sm bg-muted p-3 rounded mt-2">{selectedQuotation.businessAddress}</p>
                    </div>

                    <div>
                      <Label>Industrial Experience</Label>
                      <p className="text-sm bg-muted p-3 rounded mt-2">{selectedQuotation.industrialExperience}</p>
                    </div>

                    <div>
                      <Label>Qualification</Label>
                      <p className="text-sm bg-muted p-3 rounded mt-2">{selectedQuotation.qualification}</p>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <div className="mt-2">{getStatusBadge(selectedQuotation.status)}</div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center space-x-2 text-blue-500">
                      <FileText className="h-4 w-4 text-muted-foreground text-red-300" />
                      <Label>Product Details</Label>
                    </div>
                    <div className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                      {selectedQuotation.productDetails}
                    </div>

                    {selectedQuotation.adminNotes && (
                      <>
                        <Label>Admin Notes</Label>
                        <div className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                          {selectedQuotation.adminNotes}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        value={editForm.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        value={editForm.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-company">Company Name</Label>
                      <Input
                        id="edit-company"
                        value={editForm.companyName || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-address">Business Address</Label>
                    <Input
                      id="edit-address"
                      value={editForm.businessAddress || ''}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-experience">Industrial Experience</Label>
                      <Input
                        id="edit-experience"
                        value={editForm.industrialExperience || ''}
                        onChange={(e) => handleInputChange('industrialExperience', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-qualification">Qualification</Label>
                      <Input
                        id="edit-qualification"
                        value={editForm.qualification || ''}
                        onChange={(e) => handleInputChange('qualification', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-product-details">Product Details</Label>
                    <Textarea
                      id="edit-product-details"
                      value={editForm.productDetails || ''}
                      onChange={(e) => handleInputChange('productDetails', e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-admin-notes">Admin Notes</Label>
                    <Textarea
                      id="edit-admin-notes"
                      value={editForm.adminNotes || ''}
                      onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                      placeholder="Add internal notes..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  {selectedQuotation.status === 'PENDING' && !isEditing && (
                    <>
                      <Button
                        onClick={() => handleApprove(selectedQuotation._id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(selectedQuotation._id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    selectedQuotation.status === 'APPROVED' && (
                      <Button variant="outline" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationManagement;