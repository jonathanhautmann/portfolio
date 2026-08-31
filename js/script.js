/* =========================================================
   JONATHAN HAUTMANN — PORTFOLIO
   Main JavaScript
========================================================= */


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");


menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("open");

});


/* Close mobile menu after clicking a link */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

    });

});


/* =========================================================
   SCROLL REVEAL ANIMATIONS
========================================================= */

const revealElements = document.querySelectorAll(
    ".section, .project, .skill-card, .timeline-item"
);


const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =========================================================
   NAVIGATION — ACTIVE SECTION
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navigationItems = document.querySelectorAll(".nav-links a");


const sectionObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const currentSection = entry.target.getAttribute("id");


                navigationItems.forEach(link => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${currentSection}`
                    ) {

                        link.classList.add("active");

                    }

                });

            }

        });

    },

    {
        threshold: 0.35
    }

);


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* =========================================================
   HEADER BACKGROUND ON SCROLL
========================================================= */

const navbar = document.querySelector(".navbar");


window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   PROJECT HOVER EFFECT
========================================================= */

const projects = document.querySelectorAll(".project");


projects.forEach(project => {

    project.addEventListener("mouseenter", () => {

        project.classList.add("hovered");

    });


    project.addEventListener("mouseleave", () => {

        project.classList.remove("hovered");

    });

});


/* =========================================================
   CURRENT YEAR
========================================================= */

const footerYear = document.querySelector("footer span");

if (footerYear) {

    footerYear.textContent =
        `© ${new Date().getFullYear()} Jonathan Hautmann`;

}


/* =========================================================
   EMAIL PROTECTION / CONTACT
========================================================= */

const emailLinks = document.querySelectorAll(
    'a[href^="mailto:"]'
);


emailLinks.forEach(link => {

    link.addEventListener("click", () => {

        console.log(
            "Contact link opened."
        );

    });

});


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%cJonathan Hautmann Portfolio",
    "font-size:20px;font-weight:bold;color:#b9ff4a;"
);

console.log(
    "Thanks for checking out the code."
);