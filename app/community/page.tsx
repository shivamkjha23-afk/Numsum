import { EmptyState } from "@/components/data-states";
import { Button, Card } from "@/components/ui";
import { getCommunityPosts } from "@/lib/repositories/firestore";

export default async function Community() {
  const posts = await getCommunityPosts();
  return (
    <main className="min-h-screen bg-navy px-6 py-10">
      <h1 className="font-display text-5xl">Community Portal</h1>
      <p className="mt-3 text-white/60">
        Community viewing remains public. Posts contain their own comments and
        replies, attached to a platform object.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/community/new">Create Discussion Post</Button>
      </div>
      <div className="mt-8 grid gap-4">
        {posts.length ? (
          posts.map((post) => (
            <Card key={post.id}>
              <p className="text-xs uppercase tracking-[.25em] text-blue-300">
                {post.associatedType || "general"}
              </p>
              <h2 className="mt-2 font-display text-2xl">{post.title}</h2>
              <p className="mt-2 text-white/70">{post.content}</p>
              <p className="mt-3 text-sm text-white/45">
                {post.comments?.length || 0} comments
              </p>
            </Card>
          ))
        ) : (
          <Card>
            <EmptyState message="Be among the first contributors" />
          </Card>
        )}
      </div>
    </main>
  );
}
