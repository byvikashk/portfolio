document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector(".custom-navbar");
    const collapse = document.getElementById("navbar");

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            const scrollToSection = () => {

                // Wait for collapse animation to finish
                setTimeout(() => {

                    const navbarHeight = navbar.offsetHeight;

                    const top =
                        target.getBoundingClientRect().top +
                        window.pageYOffset -
                        navbarHeight;

                    window.scrollTo({
                        top: top,
                        behavior: "smooth"
                    });

                }, 350);

            };

            // Mobile Menu Open
            if (collapse.classList.contains("show")) {

                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);

                collapse.addEventListener("hidden.bs.collapse", scrollToSection, {
                    once: true
                });

                bsCollapse.hide();
            }
            else {

                const navbarHeight = navbar.offsetHeight;

                const top =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    navbarHeight;

                window.scrollTo({
                    top: top,
                    behavior: "smooth"
                });
            }

        });

    });

});