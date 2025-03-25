"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Edit, Trash, Plus, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface User {
  _id: string
  telegramId: string
  firstName: string
  username: string
  isAdmin: boolean
  isAllowed: boolean
  role: string
}

interface UserManagementProps {
  users: User[]
  onAddUser: (user: User) => void
  onUpdateUser: (user: User) => void
  onDeleteUser: (userId: string) => void
}

export function UserManagement({ users, onAddUser, onUpdateUser, onDeleteUser }: UserManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Omit<User, '_id'>>({
    telegramId: "",
    firstName: "",
    username: "",
    isAdmin: false,
    isAllowed: true,
    role: "user"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value,
      isAdmin: value === "admin"
    }));
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddUser({
      ...formData,
      _id: formData.telegramId,
    })
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser) {
      onUpdateUser(formData)
      setIsEditDialogOpen(false)
      resetForm()
    }
  }

  const handleDeleteConfirm = () => {
    if (currentUser) {
      onDeleteUser(currentUser._id)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleAllowUser = (telegramId: string) => {
    const user = users.find(u => u._id === telegramId)
    if (user) {
      onUpdateUser({ ...user, isAllowed: true })
    }
  }

  const openEditDialog = (user: User) => {
    setCurrentUser(user)
    setFormData({
      telegramId: user.telegramId,
      firstName: user.firstName,
      username: user.username,
      isAdmin: user.isAdmin,
      isAllowed: user.isAllowed,
      role: user.isAdmin ? "admin" : "user"
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      telegramId: "",
      firstName: "",
      username: "",
      isAdmin: false,
      isAllowed: false,
      role: "user"
    })
    setCurrentUser(null)
  }

  const isAdmin = (userId: string) => userId === "1535815443"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-800 hover:bg-zinc-700">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription className="text-zinc-400">Enter the details for the new user.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="id">User ID</Label>
                  <Input
                    id="id"
                    name="telegramId"
                    type="text"
                    value={formData.telegramId}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={handleSelectChange}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-zinc-800 hover:bg-zinc-700">
                  Add User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-zinc-800">
        <Table>
          <TableHeader className="bg-zinc-900">
            <TableRow className="border-zinc-800 hover:bg-zinc-900">
              <TableHead className="text-zinc-400">ID</TableHead>
              <TableHead className="text-zinc-400">Telegram ID</TableHead>
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Username</TableHead>
              <TableHead className="text-zinc-400">Role</TableHead>
              <TableHead className="text-zinc-400">Allowed</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="border-zinc-800 hover:bg-zinc-900">
                <TableCell className="font-mono">{user._id}</TableCell>
                <TableCell className="font-mono">{user.telegramId}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Badge variant={user.isAdmin ? "default" : "outline"}>
                    {user.isAdmin ? "Admin" : "User"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isAllowed ? "default" : "outline"}>
                    {user.isAllowed ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                      onClick={() => openEditDialog(user)}
                      disabled={isAdmin(user._id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-red-500"
                      onClick={() => openDeleteDialog(user)}
                      disabled={isAdmin(user._id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    {!user.isAllowed && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-green-500"
                        onClick={() => handleAllowUser(user.telegramId)}
                        disabled={isAdmin(user._id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-zinc-400">Update the user details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-id">User ID (read-only)</Label>
                <Input id="edit-id" name="telegramId" value={formData.telegramId} className="bg-zinc-800 border-zinc-700" disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-username">username</Label>
                <Input
                  id="edit-username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-zinc-800 hover:bg-zinc-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete user "{currentUser?.firstName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-900 hover:bg-red-800">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

