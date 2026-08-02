import { useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { readImageAsAvatarDataUrl } from "@/lib/accountAvatar";
import type { UserProfile } from "@/data/account";

type AccountAvatarEditorProps = {
  profile: UserProfile;
  onAvatarChange: (avatarUrl?: string) => Promise<void>;
  disabled?: boolean;
};

export function AccountAvatarEditor({
  profile,
  onAvatarChange,
  disabled = false,
}: AccountAvatarEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await readImageAsAvatarDataUrl(file);
      await onAvatarChange(dataUrl);
      toast.success("תמונת הפרופיל עודכנה.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "עדכון התמונה נכשל.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    setUploading(true);
    try {
      await onAvatarChange(undefined);
      toast.success("תמונת הפרופיל הוסרה.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "הסרת התמונה נכשלה.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar className="h-20 w-20 border-2 border-border">
        <AvatarImage src={profile.avatarUrl} alt="" />
        <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
          {profile.firstName.charAt(0)}
          {profile.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">תמונת פרופיל</p>
        <p className="text-xs text-muted-foreground">JPG, PNG או WebP · עד 5MB</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
          >
            <Camera size={14} className="ms-1" />
            {uploading ? "מעלה..." : profile.avatarUrl ? "החלפת תמונה" : "הוספת תמונה"}
          </Button>
          {profile.avatarUrl && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={disabled || uploading}
              onClick={() => void handleRemove()}
            >
              <Trash2 size={14} className="ms-1" />
              הסרה
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => void handleFileChange(e)}
        />
      </div>
    </div>
  );
}

export function AccountAvatarBadge({ profile }: { profile: UserProfile }) {
  return (
    <Avatar className="h-12 w-12 border border-border">
      <AvatarImage src={profile.avatarUrl} alt="" />
      <AvatarFallback className="font-bold bg-primary text-primary-foreground">
        {profile.firstName.charAt(0)}
        {profile.lastName.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}
