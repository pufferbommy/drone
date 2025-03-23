import { useEffect, useRef } from "react";

export default function Navigation(props) {
  const navRef = useRef(null);

  useEffect(() => {
    const updateUnderline = () => {
      const activeButton = navRef.current.querySelector(".active");

      if (!activeButton) return;

      navRef.current.style.setProperty("--before-width", `${activeButton.offsetWidth}px`);
      navRef.current.style.setProperty("--before-left", `${activeButton.offsetLeft}px`);
      
      if (scroll) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    };

    updateUnderline();

    const handleResize = () => updateUnderline();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [props.currentPage]);

  return (
    <nav>
      <ul ref={navRef}>
        {Object.keys(props.pages).map((key) => (
          <li key={key}>
            <button
              className={props.currentPage === key ? "active" : undefined}
              onClick={() => props.setCurrentPage(key)}
            >
              {props.pages[key].name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}