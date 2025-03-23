"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    siteName: "Streaming Platform",
    allowRegistration: false,
    requireApproval: true,
    maxVideosPerUser: 5,
    enableComments: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setSettings({ ...settings, [name]: Number.parseInt(value) })
    } else {
      setSettings({ ...settings, [name]: value })
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({ ...settings, [name]: checked })
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <p className="text-zinc-400">Configure your streaming platform settings.</p>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-900/20 text-green-400 border-green-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">General Settings</h3>
          <Separator className="bg-zinc-800" />

          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">User Settings</h3>
          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowRegistration">Allow Registration</Label>
              <p className="text-sm text-zinc-400">Allow new users to register through Telegram</p>
            </div>
            <Switch
              id="allowRegistration"
              checked={settings.allowRegistration}
              onCheckedChange={(checked) => handleSwitchChange("allowRegistration", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requireApproval">Require Approval</Label>
              <p className="text-sm text-zinc-400">New users require admin approval before accessing content</p>
            </div>
            <Switch
              id="requireApproval"
              checked={settings.requireApproval}
              onCheckedChange={(checked) => handleSwitchChange("requireApproval", checked)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maxVideosPerUser">Max Videos Per User</Label>
            <Input
              id="maxVideosPerUser"
              name="maxVideosPerUser"
              type="number"
              min="1"
              max="100"
              value={settings.maxVideosPerUser}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Content Settings</h3>
          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableComments">Enable Comments</Label>
              <p className="text-sm text-zinc-400">Allow users to comment on videos</p>
            </div>
            <Switch
              id="enableComments"
              checked={settings.enableComments}
              onCheckedChange={(checked) => handleSwitchChange("enableComments", checked)}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="bg-zinc-800 hover:bg-zinc-700" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-100" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

