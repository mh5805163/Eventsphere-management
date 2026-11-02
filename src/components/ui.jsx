import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Slot } from "./util.jsx";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { X, LoaderCircle } from "lucide-react";
export const cn = (...args) => twMerge(clsx(args));
const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-rose disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-rose text-white hover:bg-rose-dark",
        outline: "border border-rose/50 text-rose-dark hover:bg-blush",
        ghost: "text-muted hover:bg-blush",
        dark: "bg-ink text-white hover:bg-rose-dark",
      },
      size: { sm: "px-3 py-2 text-xs", default: "", icon: "p-2" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
export function Button({ className, variant, size, asChild, ...props }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  );
}
export function Card({ className, ...props }) {
  return <div className={cn("panel", className)} {...props} />;
}
export function Badge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-blush px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-dark">
      {children}
    </span>
  );
}
export function Modal({ open, onOpenChange, title, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-ivory p-6 shadow-2xl">
          <Dialog.Title className="mb-6 pr-8 font-display text-3xl">
            {title}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Complete the information below.
          </Dialog.Description>
          <Dialog.Close
            className="absolute right-5 top-5 rounded p-1"
            aria-label="Close dialog"
          >
            <X size={18} />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Confirm({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action changes the saved record.",
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6">
          <AlertDialog.Title className="font-display text-3xl">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="my-4 text-sm text-muted">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button onClick={onConfirm}>Confirm</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
export function Loading() {
  return (
    <div
      className="flex min-h-48 items-center justify-center gap-3 text-muted"
      role="status"
    >
      <LoaderCircle className="animate-spin" size={20} /> Loading your
      experience…
    </div>
  );
}
export function Empty({
  children = "Nothing here yet. Your next chapter is waiting.",
}) {
  return (
    <div className="rounded-xl border border-dashed border-rose/40 p-8 text-center text-sm text-muted">
      {children}
    </div>
  );
}
