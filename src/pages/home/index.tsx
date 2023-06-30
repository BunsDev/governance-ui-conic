import { Link } from "react-router-dom";
import Card from "../../components/card"

const features = [
    {
      title: "CNC Token",
      description:
        "CNC allows users to shift liquidity of an asset across multiple Curve pools. ",
      link: "https://docs.conic.finance/conic-finance/usdcnc-token/usdcnc-basics",
      demo: (
        <img
          src="https://conic.finance/media/token.jpg"
          alt="conic"
          width={120}
          height={30}
          className=" rounded-full"
        />
      ),
    },
    {
      title: "Governance Proxy",
      description:
        "The Governance Proxy contract is the admin of all contracts in the Conic protocol.",
      link: "/governance",
      demo: (
        <img
          src="https://cdn.stamp.fyi/space/conic-dao.eth?s=160&cb=b5e67c7ae8076518"
          alt="conic"
          width={120}
          height={30}
          className=" rounded-full"
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

export default function Home() {
    return <>
        <div className="mb-8">
            <h2 className="text-stone-100 font-bold text-3xl">Governance</h2>
            <p className="text-white text-2xl mt-2">
              Share your opinion and shape the future of the protocol
            </p>
          </div>
          <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-4 xl:px-0">
            {features.map(({ title, description, link, demo }, index) => (index === 1 ? (
              <Link to={link} key={title}>
                <Card
                  key={title}
                  title={title}
                  description={description}
                  demo={demo}
                />
              </Link>
            ) : (
                <Link target="_blank" rel="noopener noreferrer" to={link} key={title}>
                  <Card
                    key={title}
                    title={title}
                    description={description}
                    demo={demo}
                  />
                </Link>
              )))}
          </div>
    </>
}