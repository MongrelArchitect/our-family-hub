import Card from "@/components/Card";

export default function About() {
  return (
    <div className="flex flex-col gap-4">
      <Card
        borderColor="border-blue-400"
        headingColor="bg-blue-200"
        heading="About The Site"
      >
        <div className="flex flex-col gap-4">
          <p>
            Our Family Hub is a place where users can create centralized spaces
            for their families, to keep track of events, coordinate tasks,
            discuss issues and more. We&apos;re in active and constant
            development, with plans to add features iteratively as time permits.
          </p>
          <p>
            This is still a relatively early phase for the site, so things might
            change quite a bit in the future and some features may break or be
            removed. For now consider this a public &quot;beta test&quot; of
            sorts.
          </p>
          <p>Have fun and welcome to Our Family Hub!</p>
        </div>
      </Card>
      <Card
        borderColor="border-blue-400"
        headingColor="bg-blue-200"
        heading="About The Developer"
      >
        <div className="flex flex-col gap-4">
          <p>
            Our Family Hub was designed by me,{" "}
            <a
              className="font-bold text-violet-800 hover:underline focus:underline"
              href="https://seanericthomas.com"
              target="_blank"
            >
              Sean Eric Thomas
            </a>
            , in the summer of 2024. With every project I make my goal is to
            learn at least one new tool, language, framework, anything I can add
            to my web development skillset.
          </p>
          <p>
            I decided to learn{" "}
            <a
              className="font-bold text-violet-800 hover:underline focus:underline"
              href="https://nextjs.org/"
              target="_blank"
            >
              Next.js
            </a>
            ,{" "}
            <a
              className="font-bold text-violet-800 hover:underline focus:underline"
              href="https://www.docker.com/"
              target="_blank"
            >
              Docker
            </a>{" "}
            and{" "}
            <a
              className="font-bold text-violet-800 hover:underline focus:underline"
              href="https://www.postgresql.org/"
              target="_blank"
            >
              PostgreSQL
            </a>{" "}
            simultaneously for this project and have gained useful knowledge
            about server side rendering, containerization and relational
            databases.
          </p>
          <p>
            I&apos;ll keep working to add new features here, and look forward to
            whatever I decide to learn next. Maybe Java? Wish me luck!
          </p>
        </div>
      </Card>
    </div>
  );
}
