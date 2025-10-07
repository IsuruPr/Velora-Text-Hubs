import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Plus,
  Package,
  Search,
  FileText,
  Printer,
} from "lucide-react";
import { api } from "@/services/api";

//  Validation schema
const supplierSchema = z.object({
  quotationId: z.string().min(1, { message: "Please select a quotation" }),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  productName: z
    .string()
    .min(3, { message: "Product name must be at least 3 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Product name must contain only letters and spaces",
    }), // Disallow numbers and special characters
  productImage: z.string().url({ message: "Please enter a valid image URL" }),
  productCode: z.string().min(3, {
    message: "Product code must be at least 3 characters",
  }),
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
  const [approvedQuotations, setApprovedQuotations] = useState<
    ApprovedQuotation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      quotationId: "",
      quantity: "",
      productName: "",
      productImage: "",
      productCode: "",
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
    } catch {
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedQuotations = async () => {
    try {
      const data = await api.suppliers.getApprovedQuotations();
      setApprovedQuotations(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load approved quotations",
        variant: "destructive",
      });
    }
  };

  // CRUD handlers
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?"))
      return;
    try {
      await api.suppliers.delete(id);
      setSuppliers(suppliers.filter((s) => s._id !== id));
      toast({ title: "Success", description: "Supplier deleted successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        variant: "destructive",
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

  const onSubmit = async (data: SupplierFormValues) => {
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
        await api.suppliers.update(editingSupplier._id, supplierData);
        toast({ title: "Success", description: "Supplier updated successfully" });
        setIsEditDialogOpen(false);
        setEditingSupplier(null);
      } else {
        await api.suppliers.create(supplierData);
        toast({ title: "Success", description: "Supplier created successfully" });
        setIsAddDialogOpen(false);
      }

      form.reset();
      fetchSuppliers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save supplier",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddDialog = () => {
    setEditingSupplier(null);
    form.reset();
    setIsAddDialogOpen(true);
  };

  // Search suppliers by first letter
  const filteredSuppliers = suppliers.filter((s) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return s.name.toLowerCase().startsWith(term);
  });

  const generatePDF = async (download: boolean = true) => {
    if (filteredSuppliers.length === 0) {
      toast({
        title: "No data",
        description: "No suppliers to generate PDF",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      pdfMakeModule.default.vfs = pdfFontsModule.vfs;

      const tableBody = [
        ["Supplier Name", "Email", "Product", "Code", "Quantity", "Status", "Company"],
      ];

      filteredSuppliers.forEach((s) => {
        tableBody.push([
          s.name,
          s.email,
          s.productName,
          s.productCode,
          s.quantity.toString(),
          s.status,
          s.quotationId?.companyName || "",
        ]);
      });

      const docDefinition = {
        pageOrientation: "landscape",
        content: [
          { text: "Supplier Report", style: "header" },
          { text: `Generated on: ${new Date().toLocaleDateString()}`, style: "subheader" },
          {
            text: `Total Suppliers: ${filteredSuppliers.length}`,
            style: "subheader",
            margin: [0, 0, 0, 20],
          },
          {
            table: {
              headerRows: 1,
              widths: [120, 150, 120, 80, 80, 80, "*"],
              body: tableBody,
            },
            layout: "lightHorizontalLines",
          },
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
          subheader: { fontSize: 12, margin: [0, 0, 0, 5] },
        },
      };

      const pdfDocGenerator = pdfMakeModule.default.createPdf(docDefinition);
      if (download) {
        pdfDocGenerator.download("Supplier_Report.pdf");
        toast({
          title: "Success",
          description: "PDF downloaded successfully!",
          variant: "default",
        });
      } else {
        pdfDocGenerator.print();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-8">Loading suppliers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold">Supplier Management</h2>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Input
              placeholder="Search by first letter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <Button
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
            onClick={openAddDialog}
          >
            <Plus size={18} /> Add Supplier
          </Button>

          <Button
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
            onClick={() => generatePDF(true)}
            disabled={isGeneratingPDF}
          >
            <FileText size={18} />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </Button>

          <Button
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white"
            onClick={() => generatePDF(false)}
            disabled={isGeneratingPDF}
          >
            <Printer size={18} /> Print PDF
          </Button>
        </div>
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/30">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.productName}</TableCell>
                  <TableCell>{s.productCode}</TableCell>
                  <TableCell>{s.quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={s.status === "ACTIVE" ? "default" : "secondary"}
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.quotationId?.companyName}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(s._id)}
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

      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open && !editingSupplier);
          setIsEditDialogOpen(open && editingSupplier !== null);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSupplier ? "Edit Supplier" : "Add Supplier"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="quotationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Quotation</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select quotation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {approvedQuotations.map((q) => (
                          <SelectItem key={q._id} value={q._id}>
                            {q.name} - {q.companyName}
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
                      <Input placeholder="PRD-001" {...field} />
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
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setEditingSupplier(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Supplier"}
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
