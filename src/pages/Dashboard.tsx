
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Download, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserResource {
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
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userResources, isLoading } = useQuery({
    queryKey: ['user-resources', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('uploader_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserResource[];
    },
    enabled: !!user,
  });

  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      const resource = userResources?.find(r => r.id === resourceId);
      if (!resource) throw new Error('Resource not found');

      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('educational-resources')
        .remove([resource.file_url]);

      if (storageError) throw storageError;

      // Delete record from database
      const { error: dbError } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-resources'] });
      toast({
        title: "Resource deleted",
        description: "Your resource has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting the resource.",
        variant: "destructive",
      });
    },
  });

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

  const totalDownloads = userResources?.reduce((sum, resource) => sum + resource.download_count, 0) || 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-500 mb-4">Please sign in to view your dashboard.</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your uploaded resources</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Upload className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Uploads</p>
                  <p className="text-2xl font-bold text-gray-900">{userResources?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Button onClick={() => navigate('/upload')} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Resource
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resources List */}
        <Card>
          <CardHeader>
            <CardTitle>My Resources</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading your resources...</div>
            ) : userResources && userResources.length > 0 ? (
              <div className="space-y-4">
                {userResources.map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {resource.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">{resource.category}</Badge>
                          <Badge variant="outline">{resource.file_type}</Badge>
                          {resource.subject && <Badge variant="outline">{resource.subject}</Badge>}
                        </div>

                        {resource.description && (
                          <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Uploaded:</span><br />
                            {formatDate(resource.created_at)}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span><br />
                            {formatFileSize(resource.file_size || 0)}
                          </div>
                          <div>
                            <span className="font-medium">Downloads:</span><br />
                            {resource.download_count}
                          </div>
                          {resource.course && (
                            <div>
                              <span className="font-medium">Course:</span><br />
                              {resource.course}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteResourceMutation.mutate(resource.id)}
                          disabled={deleteResourceMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
                <p className="text-gray-500 mb-4">Start sharing your educational materials with the community.</p>
                <Button onClick={() => navigate('/upload')}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First Resource
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
