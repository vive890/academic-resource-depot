
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_type: string;
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
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const { toast } = useToast();

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
        query = query.eq('category', categoryFilter);
      }
      if (fileTypeFilter) {
        query = query.eq('file_type', fileTypeFilter);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
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
            
            <Select value={categoryFilter || undefined} onValueChange={(value) => setCategoryFilter(value || '')}>
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

            <Select value={fileTypeFilter || undefined} onValueChange={(value) => setFileTypeFilter(value || '')}>
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
          <div className="text-center py-8">Loading resources...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources?.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
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
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {resources && resources.length === 0 && (
          <div className="text-center py-12">
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
