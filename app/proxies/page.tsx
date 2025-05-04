import ProxyManager from "../components/proxy-manager"

export default function ProxiesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Proxy Management</h1>
      <p className="text-muted-foreground">
        Configure and manage proxies for your web scraping tasks to avoid rate limiting and IP blocks.
      </p>

      <ProxyManager />
    </div>
  )
}
