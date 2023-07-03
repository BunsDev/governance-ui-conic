import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";
import rehypeRaw from "rehype-raw";

export default function Card({
  title,
  description,
  demo,
  large,
}: {
  title: string;
  description: string;
  demo: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`bg-skin-block-bg relative col-span-1 h-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:opacity-90 ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="pt-10 pb-5 px-10">{demo}</div>
      <div className="mx-auto h-full max-w-md px-10">
        <h2 className="font-bold md:text-2xl md:font-normal">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="prose-sm -mt-2 leading-normal text-gray-500 md:prose mt-2">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
