
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Users, FileText, Download, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  resource_count: number;
}

interface AdminResource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
  download_count: number;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is admin
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          resource_count:resources(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(user => ({
        ...user,
        resource_count: user.resource_count?.[0]?.count || 0
      })) as AdminUser[];
    },
    enabled: userProfile?.role === 'admin',
  });

  // Fetch all resources
  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['admin-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AdminResource[];
    },
    enabled: userProfile?.role === 'admin',
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast({
        title: "User deleted",
        description: "User and all their resources have been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting the user.",
        variant: "destructive",
      });
    },
  });

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      const resource = resources?.find(r => r.id === resourceId);
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
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "Resource deleted",
        description: "The resource has been successfully deleted.",
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-500 mb-4">Please sign in to access the admin panel.</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-500 mb-4">You don't have permission to access the admin panel.</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const totalResources = resources?.length || 0;
  const totalDownloads = resources?.reduce((sum, resource) => sum + resource.download_count, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and resources</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{totalResources}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Users and Resources */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="resources">Manage Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : users && users.length > 0 ? (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <h3 className="text-lg font-semibold text-gray-900">
                                {user.full_name || user.email}
                              </h3>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                              <div>
                                <span className="font-medium">Email:</span><br />
                                {user.email}
                              </div>
                              <div>
                                <span className="font-medium">Joined:</span><br />
                                {formatDate(user.created_at)}
                              </div>
                              <div>
                                <span className="font-medium">Resources:</span><br />
                                {user.resource_count}
                              </div>
                            </div>
                          </div>

                          <div className="ml-4">
                            {user.role !== 'admin' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteUserMutation.mutate(user.id)}
                                disabled={deleteUserMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>All Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {resourcesLoading ? (
                  <div className="text-center py-8">Loading resources...</div>
                ) : resources && resources.length > 0 ? (
                  <div className="space-y-4">
                    {resources.map((resource) => (
                      <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {resource.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="secondary">{resource.category}</Badge>
                              <Badge variant="outline">{resource.file_type}</Badge>
                            </div>

                            {resource.description && (
                              <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                              <div>
                                <span className="font-medium">Uploader:</span><br />
                                {resource.profiles.full_name || resource.profiles.email}
                              </div>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
