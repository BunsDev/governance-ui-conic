import useScroll from "../../hooks/use-scroll";
import logo from '../../assets/logo.svg'

export default function NavBar() {
  const scrolled = useScroll(50);

  return (
    <>
      <div
        id="navbar"
        className={`fixed top-0 w-full ${
          scrolled
            ? " opacity-50"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <a href="/" className="flex items-center font-display text-2xl">
            <img
              src={logo}
              alt="Precedent logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            />
          </a>
          <div>
            <button
              className="button rounded-full border border-black bg-black p-1.5 px-4 text-xl text-white transition-all hover:bg-white hover:text-black"
              onClick={() => {}}
            >
              Launch
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
