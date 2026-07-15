import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { CONTACT_EMAIL, RESUME_FILE, SOCIAL_LINKS } from "@/lib/site";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div>
      <section>
        <h1 className="text-2xl font-semibold">Moustafa Ellithy</h1>
        <p className="mt-4 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button
            asChild
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent-hover"
          >
            <a href={RESUME_FILE} download>
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Email Moustafa Ellithy"
          >
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Mail className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="GitHub profile"
          >
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="LinkedIn profile"
          >
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Recent writing</h2>
        <ul className="mt-4 space-y-4">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                className="font-medium text-accent underline hover:text-accent-hover"
              >
                {post.title}
              </Link>
              <p className="text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
        <Link
          href="/writing"
          className="mt-4 inline-block text-sm text-accent underline hover:text-accent-hover"
        >
          All posts →
        </Link>
      </section>
    </div>
  );
}
