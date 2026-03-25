"use client";

import { useState, useEffect } from "react";
import { TestimonialsHelper, Testimonial } from "@/lib/testimonials-helper";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Star, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        text: "",
        rating: 5,
        order: 0
    });

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        setLoading(true);
        const data = await TestimonialsHelper.getAllTestimonials();
        setTestimonials(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTestimonial) {
            // Update existing testimonial
            const result = await TestimonialsHelper.updateTestimonial(editingTestimonial.id, formData);
            if (result.success) {
                await loadTestimonials();
                resetForm();
            }
        } else {
            // Add new testimonial
            const result = await TestimonialsHelper.addTestimonial(formData);
            if (result.success) {
                await loadTestimonials();
                resetForm();
            }
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            text: testimonial.text,
            rating: testimonial.rating,
            order: testimonial.order
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this testimonial?")) {
            const result = await TestimonialsHelper.deleteTestimonial(id);
            if (result.success) {
                await loadTestimonials();
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: "", text: "", rating: 5, order: 0 });
        setEditingTestimonial(null);
        setDialogOpen(false);
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif text-slate-900">Testimonials Management</h2>
                    <p className="text-muted-foreground mt-1">Manage client testimonials displayed on the website</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Testimonial
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
                                <DialogDescription>
                                    {editingTestimonial ? "Update the testimonial details" : "Add a new client testimonial"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Client Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="text">Testimonial Text</Label>
                                    <Textarea
                                        id="text"
                                        value={formData.text}
                                        onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                                        placeholder="Share your experience..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="rating">Rating (1-5 stars)</Label>
                                    <Input
                                        id="rating"
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value === '' ? 0 : parseInt(e.target.value) }))}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value === '' ? 0 : parseInt(e.target.value) }))}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingTestimonial ? "Update" : "Add"} Testimonial
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading testimonials...</p>
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No testimonials yet</h3>
                    <p className="text-muted-foreground mt-2">Get started by adding your first client testimonial</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border">
                    <div className="divide-y">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#2a3c5f] text-white flex items-center justify-center font-bold">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{testimonial.name}</p>
                                                <div className="flex gap-1 mt-1">
                                                    {renderStars(testimonial.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">"{testimonial.text}"</p>
                                        <p className="text-xs text-muted-foreground">Order: {testimonial.order}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(testimonial)}
                                        >
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(testimonial.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
