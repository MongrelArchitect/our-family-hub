interface Props {
  children: React.ReactNode;
  flair?: React.ReactNode;
  heading: string;
  headingColor: string;
}

export default function Card({
  children,
  flair,
  heading,
  headingColor,
}: Props) {
  return (
    <div className="flex flex-col bg-slate-100 shadow-md shadow-slate-500">
      <h2
        className={`${headingColor} flex flex-wrap items-center justify-between p-2 text-2xl`}
      >
        <span>{heading}</span>
        {flair || null}
      </h2>
      <div className="p-2">{children}</div>
    </div>
  );
}
