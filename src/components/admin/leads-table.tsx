"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RefreshCw, Mail, Phone, MessageSquare } from "lucide-react";
import { AuthHelper, Lead } from "@/lib/auth-helper";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function LeadsTable() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    useEffect(() => {
        const unsubscribe = AuthHelper.subscribeToLeads((updatedLeads) => {
            setLeads(updatedLeads);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (leadId: string, status: Lead['status']) => {
        await AuthHelper.updateLeadStatus(leadId, status);
        // No need to manually fetch, subscription handles update
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
            case 'contacted':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Contacted</Badge>;
            case 'converted':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Converted</Badge>;
            case 'closed':
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Closed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Inquiries & Leads</h2>
                <Button variant="outline" size="sm" disabled={true} title="Updates automatically">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Auto-Updating
                </Button>
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">Date</TableHead>
                                <TableHead className="whitespace-nowrap">Name</TableHead>
                                <TableHead className="whitespace-nowrap">Contact</TableHead>
                                <TableHead className="whitespace-nowrap min-w-[200px]">Message Preview</TableHead>
                                <TableHead className="whitespace-nowrap">Status</TableHead>
                                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Loading leads...
                                    </TableCell>
                                </TableRow>
                            ) : leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No inquiries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell className="whitespace-nowrap text-stone-500">
                                            {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="font-medium whitespace-nowrap">{lead.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm text-stone-500 min-w-[150px]">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.mobile}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[250px]">
                                            <p className="truncate text-sm text-stone-600 cursor-pointer hover:underline" onClick={() => setSelectedLead(lead)}>
                                                {lead.message}
                                            </p>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{getStatusBadge(lead.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, 'contacted')}>
                                                        Mark as Contacted
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, 'converted')}>
                                                        Mark as Converted
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(lead.id, 'closed')}>
                                                        Close Lead
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Lead Details Dialog */}
            <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inquiry Details</DialogTitle>
                        <DialogDescription>
                            Received on {selectedLead && format(new Date(selectedLead.createdAt), 'PPP p')}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLead && (
                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase text-stone-500">Name</label>
                                    <p className="font-medium">{selectedLead.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-stone-500">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedLead.status)}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-stone-500">Email</label>
                                    <p className="text-sm">{selectedLead.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase text-stone-500">Phone</label>
                                    <p className="text-sm">{selectedLead.mobile}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-stone-500">Message</label>
                                <div className="mt-2 p-4 bg-stone-50 rounded-md text-sm border border-stone-100 whitespace-pre-wrap">
                                    {selectedLead.message}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => setSelectedLead(null)}>Close</Button>
                                <a href={`mailto:${selectedLead.email}`}>
                                    <Button>Reply via Email</Button>
                                </a>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
