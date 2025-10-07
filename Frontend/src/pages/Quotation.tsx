import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { ArrowLeft, FileText } from 'lucide-react';

const Quotation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    businessAddress: '',
    companyName: '',
    industrialExperience: '',
    qualification: '',
    productDetails: ''
  });

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (/[@]/.test(value)) return 'Name cannot contain @ symbol';
        if (!/^[a-zA-Z\s]{2,}$/.test(value)) return 'Please enter a valid name (letters and spaces only, minimum 2 characters)';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9+\-\s()]{10,}$/.test(value)) return 'Please enter a valid phone number (numbers only, minimum 10 digits)';
        return '';
      
      case 'companyName':
      case 'businessAddress':
      case 'industrialExperience':
      case 'qualification':
      case 'productDetails':
        if (!value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow numbers and common phone characters
    if (name === 'phoneNumber') {
      // Allow only numbers, plus, hyphen, space, and parentheses
      const phoneValue = value.replace(/[^\d+\-\s()]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await api.quotations.create(formData);
      
      toast({
        title: "Success",
        description: "Your quotation request has been submitted successfully. We'll get back to you soon!",
      });
      
      // Reset form and errors
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        businessAddress: '',
        companyName: '',
        industrialExperience: '',
        qualification: '',
        productDetails: ''
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error submitting quotation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quotation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Request a Quotation</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you with a custom quote for your business needs.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter your full name"
                      required
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="your.email@example.com"
                      required
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="+1 (555) 123-4567"
                      required
                      className={errors.phoneNumber ? "border-destructive" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Your Company Inc."
                      required
                      className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    name="businessAddress"
                    type="text"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Complete business address"
                    required
                    className={errors.businessAddress ? "border-destructive" : ""}
                  />
                  {errors.businessAddress && (
                    <p className="text-sm text-destructive">{errors.businessAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industrialExperience">Industrial Experience *</Label>
                    <Input
                      id="industrialExperience"
                      name="industrialExperience"
                      type="text"
                      value={formData.industrialExperience}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 5 years in manufacturing"
                      required
                      className={errors.industrialExperience ? "border-destructive" : ""}
                    />
                    {errors.industrialExperience && (
                      <p className="text-sm text-destructive">{errors.industrialExperience}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification *</Label>
                    <Input
                      id="qualification"
                      name="qualification"
                      type="text"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Relevant qualifications"
                      required
                      className={errors.qualification ? "border-destructive" : ""}
                    />
                    {errors.qualification && (
                      <p className="text-sm text-destructive">{errors.qualification}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDetails">Product Details *</Label>
                  <Textarea
                    id="productDetails"
                    name="productDetails"
                    value={formData.productDetails}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Please provide detailed information about the products or services you're interested in..."
                    className={`min-h-[120px] ${errors.productDetails ? "border-destructive" : ""}`}
                    required
                  />
                  {errors.productDetails && (
                    <p className="text-sm text-destructive">{errors.productDetails}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Quotation Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Quotation;