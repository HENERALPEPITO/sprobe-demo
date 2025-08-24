import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface ReviewTemplate {
    id: number;
    title: string;
    description: string;
    criteria: string[];
    status: string;
    created_at: string;
}

export default function ReviewTemplates({ templates = [] }: { templates: ReviewTemplate[] }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [criteria, setCriteria] = useState<string[]>(['']);
    const [selectedTemplate, setSelectedTemplate] = useState<ReviewTemplate | null>(null);
    
    const form = useForm({
        title: '',
        description: '',
        criteria: [''],
    });

    const addCriteria = () => {
        setCriteria([...criteria, '']);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/review-templates', {
            onSuccess: () => setShowAddModal(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Review Templates', href: '/review-templates' }]}>
            <div className="container">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Review Templates</h1>
                    <Button onClick={() => setShowAddModal(true)}>Add Template</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Review Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Criteria Count</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.map((template) => (
                                    <TableRow key={template.id}>
                                        <TableCell>{template.title}</TableCell>
                                        <TableCell>{template.description}</TableCell>
                                        <TableCell>{template.criteria.length}</TableCell>
                                        <TableCell>{template.status}</TableCell>
                                        <TableCell>{new Date(template.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedTemplate(template);
                                                        setCriteria(template.criteria);
                                                        form.setData({
                                                            title: template.title,
                                                            description: template.description || '',
                                                            criteria: template.criteria,
                                                        });
                                                        setShowEditModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this template?')) {
                                                            router.delete(`/review-templates/${template.id}`);
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <Card className="w-[500px]">
                            <CardHeader>
                                <CardTitle>Create Review Template</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded p-2"
                                            value={form.data.title}
                                            onChange={e => form.setData('title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Description</label>
                                        <textarea
                                            className="w-full border rounded p-2"
                                            value={form.data.description}
                                            onChange={e => form.setData('description', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Criteria</label>
                                        {criteria.map((_, index) => (
                                            <div key={index} className="mb-2">
                                                <input
                                                    type="text"
                                                    className="w-full border rounded p-2"
                                                    value={form.data.criteria[index]}
                                                    onChange={e => {
                                                        const newCriteria = [...form.data.criteria];
                                                        newCriteria[index] = e.target.value;
                                                        form.setData('criteria', newCriteria);
                                                    }}
                                                    placeholder={`Criterion ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addCriteria}
                                            className="mt-2"
                                        >
                                            Add Criterion
                                        </Button>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowAddModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={form.processing}>
                                            Save Template
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {showEditModal && selectedTemplate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <Card className="w-[500px]">
                            <CardHeader>
                                <CardTitle>Edit Review Template</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    router.put(`/review-templates/${selectedTemplate.id}`, form.data, {
                                        onSuccess: () => setShowEditModal(false),
                                    });
                                }} className="space-y-4">
                                    <div>
                                        <label className="block mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full border rounded p-2"
                                            value={form.data.title}
                                            onChange={e => form.setData('title', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Description</label>
                                        <textarea
                                            className="w-full border rounded p-2"
                                            value={form.data.description}
                                            onChange={e => form.setData('description', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Criteria</label>
                                        {criteria.map((_, index) => (
                                            <div key={index} className="mb-2">
                                                <input
                                                    type="text"
                                                    className="w-full border rounded p-2"
                                                    value={form.data.criteria[index]}
                                                    onChange={e => {
                                                        const newCriteria = [...form.data.criteria];
                                                        newCriteria[index] = e.target.value;
                                                        form.setData('criteria', newCriteria);
                                                    }}
                                                    placeholder={`Criterion ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                const newCriteria = [...criteria, ''];
                                                setCriteria(newCriteria);
                                                form.setData('criteria', [...form.data.criteria, '']);
                                            }}
                                            className="mt-2"
                                        >
                                            Add Criterion
                                        </Button>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowEditModal(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={form.processing}>
                                            Update Template
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
