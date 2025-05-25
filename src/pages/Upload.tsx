
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Upload as UploadIcon, FileText, Image, X } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ResourceCategory = Database['public']['Enums']['resource_category'];
type FileType = Database['public']['Enums']['file_type'];

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory | ''>('');
  const [subject, setSubject] = useState('');
  const [course, setCourse] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip'
  ];

  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  const getFileType = (mimeType: string): FileType => {
    switch (mimeType) {
      case 'application/pdf': return 'PDF';
      case 'application/msword': return 'DOC';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return 'DOCX';
      case 'application/vnd.ms-powerpoint': return 'PPT';
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': return 'PPTX';
      case 'application/zip': return 'ZIP';
      default: return 'PDF';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!allowedFileTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, DOC, DOCX, PPT, PPTX, or ZIP files only.",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please upload files smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      if (!allowedImageTypes.includes(selectedImage.type)) {
        toast({
          title: "Invalid image type",
          description: "Please upload JPEG, PNG, WebP, or GIF images only.",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedImage.size > 10 * 1024 * 1024) { // 10MB limit for images
        toast({
          title: "Image too large",
          description: "Please upload images smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setPreviewImage(selectedImage);
      
      // Create a preview URL for display
      const imageUrl = URL.createObjectURL(selectedImage);
      setPreviewImageUrl(imageUrl);
    }
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files.",
        variant: "destructive",
      });
      return;
    }

    if (!file || !title || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload main file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('educational-resources')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      let previewImagePath = null;

      // Upload preview image if provided
      if (previewImage) {
        const imageExt = previewImage.name.split('.').pop();
        const imageName = `${user.id}/previews/${Date.now()}.${imageExt}`;
        
        const { data: imageUploadData, error: imageUploadError } = await supabase.storage
          .from('educational-resources')
          .upload(imageName, previewImage);

        if (imageUploadError) {
          console.error('Preview image upload failed:', imageUploadError);
          toast({
            title: "Preview upload failed",
            description: "The main file was uploaded, but the preview image failed to upload.",
            variant: "destructive",
          });
        } else {
          previewImagePath = imageUploadData.path;
        }
      }

      // Save resource metadata to database
      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          title,
          description,
          category: category as ResourceCategory,
          file_type: getFileType(file.type),
          file_url: uploadData.path,
          file_name: file.name,
          file_size: file.size,
          preview_image_url: previewImagePath,
          subject: subject || null,
          course: course || null,
          uploader_id: user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Upload successful!",
        description: "Your resource has been uploaded and is now available for download.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setSubject('');
      setCourse('');
      setFile(null);
      setPreviewImage(null);
      removePreviewImage();
      
      // Navigate to resources page
      navigate('/resources');
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center animate-fade-in">
        <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-500 mb-4">Please sign in to upload educational resources.</p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Upload Resource
          </h1>
          <p className="text-gray-600">Share your educational materials with the community</p>
        </div>

        <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resource Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-fade-in">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter resource title"
                  required
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your resource"
                  rows={3}
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="animate-fade-in">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category || undefined} onValueChange={(value) => setCategory(value as ResourceCategory)} required>
                    <SelectTrigger className="transition-all duration-200 focus:scale-105">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Notes">Notes</SelectItem>
                      <SelectItem value="PPTs">PPTs</SelectItem>
                      <SelectItem value="Projects">Projects</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="animate-fade-in">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics, Physics"
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g., CS101, MATH201"
                  className="transition-all duration-200 focus:scale-105"
                />
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="file">File Upload *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  required
                  className="transition-all duration-200 focus:scale-105"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP (max 50MB)
                </p>
                {file && (
                  <p className="text-sm text-green-600 mt-1 animate-fade-in">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="preview-image">
                  <Image className="inline w-4 h-4 mr-2" />
                  Preview Image (Optional)
                </Label>
                <Input
                  id="preview-image"
                  type="file"
                  onChange={handlePreviewImageChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="transition-all duration-200 focus:scale-105"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Add a preview image to help users identify your resource (JPEG, PNG, WebP, GIF - max 10MB)
                </p>
                
                {previewImageUrl && (
                  <div className="mt-4 relative inline-block animate-fade-in">
                    <img 
                      src={previewImageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200 shadow-lg hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={removePreviewImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isUploading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Resource
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
