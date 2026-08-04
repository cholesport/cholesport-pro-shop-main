import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NINJA_ART_SUMMER_CAMP } from "@/data/camps";
import { submitCampInquiry } from "@/lib/api/camps.functions";
import { safeAction } from "@/lib/safeAction";
import { cn } from "@/lib/utils";

type CampInquiryDialogProps = {
  triggerClassName?: string;
  triggerLabel?: string;
};

export function CampInquiryDialog({
  triggerClassName,
  triggerLabel = "שליחת פנייה והרשמה לפרטים",
}: CampInquiryDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredSession, setPreferredSession] = useState("");
  const [message, setMessage] = useState("");

  function resetForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPreferredSession("");
    setMessage("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    const result = await safeAction(
      () =>
        submitCampInquiry({
          data: {
            firstName,
            lastName,
            email,
            phone,
            preferredSession: preferredSession || undefined,
            message: message || undefined,
          },
        }),
      {
        fallbackMessage: "לא הצלחנו לשלוח את הפנייה. נסו שוב או התקשרו אלינו.",
      },
    );

    setSubmitting(false);

    if (result) {
      toast.success("הפנייה נשלחה! נחזור אליכם בהקדם עם כל הפרטים.");
      resetForm();
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={cn(
            "w-full sm:w-auto font-bold shadow-lg shadow-accent/25 sm:min-w-[280px]",
            triggerClassName,
          )}
        >
          <Send size={18} aria-hidden />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>פנייה והרשמה לקייטנה</DialogTitle>
          <DialogDescription>
            מלאו את הפרטים ונחזור אליכם עם כל המידע — מקומות, מחיר ותיאום מחזור.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="camp-first-name">שם פרטי *</Label>
              <Input
                id="camp-first-name"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-last-name">שם משפחה *</Label>
              <Input
                id="camp-last-name"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="camp-email">אימייל *</Label>
            <Input
              id="camp-email"
              type="email"
              required
              autoComplete="email"
              dir="ltr"
              className="text-end"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="camp-phone">טלפון *</Label>
            <Input
              id="camp-phone"
              type="tel"
              required
              autoComplete="tel"
              dir="ltr"
              className="text-end"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="camp-session">מחזור מועדף (אופציונלי)</Label>
            <Select value={preferredSession} onValueChange={setPreferredSession}>
              <SelectTrigger id="camp-session">
                <SelectValue placeholder="בחרו מחזור" />
              </SelectTrigger>
              <SelectContent>
                {NINJA_ART_SUMMER_CAMP.sessions.map((session) => (
                  <SelectItem key={session.id} value={`${session.label} (${session.dates})`}>
                    {session.label} — {session.dates}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="camp-message">הערות (אופציונלי)</Label>
            <Input
              id="camp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="גיל הילד/ה, שאלות נוספות..."
            />
          </div>
          <Button type="submit" size="lg" className="w-full font-bold" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden />
                שולח...
              </>
            ) : (
              <>
                <Send size={18} aria-hidden />
                שליחה
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
