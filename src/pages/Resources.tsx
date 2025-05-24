import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

type ResourceCategory = Database['public']['Enums']['resource_category'];
type FileType = Database['public']['Enums']['file_type'];

interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  file_type: FileType;
  file_url: string;
  file_name: string;
  file_size: number;
  subject: string;
  course: string;
  download_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | ''>('');
  const [fileTypeFilter, setFileTypeFilter] = useState<FileType | ''>('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: resources, isLoading, refetch } = useQuery({
    queryKey: ['resources', searchTerm, categoryFilter, fileTypeFilter, subjectFilter],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (categoryFilter) {
        query = query.eq('category', categoryFilter as ResourceCategory);
      }
      if (fileTypeFilter) {
        query = query.eq('file_type', fileTypeFilter as FileType);
      }
      if (subjectFilter) {
        query = query.ilike('subject', `%${subjectFilter}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Resource[];
    },
  });

  const handleDownload = async (resource: Resource) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to download resources",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = supabase.storage
        .from('educational-resources')
        .getPublicUrl(resource.file_url);

      // Increment download count
      await supabase.rpc('increment_download_count', { resource_id: resource.id });
      
      // Create download link
      const link = document.createElement('a');
      link.href = data.publicUrl;
      link.download = resource.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started",
        description: `Downloading ${resource.title}`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Resources</h1>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter || undefined} onValueChange={(value) => setCategoryFilter((value as ResourceCategory) || '')}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Notes">Notes</SelectItem>
                <SelectItem value="PPTs">PPTs</SelectItem>
                <SelectItem value="Projects">Projects</SelectItem>
              </SelectContent>
            </Select>

            <Select value={fileTypeFilter || undefined} onValueChange={(value) => setFileTypeFilter((value as FileType) || '')}>
              <SelectTrigger>
                <SelectValue placeholder="All File Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="DOCX">DOCX</SelectItem>
                <SelectItem value="PPT">PPT</SelectItem>
                <SelectItem value="PPTX">PPTX</SelectItem>
                <SelectItem value="ZIP">ZIP</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            />

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setFileTypeFilter('');
                setSubjectFilter('');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading resources...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources?.map((resource, index) => (
              <Card 
                key={resource.id} 
                className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {resource.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-2 py-1 rounded-full">
                      {resource.category}
                    </span>
                    <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-2 py-1 rounded-full">
                      {resource.file_type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    {resource.subject && (
                      <div><strong>Subject:</strong> {resource.subject}</div>
                    )}
                    {resource.course && (
                      <div><strong>Course:</strong> {resource.course}</div>
                    )}
                    <div><strong>Uploaded by:</strong> {resource.profiles.full_name || resource.profiles.email}</div>
                    <div><strong>Date:</strong> {formatDate(resource.created_at)}</div>
                    <div><strong>Size:</strong> {formatFileSize(resource.file_size || 0)}</div>
                    <div><strong>Downloads:</strong> {resource.download_count}</div>
                  </div>

                  <Button 
                    onClick={() => handleDownload(resource)} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                    disabled={!user}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {user ? 'Download' : 'Sign in to Download'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {resources && resources.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
