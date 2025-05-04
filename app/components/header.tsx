import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./user-menu"
import { getSession } from "@/lib/actions/auth"

export default async function Header() {
  const session = await getSession()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-end items-center">
        {session ? (
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        ) : (
          <Link href="/auth/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  )
}
