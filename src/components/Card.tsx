interface Props {
  borderColor: string;
  children: React.ReactNode;
  flair?: React.ReactNode;
  heading: string;
  headingColor: string;
}

export default function Card({
  borderColor,
  children,
  flair,
  heading,
  headingColor,
}: Props) {
  return (
    <div
      className={`${borderColor} flex flex-col rounded-t-2xl border-t-4 bg-slate-100 shadow-md shadow-slate-500`}
    >
      <h2
        className={`${headingColor} flex flex-wrap items-center justify-between rounded-t-2xl p-2 text-2xl`}
      >
        <span>{heading}</span>
        {flair || null}
      </h2>
      <div className="p-2">{children}</div>
    </div>
  );
}
