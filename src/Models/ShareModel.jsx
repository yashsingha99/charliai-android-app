"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger
} from "../Components/ui/dialog"
import { Button } from "../Components/ui/button"
import { Mail, Share, Twitter } from "lucide-react"
import { BsWhatsapp } from "react-icons/bs"
import { SiTelegram } from "react-icons/si"
import { SidebarMenuButton } from "../Components/ui/sidebar"

export default function ShareModal({ id}) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}?chatId=${id}`)
    }
  }, [id])

  const text = `Check this out: ${url}`

  const handleShare = (platform) => {
    let shareUrl = ""

    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(shareUrl, "_blank")
        break
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        window.open(shareUrl, "_blank")
        break
      case "email":
        shareUrl = `mailto:?subject=Check this out&body=${encodeURIComponent(text)}`
        window.location.href = shareUrl
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
        window.open(shareUrl, "_blank")
        break
      case "upi":
        shareUrl = `upi://pay?pa=yourupi@upi&pn=YourName&am=1&cu=INR`
        window.location.href = shareUrl
        break
      default:
        break
    }
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
          <SidebarMenuButton
            className="flex items-center gap-2 w-full"
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="w-full sm:rounded-2xl p-6 border border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Share</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 mt-6 place-items-center">
          <Button
            variant="ghost"
            className="p-3 hover:scale-105 transition"
            onClick={() => handleShare("whatsapp")}
            title="WhatsApp"
          >
            <BsWhatsapp className="w-12 h-12 text-green-600" />
          </Button>

          <Button
            variant="ghost"
            className="p-3 hover:scale-105 transition"
            onClick={() => handleShare("telegram")}
            title="Telegram"
          >
            <SiTelegram className="w-12 h-12 text-sky-500" />
          </Button>

          <Button
            variant="ghost"
            className="p-3 hover:scale-105 transition"
            onClick={() => handleShare("email")}
            title="Email"
          >
            <Mail className="w-12 h-12 text-red-500" />
          </Button>

          <Button
            variant="ghost"
            className="p-3 hover:scale-105 transition"
            onClick={() => handleShare("twitter")}
            title="Twitter"
          >
            <Twitter className="w-12 h-12 text-blue-500" />
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
