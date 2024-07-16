interface Props {
  children: React.ReactNode;
  heading: string;
  headingColor: string;
}

export default function Card({ children, heading, headingColor }: Props) {
  return (
    <div className="flex flex-col bg-slate-100 shadow-md shadow-slate-500">
      <h2 className={`${headingColor} p-2 text-2xl`}>{heading}</h2>
      <div className="p-2">{children}</div>
    </div>
  );
}
