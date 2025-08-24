import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    department: string;
    hire_date: string;
    status: string;
}

import { Head } from '@inertiajs/react';

export default function Employees({ employees = [] }: { employees: Employee[] }) {
    console.log('Employees data:', employees);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    
    const form = useForm({
        first_name: '',
        last_name: '',
        email: '',
        position: '',
        department: '',
        hire_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/employees', {
            onSuccess: () => setShowAddModal(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Employees', href: '/employees' }]}>
            <Head title="Employees" />
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Employees</h1>
                    <Button onClick={() => setShowAddModal(true)}>Add Employee</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Employee List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Hire Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>
                                            {employee.first_name} {employee.last_name}
                                        </TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                        <TableCell>{employee.department}</TableCell>
                                        <TableCell>{employee.hire_date}</TableCell>
                                        <TableCell>{employee.status}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedEmployee(employee);
                                                        setShowEditModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this employee?')) {
                                                            router.delete(`/employees/${employee.id}`);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {showAddModal && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <Card className="w-[500px]">
                            <CardHeader>
                                <CardTitle>Add New Employee</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">First Name</label>
                                        <Input
                                            type="text"
                                            value={form.data.first_name}
                                            onChange={e => form.setData('first_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Last Name</label>
                                        <Input
                                            type="text"
                                            value={form.data.last_name}
                                            onChange={e => form.setData('last_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <Input
                                            type="email"
                                            value={form.data.email}
                                            onChange={e => form.setData('email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position</label>
                                        <Input
                                            type="text"
                                            value={form.data.position}
                                            onChange={e => form.setData('position', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Department</label>
                                        <Input
                                            type="text"
                                            value={form.data.department}
                                            onChange={e => form.setData('department', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Hire Date</label>
                                        <Input
                                            type="date"
                                            value={form.data.hire_date}
                                            onChange={e => form.setData('hire_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            onClick={() => setShowAddModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={form.processing}>
                                            {form.processing ? 'Saving...' : 'Save Employee'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {showEditModal && selectedEmployee && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <Card className="w-[500px]">
                            <CardHeader>
                                <CardTitle>Edit Employee</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        router.put(`/employees/${selectedEmployee.id}`, form.data, {
                                            onSuccess: () => setShowEditModal(false),
                                        });
                                    }} 
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium mb-1">First Name</label>
                                        <Input
                                            type="text"
                                            value={form.data.first_name || selectedEmployee.first_name}
                                            onChange={e => form.setData('first_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Last Name</label>
                                        <Input
                                            type="text"
                                            value={form.data.last_name || selectedEmployee.last_name}
                                            onChange={e => form.setData('last_name', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <Input
                                            type="email"
                                            value={form.data.email || selectedEmployee.email}
                                            onChange={e => form.setData('email', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position</label>
                                        <Input
                                            type="text"
                                            value={form.data.position || selectedEmployee.position}
                                            onChange={e => form.setData('position', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Department</label>
                                        <Input
                                            type="text"
                                            value={form.data.department || selectedEmployee.department}
                                            onChange={e => form.setData('department', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Hire Date</label>
                                        <Input
                                            type="date"
                                            value={form.data.hire_date || selectedEmployee.hire_date}
                                            onChange={e => form.setData('hire_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setSelectedEmployee(null);
                                                form.reset();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={form.processing}>
                                            {form.processing ? 'Updating...' : 'Update Employee'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
