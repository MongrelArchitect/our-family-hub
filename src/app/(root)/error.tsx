"use client";

import Image from "next/image";

import alertIcon from "@/assets/icons/alert.svg";
import Card from "@/components/Card";

interface Props {
  error: Error & { digest?: string };
}

export default function ErrorPage({ error }: Props) {
  return (
    <div className="p-2 text-lg">
      <Card
        borderColor="border-red-600"
        flair={<Image alt="" src={alertIcon} width={40} />}
        heading="Error"
        headingColor="bg-red-400"
      >
        <div className="flex flex-col gap-2">
          <p>Whoopsie doodle. Something bad happened:</p>
          <p className="text-red-700">{error.message}</p>
          <p>
            Please{" "}
            <a
              className="font-bold text-violet-700 hover:underline focus:underline"
              href="mailto:sean@ourfamilyhub.net?subject=Our Family Hub - Bug Report"
            >
              email us
            </a>{" "}
            any details about how you got here - we&apos;d appreciate it!
          </p>
        </div>
      </Card>
    </div>
  );
}
