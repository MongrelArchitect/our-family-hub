import Image from "next/image";

import myPhoto from "@/assets/images/sean.jpg";
import logo from "@/assets/images/logo-white.png";

import Card from "./Card";

export default function About() {
  return (
    <div className="flex flex-col gap-4">
      <Card
        borderColor="border-blue-400"
        headingColor="bg-blue-200"
        heading="About The Site"
      >
        <div className="flex items-center gap-2 max-sm:flex-col sm:items-start sm:gap-4">
          <Image alt="" src={logo} height={256} width={256} />
          <div className="flex flex-col gap-4">
            <p>
              Our Family Hub is a place where users can create centralized
              spaces for their families, to keep track of events, coordinate
              tasks, discuss issues and more. We&apos;re in active and constant
              development, with plans to add features iteratively as time
              permits.
            </p>
            <p>
              This is still a relatively early phase for the site, so things
              might change quite a bit in the future and some features may break
              or be removed. For now consider this a public &quot;beta
              test&quot; of sorts.
            </p>
            <p>Have fun and welcome to Our Family Hub!</p>
          </div>
        </div>
      </Card>
      <Card
        borderColor="border-blue-400"
        headingColor="bg-blue-200"
        heading="About The Developer"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 max-sm:flex-col sm:items-start sm:gap-4">
            <Image
              alt=""
              className="rounded-full border-[8px] border-black p-2"
              src={myPhoto}
              height={256}
              width={256}
            />

            <div className="flex flex-col gap-4">
              <p>
                Our Family Hub was designed by{" "}
                <a
                  className="font-bold text-violet-800 hover:underline focus:underline"
                  href="https://seanericthomas.com"
                  target="_blank"
                >
                  Sean Eric Thomas
                </a>{" "}
                in the summer of 2024. With every project my goal is to learn at
                least one new tool, language or framework to strengthen and
                broaden my web development skill set.
              </p>
              <p>
                For this project I chose to learn{" "}
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
                simultaneously, gaining valuable experience in server side
                rendering, containerization and relational databases. You can{" "}
                <a
                  className="font-bold text-violet-800 hover:underline focus:underline"
                  href="https://github.com/MongrelArchitect/our-family-hub/"
                  target="_blank"
                >
                  view the project on GitHub
                </a>{" "}
                if you like.
              </p>
              <p>
                I&apos;m continuously working on new features for the platform
                and look forward to the next technology I&apos;ll tackle. Wish
                me luck!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
