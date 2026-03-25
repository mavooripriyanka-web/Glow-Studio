"use client";

import { useState, useEffect } from "react";
import { GalleryHelper, GalleryImage } from "@/lib/gallery-helper";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Image as ImageIcon, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Image from "next/image";

export function GalleryManager() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [formData, setFormData] = useState({
        imageUrl: "",
        alt: "",
        order: 0
    });

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        setLoading(true);
        const data = await GalleryHelper.getAllGalleryImages();
        setImages(data);
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingImage) {
            // Update existing image
            const result = await GalleryHelper.updateGalleryImage(editingImage.id, formData);
            if (result.success) {
                await loadImages();
                resetForm();
            }
        } else {
            // Add new image
            const result = await GalleryHelper.addGalleryImage(formData);
            if (result.success) {
                await loadImages();
                resetForm();
            }
        }
    };

    const handleEdit = (image: GalleryImage) => {
        setEditingImage(image);
        setFormData({
            imageUrl: image.imageUrl,
            alt: image.alt,
            order: image.order
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this image?")) {
            const result = await GalleryHelper.deleteGalleryImage(id);
            if (result.success) {
                await loadImages();
            }
        }
    };

    const resetForm = () => {
        setFormData({ imageUrl: "", alt: "", order: 0 });
        setEditingImage(null);
        setDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif text-slate-900">Gallery Management</h2>
                    <p className="text-muted-foreground mt-1">Manage gallery images displayed on the website</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Image
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingImage ? "Edit Image" : "Add New Image"}</DialogTitle>
                                <DialogDescription>
                                    {editingImage ? "Update the gallery image details" : "Upload a new image to the gallery"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {formData.imageUrl && (
                                        <div className="relative w-full h-40 mt-2 rounded-lg overflow-hidden border">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="alt">Alt Text</Label>
                                    <Input
                                        id="alt"
                                        value={formData.alt}
                                        onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                                        placeholder="Description of the image"
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
                                    {editingImage ? "Update" : "Add"} Image
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Layout Guide for Gallery */}
            <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
                <CardHeader className="pb-3 pt-4 px-6">
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base text-blue-900">Gallery Layout Guide</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-4 pt-0 text-sm text-blue-800 space-y-3">
                    <p>
                        The website displays images in a repeating pattern of <strong>6 fixed sizes</strong>.
                        The shape of the image on the site is determined by its <strong>Display Order</strong>.
                        For best results, upload images that match these shapes in this sequence:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-medium text-center">
                        <div className="bg-white p-2 rounded-md border border-blue-200 shadow-sm">
                            <div className="aspect-[3/4] bg-slate-100 mb-1.5 mx-auto w-8 rounded-sm border border-slate-200"></div>
                            <span className="block text-blue-900">1. Portrait</span>
                            <span className="text-[10px] text-blue-500">(Order 1, 7, 13...)</span>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-blue-200 shadow-sm">
                            <div className="aspect-[4/3] bg-slate-100 mb-1.5 mx-auto w-12 h-9 rounded-sm border border-slate-200"></div>
                            <span className="block text-blue-900">2. Landscape</span>
                            <span className="text-[10px] text-blue-500">(Order 2, 8, 14...)</span>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-blue-200 shadow-sm">
                            <div className="aspect-square bg-slate-100 mb-2 mx-auto w-8 rounded-sm border border-slate-200"></div>
                            <span className="block text-blue-900">3. Square</span>
                            <span className="text-[10px] text-blue-500">(Order 3, 9, 15...)</span>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-blue-200 shadow-sm">
                            <div className="aspect-square bg-slate-100 mb-2 mx-auto w-8 rounded-sm border border-slate-200"></div>
                            <span className="block text-blue-900">4. Square</span>
                            <span className="text-[10px] text-blue-500">(Order 4, 10, 16...)</span>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-blue-200 shadow-sm">
                            <div className="aspect-[3/4] bg-slate-100 mb-1.5 mx-auto w-8 rounded-sm border border-slate-200"></div>
                            <span className="block text-blue-900">5. Portrait</span>
                            <span className="text-[10px] text-blue-500">(Order 5, 11, 17...)</span>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-blue-200 shadow-sm">
                            <div className="aspect-[16/9] bg-slate-100 mb-2 mx-auto w-14 h-8 rounded-sm border border-slate-200"></div>
                            <span className="block text-blue-900">6. Wide</span>
                            <span className="text-[10px] text-blue-500">(Order 6, 12, 18...)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading gallery images...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No images yet</h3>
                    <p className="text-muted-foreground mt-2">Get started by adding your first gallery image</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                        {images.map((image) => (
                            <div key={image.id} className="group relative rounded-lg border overflow-hidden">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4 space-y-2">
                                    <p className="font-medium text-sm truncate">{image.alt}</p>
                                    <p className="text-xs text-muted-foreground">Order: {image.order}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(image)}
                                            className="flex-1"
                                        >
                                            <Pencil className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(image.id)}
                                            className="flex-1"
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
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
