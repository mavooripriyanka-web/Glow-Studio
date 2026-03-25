"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AuthGuardModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

export function AuthGuardModal({ open, onOpenChange, onConfirm }: AuthGuardModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="hidden">Account Required</AlertDialogTitle>
                    <AlertDialogDescription className="text-lg font-semibold text-foreground text-center">
                        You must have an account to book an appointment. Please sign up or
                        log in to continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
