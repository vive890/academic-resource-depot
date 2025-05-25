
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
import { Upload as UploadIcon, FileText, Image, X, File, Archive } from 'lucide-react';
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
    'application/zip',
    'application/x-zip-compressed'
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
      case 'application/zip':
      case 'application/x-zip-compressed': return 'ZIP';
      default: return 'PDF';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'zip':
        return <Archive className="w-5 h-5 text-purple-600" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="w-5 h-5 text-orange-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log('Selected file:', selectedFile.name, 'Type:', selectedFile.type, 'Size:', selectedFile.size);
      
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
      toast({
        title: "File selected",
        description: `${selectedFile.name} is ready to upload.`,
      });
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
      
      console.log('Uploading file:', fileName, 'Type:', file.type);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('educational-resources')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

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
      console.error('Upload error:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center animate-fade-in">
        <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          <CardContent className="p-8 text-center relative">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please sign in to upload educational resources.</p>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Upload Resource
          </h1>
          <p className="text-gray-600 text-lg">Share your educational materials with the community</p>
        </div>

        <Card className="shadow-2xl bg-white/90 backdrop-blur-md border-0 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <CardHeader className="relative">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <UploadIcon className="w-6 h-6 text-blue-600" />
              Resource Details
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="animate-fade-in">
                <Label htmlFor="title" className="text-base font-medium text-gray-700">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter resource title"
                  required
                  className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="description" className="text-base font-medium text-gray-700">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your resource"
                  rows={4}
                  className="mt-2 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-fade-in">
                  <Label htmlFor="category" className="text-base font-medium text-gray-700">Category *</Label>
                  <Select value={category || undefined} onValueChange={(value) => setCategory(value as ResourceCategory)} required>
                    <SelectTrigger className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-400 transition-all duration-200 hover:border-gray-300">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Books">📚 Books</SelectItem>
                      <SelectItem value="Notes">📝 Notes</SelectItem>
                      <SelectItem value="PPTs">📊 PPTs</SelectItem>
                      <SelectItem value="Projects">🗂️ Projects</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="animate-fade-in">
                  <Label htmlFor="subject" className="text-base font-medium text-gray-700">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics, Physics"
                    className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 hover:border-gray-300"
                  />
                </div>
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="course" className="text-base font-medium text-gray-700">Course</Label>
                <Input
                  id="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g., CS101, MATH201"
                  className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 hover:border-gray-300"
                />
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="file" className="text-base font-medium text-gray-700 flex items-center gap-2">
                  <File className="w-4 h-4" />
                  File Upload *
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  required
                  className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX, ZIP (max 50MB)
                </p>
                {file && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.name)}
                      <div>
                        <p className="text-sm font-medium text-green-800">{file.name}</p>
                        <p className="text-xs text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="animate-fade-in">
                <Label htmlFor="preview-image" className="text-base font-medium text-gray-700 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Preview Image (Optional)
                </Label>
                <Input
                  id="preview-image"
                  type="file"
                  onChange={handlePreviewImageChange}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="mt-2 h-12 text-base border-2 border-gray-200 focus:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Add a preview image to help users identify your resource (JPEG, PNG, WebP, GIF - max 10MB)
                </p>
                
                {previewImageUrl && (
                  <div className="mt-4 relative inline-block animate-fade-in">
                    <img 
                      src={previewImageUrl} 
                      alt="Preview" 
                      className="w-40 h-40 object-cover rounded-xl border-2 border-purple-200 shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={removePreviewImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 hover:scale-110 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isUploading} 
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl font-semibold"
              >
                {isUploading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5 mr-2" />
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
