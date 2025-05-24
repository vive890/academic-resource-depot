import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Users, FileText, Download, User, Shield, TrendingUp, Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  resource_count: number;
  total_downloads: number;
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

interface UserStats {
  total_users: number;
  total_resources: number;
  total_downloads: number;
  new_users_this_month: number;
  new_resources_this_month: number;
  most_downloaded_category: string;
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

  // Fetch comprehensive stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResponse, resourcesResponse] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('resources').select('*')
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (resourcesResponse.error) throw resourcesResponse.error;

      const users = usersResponse.data;
      const resources = resourcesResponse.data;

      const currentMonth = new Date();
      currentMonth.setDate(1);

      const newUsersThisMonth = users.filter(user => 
        new Date(user.created_at) >= currentMonth
      ).length;

      const newResourcesThisMonth = resources.filter(resource => 
        new Date(resource.created_at) >= currentMonth
      ).length;

      const categoryDownloads = resources.reduce((acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + resource.download_count;
        return acc;
      }, {} as Record<string, number>);

      const mostDownloadedCategory = Object.entries(categoryDownloads)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

      return {
        total_users: users.length,
        total_resources: resources.length,
        total_downloads: resources.reduce((sum, r) => sum + r.download_count, 0),
        new_users_this_month: newUsersThisMonth,
        new_resources_this_month: newResourcesThisMonth,
        most_downloaded_category: mostDownloadedCategory
      } as UserStats;
    },
    enabled: userProfile?.role === 'admin',
  });

  // Fetch users with statistics
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Get resource counts and download totals for each user
      const usersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          const { data: resources, error: resourcesError } = await supabase
            .from('resources')
            .select('download_count')
            .eq('uploader_id', profile.id);

          if (resourcesError) throw resourcesError;

          return {
            ...profile,
            resource_count: resources.length,
            total_downloads: resources.reduce((sum, r) => sum + r.download_count, 0)
          };
        })
      );

      return usersWithStats as AdminUser[];
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md animate-fade-in shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-500 mb-4">Please sign in to access the admin panel.</p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md animate-fade-in shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-500 mb-4">You don't have permission to access the admin panel.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage users and resources</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-3xl font-bold">{stats?.total_users || 0}</p>
                  <p className="text-sm text-blue-100">+{stats?.new_users_this_month || 0} this month</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Resources</p>
                  <p className="text-3xl font-bold">{stats?.total_resources || 0}</p>
                  <p className="text-sm text-green-100">+{stats?.new_resources_this_month || 0} this month</p>
                </div>
                <FileText className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Downloads</p>
                  <p className="text-3xl font-bold">{stats?.total_downloads || 0}</p>
                  <p className="text-sm text-purple-100">Most popular: {stats?.most_downloaded_category}</p>
                </div>
                <Download className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="users" className="w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Manage Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  All Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Resources</TableHead>
                          <TableHead>Downloads</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user, index) => (
                          <TableRow key={user.id} className="animate-fade-in hover:bg-gray-50/80" style={{ animationDelay: `${index * 0.05}s` }}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                {user.full_name || 'Unnamed User'}
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4 text-blue-500" />
                                {user.resource_count}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Download className="h-4 w-4 text-green-500" />
                                {user.total_downloads}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(user.created_at)}</TableCell>
                            <TableCell>
                              {user.role !== 'admin' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="hover:scale-105 transition-transform duration-200"
                                  onClick={() => deleteUserMutation.mutate(user.id)}
                                  disabled={deleteUserMutation.isPending}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
