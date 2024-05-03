import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/server/db'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()
  console.log(data)
  if (!data.session?.user) {
    redirect('/login')
  }

  const notes = await db.note.findMany({
    where: { userId: data.session.user.id },
  })
  return (
    <div>
      <h1 className="mb-8 text-center text-2xl">Protected page</h1>
      <pre>{JSON.stringify({ session: data.session, notes }, null, 4)}</pre>
    </div>
  )
}
