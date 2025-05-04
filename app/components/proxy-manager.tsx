"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Plus, Trash2, RefreshCw } from "lucide-react"

// Mock proxy data
const mockProxies = [
  {
    id: "1",
    host: "proxy1.example.com",
    port: "8080",
    username: "user1",
    active: true,
    lastUsed: "2023-05-01T12:30:00Z",
    status: "working",
  },
  {
    id: "2",
    host: "proxy2.example.com",
    port: "3128",
    username: "user2",
    active: true,
    lastUsed: "2023-04-30T15:45:00Z",
    status: "working",
  },
  {
    id: "3",
    host: "proxy3.example.com",
    port: "8080",
    username: "user3",
    active: false,
    lastUsed: "2023-04-29T09:15:00Z",
    status: "failed",
  },
]

export default function ProxyManager() {
  const [proxies, setProxies] = useState(mockProxies)
  const [newProxy, setNewProxy] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
  })
  const [isRotationEnabled, setIsRotationEnabled] = useState(true)
  const [isTestingProxy, setIsTestingProxy] = useState(false)
  const [isAddingProxy, setIsAddingProxy] = useState(false)

  const handleAddProxy = () => {
    if (!newProxy.host || !newProxy.port) {
      toast({
        title: "Error",
        description: "Host and port are required",
        variant: "destructive",
      })
      return
    }

    setIsAddingProxy(true)

    // Simulate API call
    setTimeout(() => {
      const newProxyItem = {
        id: `proxy-${Date.now()}`,
        host: newProxy.host,
        port: newProxy.port,
        username: newProxy.username,
        active: true,
        lastUsed: null,
        status: "untested",
      }

      setProxies([...proxies, newProxyItem])
      setNewProxy({
        host: "",
        port: "",
        username: "",
        password: "",
      })
      setIsAddingProxy(false)

      toast({
        title: "Proxy Added",
        description: "The proxy has been added to your rotation",
      })
    }, 1000)
  }

  const handleDeleteProxy = (id: string) => {
    setProxies(proxies.filter((proxy) => proxy.id !== id))
    toast({
      title: "Proxy Removed",
      description: "The proxy has been removed from your rotation",
    })
  }

  const handleToggleProxy = (id: string) => {
    setProxies(proxies.map((proxy) => (proxy.id === id ? { ...proxy, active: !proxy.active } : proxy)))

    const proxy = proxies.find((p) => p.id === id)
    toast({
      title: proxy?.active ? "Proxy Disabled" : "Proxy Enabled",
      description: `The proxy has been ${proxy?.active ? "disabled" : "enabled"}`,
    })
  }

  const handleTestProxy = (id: string) => {
    setIsTestingProxy(true)

    // Simulate API call
    setTimeout(() => {
      setProxies(
        proxies.map((proxy) =>
          proxy.id === id ? { ...proxy, status: "working", lastUsed: new Date().toISOString() } : proxy,
        ),
      )
      setIsTestingProxy(false)

      toast({
        title: "Proxy Test Successful",
        description: "The proxy is working correctly",
      })
    }, 1500)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Proxy Manager</CardTitle>
            <CardDescription>Manage and rotate proxies for your scraping tasks</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="proxy-rotation" className="text-sm">
              Proxy Rotation
            </Label>
            <Switch id="proxy-rotation" checked={isRotationEnabled} onCheckedChange={setIsRotationEnabled} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              placeholder="proxy.example.com"
              value={newProxy.host}
              onChange={(e) => setNewProxy({ ...newProxy, host: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              placeholder="8080"
              value={newProxy.port}
              onChange={(e) => setNewProxy({ ...newProxy, port: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username (optional)</Label>
            <Input
              id="username"
              placeholder="username"
              value={newProxy.username}
              onChange={(e) => setNewProxy({ ...newProxy, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password (optional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={newProxy.password}
              onChange={(e) => setNewProxy({ ...newProxy, password: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleAddProxy} disabled={isAddingProxy}>
            <Plus className="h-4 w-4 mr-2" />
            {isAddingProxy ? "Adding..." : "Add Proxy"}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Host</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proxies.map((proxy) => (
              <TableRow key={proxy.id}>
                <TableCell>{proxy.host}</TableCell>
                <TableCell>{proxy.port}</TableCell>
                <TableCell>{proxy.username || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      proxy.status === "working" ? "default" : proxy.status === "failed" ? "destructive" : "outline"
                    }
                  >
                    {proxy.status === "working" ? "Working" : proxy.status === "failed" ? "Failed" : "Untested"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(proxy.lastUsed)}</TableCell>
                <TableCell>
                  <Switch checked={proxy.active} onCheckedChange={() => handleToggleProxy(proxy.id)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTestProxy(proxy.id)}
                      disabled={isTestingProxy}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDeleteProxy(proxy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {proxies.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No proxies added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          {proxies.filter((p) => p.active).length} active proxies in rotation
        </div>
        <Button variant="outline">Import Proxies</Button>
      </CardFooter>
    </Card>
  )
}
