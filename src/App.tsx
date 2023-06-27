import { Suspense } from "react";
import Nav from "./components/layout/nav";
import Card from "./components/card"
import "./assets/background.jpg"
import Table from "./components/table";

const App = () => {
  return (
    <>
        <div className="fixed h-screen w-full from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col py-32 max-w-7xl m-auto p-5">
          <div className="mb-8">
            <h2 className="text-stone-100 font-bold text-3xl">Governance</h2>
            <p className="text-white text-2xl mt-2">
              Share your opinion and shape the future of the protocol
            </p>
            <div className="flex justify-center align-center mt-20">
              <img
                src="https://cdn.stamp.fyi/space/conic-dao.eth?s=160&cb=b5e67c7ae8076518"
                alt="conic"
                width={180}
                height={180}
                className=" rounded-md"
              />
              <div className="ml-10">
                <span className="font-bold text-white text-2xl">The CNC Token</span>
                <p className="text-slate-200 text-xl">
                  The CNC Token description
                </p>
              </div>
            </div>
          </div>
          <h2 className="text-slate-200 font-bold text-3xl">Governance Apps</h2>
          <p className="text-white text-xl mt-2">
            Share your opinion and shape the future of the protocol
          </p>
          <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
            {features.map(({ title, description, link, demo }) => (
              <a href={link} key={title}>
                <Card
                  key={title}
                  title={title}
                  description={description}
                  demo={demo}
                />
              </a>
            ))}
          </div>
          <h2 className="text-slate-200 font-bold text-3xl">Governance Proxy Status</h2>
          <p className="text-white text-xl mb-6">
            Share your opinion and shape the future of the protocol
          </p>
          <Table />
        </main>
    </>
  );
};

const features = [
  {
    title: "Governance Proxy",
    description:
      "The Governance Proxy contract is the admin of all contracts in the Conic protocol. Here changes are prepared with a delay and can be vetoed by the veto multisig. Read more.",
    link: "https://docs.conic.finance/conic-finance/governance/veto-multisig",
    demo: (
      <img
        src="https://cdn.stamp.fyi/space/conic-dao.eth?s=160&cb=b5e67c7ae8076518"
        alt="conic"
        width={120}
        height={30}
        className=" rounded-md"
      />
    ),
  },
  {
    title: "Discourse",
    description:
      "The official governance discussing portal. Review live governance proposals and cast your vote on-chain.",
    link: "https://gov.conic.finance/",
    demo: (
      <img
        src="https://discourse.org/a/img/favicon.png"
        alt="Discourse"
        width={120}
        height={30}
        className=" rounded-md"
      />
    ),
  },
  {
    title: "Snapshot",
    description:
      "A simple off-chain voting interface for community members to signal sentiment during the early stages of a proposal's life cycle.",
    link: "https://vote.conic.finance/",
    demo: (
      <img
        src="https://mirror-media.imgix.net/publication-images/yWLeLSidtpBKx9meAAc0v.jpeg"
        alt="conic"
        width={120}
        height={30}
        className=" rounded-md"
      />
    ),
  },
];


export default App;
