import { useState, useEffect } from "react";
import { AdminLayout } from "../../layouts/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, FileText, Brain, Trash2, Search, ShieldAlert, Activity } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Stats
    const { data: stats } = useQuery({
        queryKey: ["adminStats"],
        queryFn: async () => {
            const [users, quizzes, materials] = await Promise.all([
                supabase.from("profiles").select("*", { count: "exact", head: true }),
                supabase.from("quiz_results").select("*", { count: "exact", head: true }),
                supabase.from("materials").select("*", { count: "exact", head: true }),
            ]);
            return {
                users: users.count || 0,
                quizzes: quizzes.count || 0,
                materials: materials.count || 0,
            };
        },
    });

    // Fetch Users
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
    });

    // Fetch Content (Quizzes & Materials)
    const { data: content, isLoading: contentLoading } = useQuery({
        queryKey: ["adminContent"],
        queryFn: async () => {
            const [materials, quizzes] = await Promise.all([
                supabase.from("materials").select("*, profiles(username)"),
                supabase.from("quiz_results").select("*, profiles(username), quizzes(title)"),
            ]);
            return {
                materials: materials.data || [],
                quizzes: quizzes.data || [],
            };
        },
    });

    // Delete User Mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const { data, error } = await supabase.functions.invoke('delete-user', {
                body: { user_id: userId }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            return data;
        },
        onSuccess: () => {
            toast.success("User deleted successfully from system");
            queryClient.invalidateQueries(["adminUsers"]);
            queryClient.invalidateQueries(["adminStats"]);
        },
        onError: (error) => toast.error("Failed to delete user: " + error.message),
    });

    // Delete Content Mutation
    const deleteContentMutation = useMutation({
        mutationFn: async ({ type, id }) => {
            const table = type === 'material' ? 'materials' : 'quiz_results';
            const { error } = await supabase.from(table).delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success("Content deleted successfully");
            queryClient.invalidateQueries(["adminContent"]);
            queryClient.invalidateQueries(["adminStats"]);
        },
        onError: (error) => toast.error("Failed to delete content"),
    });

    const filteredUsers = users?.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="text-red-500" /> Super Admin Dashboard
                        </h1>
                        <p className="text-gray-400">System-wide control and monitoring</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-electric-cyan" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats?.users || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">Total Quizzes Taken</CardTitle>
                            <Brain className="h-4 w-4 text-hot-magenta" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats?.quizzes || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-200">Total Materials</CardTitle>
                            <FileText className="h-4 w-4 text-electric-lime" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats?.materials || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Learners & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Activity className="text-electric-cyan" /> Top Performing Learners
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {users?.sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5).map((user, index) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-electric-cyan font-bold">
                                                #{index + 1}
                                            </div>
                                            <Avatar className="w-10 h-10 border border-white/10">
                                                <AvatarImage src={user.avatar_url} />
                                                <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-bold text-white">{user.full_name}</div>
                                                <div className="text-xs text-gray-400">@{user.username}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-electric-cyan">{user.xp} XP</div>
                                            <div className="text-xs text-gray-400">Level {user.level || 1}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Activity className="text-hot-magenta" /> Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {content?.quizzes.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div>
                                            <div className="font-bold text-white">{item.profiles?.username || 'Unknown'}</div>
                                            <div className="text-xs text-gray-400">Completed {item.quizzes?.title}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-hot-magenta">{item.score}/{item.total}</div>
                                            <div className="text-xs text-gray-400">{new Date(item.submitted_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10">
                        <TabsTrigger value="users">Users Management</TabsTrigger>
                        <TabsTrigger value="content">Content Oversight</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <Search className="w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-white"
                            />
                        </div>

                        <div className="rounded-xl border border-white/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="hover:bg-white/5 border-white/10">
                                        <TableHead className="text-gray-300">User</TableHead>
                                        <TableHead className="text-gray-300">Role</TableHead>
                                        <TableHead className="text-gray-300">Plan</TableHead>
                                        <TableHead className="text-gray-300">XP</TableHead>
                                        <TableHead className="text-gray-300">Joined</TableHead>
                                        <TableHead className="text-right text-gray-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers?.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-white/5 border-white/10">
                                            <TableCell className="font-medium text-white">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={user.avatar_url} />
                                                        <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-bold">{user.full_name}</div>
                                                        <div className="text-xs text-gray-400">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                    {user.role || 'user'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    defaultValue={user.plan || "Free"}
                                                    onValueChange={(value) => updatePlanMutation.mutate({ userId: user.id, plan: value })}
                                                >
                                                    <SelectTrigger className="w-[100px] h-8 bg-white/5 border-white/10 text-white text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-space-dark border-white/10 text-white">
                                                        <SelectItem value="Free">Free</SelectItem>
                                                        <SelectItem value="Pro">Pro</SelectItem>
                                                        <SelectItem value="Premium">Premium</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-gray-300">{user.xp}</TableCell>
                                            <TableCell className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this user?')) {
                                                            deleteUserMutation.mutate(user.id);
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-6">
                        <Card className="glass-card border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Uploaded Materials</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="hover:bg-white/5 border-white/10">
                                            <TableHead className="text-gray-300">Title</TableHead>
                                            <TableHead className="text-gray-300">Owner</TableHead>
                                            <TableHead className="text-gray-300">Type</TableHead>
                                            <TableHead className="text-right text-gray-300">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {content?.materials.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-white/5 border-white/10">
                                                <TableCell className="font-medium text-white">{item.title}</TableCell>
                                                <TableCell className="text-gray-400">{item.profiles?.username || 'Unknown'}</TableCell>
                                                <TableCell className="text-gray-400">{item.file_type}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (window.confirm('Delete this material?')) {
                                                                deleteContentMutation.mutate({ type: 'material', id: item.id });
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">Recent Quiz Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="hover:bg-white/5 border-white/10">
                                            <TableHead className="text-gray-300">Quiz</TableHead>
                                            <TableHead className="text-gray-300">User</TableHead>
                                            <TableHead className="text-gray-300">Score</TableHead>
                                            <TableHead className="text-right text-gray-300">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {content?.quizzes.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-white/5 border-white/10">
                                                <TableCell className="font-medium text-white">{item.quizzes?.title || 'Untitled'}</TableCell>
                                                <TableCell className="text-gray-400">{item.profiles?.username || 'Unknown'}</TableCell>
                                                <TableCell className="text-gray-400">{item.score}/{item.total}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (window.confirm('Delete this result?')) {
                                                                deleteContentMutation.mutate({ type: 'quiz', id: item.id });
                                                            }
                                                        }}
                                                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
