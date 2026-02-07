import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const TEAM_NAME = "Odontoa tim";
const TEAM_AVATAR_SRC = "/images/Odontoa - logo pack/Icon_color.png";

function formatSrDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const months = [
    "januar",
    "februar",
    "mart",
    "april",
    "maj",
    "jun",
    "jul",
    "avgust",
    "septembar",
    "oktobar",
    "novembar",
    "decembar",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}. ${month} ${year}`;
}

function getInitials(name?: string | null, fallback: string = "O"): string {
  if (!name) return fallback;
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name[0]?.toUpperCase() || fallback;
}

export interface AuthorRowProps {
  name: string;
  avatarUrl?: string;
  url?: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  size?: "sm" | "md";
  showDate?: boolean;
}

export function AuthorRow({
  name,
  avatarUrl,
  url,
  publishedAt,
  updatedAt,
  size = "sm",
  showDate = true,
}: AuthorRowProps) {
  // Date fallback: publishedAt ?? updatedAt ?? ""
  const dateToFormat = publishedAt ?? updatedAt ?? "";
  const formattedDate = showDate ? formatSrDate(dateToFormat) : "";
  const hasDate = showDate && !!dateToFormat && formattedDate !== "";

  const avatarSize = size === "md" ? "h-8 w-8" : "h-7 w-7";
  const avatarSizePx = size === "md" ? "32px" : "28px";

  // Determine which avatar to use: avatarUrl > TEAM_AVATAR_SRC (for "Odontoa tim") > initials
  // Case-insensitive check for team name
  const isTeamName = name?.toLowerCase().trim() === TEAM_NAME.toLowerCase();
  // Check if avatarUrl is missing or empty string
  const hasAvatarUrl = avatarUrl && avatarUrl.trim() !== "";
  const useTeamAvatar = !hasAvatarUrl && isTeamName;
  const useInitials = !hasAvatarUrl && !useTeamAvatar;

  const AvatarComponent = (
    <div
      className={cn(
        avatarSize,
        "rounded-full shrink-0",
        useTeamAvatar
          ? "bg-white flex items-center justify-center overflow-hidden"
          : hasAvatarUrl
          ? "bg-slate-100 relative overflow-hidden"
          : "bg-slate-100 flex items-center justify-center"
      )}
    >
      {hasAvatarUrl ? (
        <Image
          src={avatarUrl!}
          alt={name}
          fill
          className="object-cover"
          sizes={avatarSizePx}
        />
      ) : useTeamAvatar ? (
        <Image
          src={TEAM_AVATAR_SRC}
          alt={name}
          width={size === "md" ? 32 : 28}
          height={size === "md" ? 32 : 28}
          className="object-contain p-1.5"
          unoptimized
        />
      ) : (
        <span className="text-xs font-semibold text-slate-700">
          {getInitials(name)}
        </span>
      )}
    </div>
  );

  return (
    <div className={cn("flex gap-3", hasDate ? "items-start" : "items-center")}>
      {url ? (
        <Link
          href={url}
          className="flex items-center hover:opacity-80 transition-opacity shrink-0"
        >
          {AvatarComponent}
        </Link>
      ) : (
        AvatarComponent
      )}
      <div className={cn("min-w-0", hasDate ? "flex flex-col leading-snug" : "flex items-center")}>
        {url ? (
          <Link
            href={url}
            className="text-sm font-medium text-slate-900 hover:opacity-80 transition-opacity"
          >
            {name}
          </Link>
        ) : (
          <span className="text-sm font-medium text-slate-900 truncate">{name}</span>
        )}
        {hasDate && formattedDate && (
          <span className="text-xs text-slate-500">{formattedDate}</span>
        )}
      </div>
    </div>
  );
}
