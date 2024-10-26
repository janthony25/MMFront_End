// MOBILE NAVIGATION
const btnNavEl = document.querySelector('.btn-mobile-nav');
const headerEl = document.querySelector('.header');
const htmlEl = document.documentElement;
const mainNav = document.querySelector('.main-nav'); // Add this line

// Remove duplicate code and combine mobile nav and sticky nav functionality
if (btnNavEl && headerEl && htmlEl) {
    btnNavEl.addEventListener('click', function() {
        headerEl.classList.toggle('nav-open');
        htmlEl.classList.toggle('no-scroll');
        mainNav.classList.toggle('nav-open'); // Add this line
    });
}

// STICKY NAVIGATION
document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.querySelector('.nav-container');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navContainer.classList.remove('sticky-nav');
            return;
        }
        
        if (currentScroll > 100) {
            navContainer.classList.add('sticky-nav');
        } else {
            navContainer.classList.remove('sticky-nav');
        }

        lastScroll = currentScroll;
    });
});

// ACCORDION
document.querySelectorAll('.accordion .contentBx').forEach(contentBx => {
    contentBx.addEventListener('click', function() {
        this.classList.toggle('active');

        // Hide content of all other contentBx elements
        document.querySelectorAll('.accordion .contentBx').forEach(otherContentBx => {
            if (otherContentBx !== this) {
                otherContentBx.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // HOME Head
    function handleResize() {
        const mediaQuery = window.matchMedia('(min-width: 1400px)');
        const headerWelcomeParagraph = document.querySelector('.header-welcome p');
        
        if (headerWelcomeParagraph) {
            if (mediaQuery.matches) {
                headerWelcomeParagraph.innerHTML = 'At Mobile Mekaniko, we bring the garage to you! Our team of qualified mechanics is dedicated to <br> providing top-notch service at an affordable price';
            } else {
                headerWelcomeParagraph.innerHTML = 'At Mobile Mekaniko, we bring the garage to you! Our team of qualified mechanics is dedicated to providing top-notch service at an affordable price';
            }
        }
    }

    // Attach event listener to window resize
    window.addEventListener('resize', handleResize);
    
    // Initial check on page load
    handleResize();

    // Services Head
    function servicesResize() {
        const mediaQuery = window.matchMedia('(min-width: 1110px)');
        const servicesWelcomeParagraph = document.querySelector('.services-header-welcome p');
        
        if (servicesWelcomeParagraph) {
            if (mediaQuery.matches) {
                servicesWelcomeParagraph.innerHTML = 'At Mobile Mekaniko, we provide a full range of automotive services to keep your vehicle in top <br> shape. Our expert mechanics deliver high-quality, convenient, and affordable care to your location.';
            } else {
                servicesWelcomeParagraph.innerHTML = 'At Mobile Mekaniko, we provide a full range of automotive services to keep your vehicle in top shape. Our expert mechanics deliver high-quality, convenient, and affordable care to your location.';
            }
        }
    }

    window.addEventListener('resize', servicesResize);
    servicesResize();
});

// REMOVING PHOTOS IN SERVICES WHEN SCREEN SIZE IS < 991PX
const serviceImageContainerHTML = `
      <div class="col-6 service-image-container d-flex justify-content-center align-items-center">
        <div class="image">
          <img src="/Photos/Car-Service3.jpg" alt="">
          <div class="image-content d-flex flex-column justify-content-center align-items-center p-4">
            <h4 class="text-center">Our team of expert mechanics ensures that your vehicle receives thorough and reliable maintenance without the hassle of visiting a workshop.</h4>
            <a class="btn btn-warning">Get a Quote</a>
          </div>
        </div>
      </div>
    `;

function addServiceImageContainers() {
    // Get all service rows
    const serviceRows = document.querySelectorAll('.service-row');

    // Check viewport width
    const isLargeScreen = window.innerWidth >= 991;

    // Iterate through each service row
    serviceRows.forEach(row => {
        const existingImageContainer = row.querySelector('.service-image-container');
        if (isLargeScreen && !existingImageContainer) {
            // Add the service image container if screen width is 991px or greater and the container doesn't exist
            const div = document.createElement('div');
            div.innerHTML = serviceImageContainerHTML;
            row.prepend(div.firstElementChild);
        }
    });
}

function removeServiceImageContainers() {
    // Get all elements with class name service-image-container
    const serviceImageContainers = document.querySelectorAll('.service-image-container');

    // Check viewport width
    const isSmallScreen = window.innerWidth < 991;

    // Iterate through each service-image-container element
    serviceImageContainers.forEach(container => {
        if (isSmallScreen) {
            // Remove element if screen width is less than 991px
            container.remove();
        }
    });
}

function toggleServiceImageContainers() {
    if (window.innerWidth < 991) {
        removeServiceImageContainers();
    } else {
        addServiceImageContainers();
    }
}

// Initial call to toggle elements based on current viewport width
toggleServiceImageContainers();

// Event listener for window resize to dynamically toggle elements
window.addEventListener('resize', toggleServiceImageContainers);


// REMOVING THE IMG CONTAINER WHEN SCREEN IS < 48em
let imgContainer;

function handleSectionChooseImgContainer() {
    const parentElement = document.querySelector('.section-choose .row');
    const existingImgContainer = document.querySelector('.section-choose-img-container');
    
    if (window.matchMedia("(max-width: 48em)").matches) {
        if (existingImgContainer) {
            imgContainer = existingImgContainer;
            imgContainer.remove();
        }
    } else {
        if (imgContainer && !existingImgContainer) {
            parentElement.prepend(imgContainer);
        }
    }
}

// Run the function when the page loads
handleSectionChooseImgContainer();

// Add a listener to run the function whenever the screen size changes
window.addEventListener('resize', handleSectionChooseImgContainer);

document.addEventListener('DOMContentLoaded', function() {
    const description = document.getElementById('contact-description');
    const defaultText = "Contact Mobile Mekaniko for reliable, affordable mobile auto services. We're ready to answer your questions and schedule your appointment.";
    const mobileText = "Contact Mobile Mekaniko for reliable, affordable mobile auto services.";

    if (description) {
        function updateText() {
            if (window.innerWidth <= 768) { // 48em * 16px/em
                description.textContent = mobileText;
            } else {
                description.textContent = defaultText;
            }
        }
    
        window.addEventListener('resize', updateText);
        updateText(); // Initial call to set the text correctly based on the initial window size
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const breakElement = document.getElementById('break');

    if (breakElement) {
        function checkMedia() {
            if (window.innerWidth <= 768) { // 48em * 16px/em
                breakElement.style.display = 'none'; // Hides the <br> element
            } else {
                breakElement.style.display = 'inline'; // Restores the <br> element
            }
        }

        window.addEventListener('resize', checkMedia);
        checkMedia(); // Call the function on initial load
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const mediaQuery = window.matchMedia('(max-width: 61.9375em)');
    const brElement = document.getElementById('contact-break');

    if (brElement) {
        function handleBreakpoint(e) {
            if (e.matches) {
                // If the media query matches, hide the <br>
                brElement.style.display = 'none';
            } else {
                // Otherwise, show the <br>
                brElement.style.display = 'inline';
            }
        }

        mediaQuery.addListener(handleBreakpoint); // Add listener for changes
        handleBreakpoint(mediaQuery); // Call once on load to set initial state
    }
});

// WHY CHOOSE US TITLE <br>
document.addEventListener('DOMContentLoaded', function() {
    const query = window.matchMedia('(max-width: 34.75em)');
    const originalParent = document.querySelector('.section-choose-title');
    const brElement = document.getElementById('section-choose-break');
    let brPlaceholder = document.createComment('br placeholder'); // Create a placeholder comment

    if (brElement) {
        function handleBreakpointChange(e) {
            if (e.matches) {
                // If the viewport is less than or equal to 34.75em
                if (brElement) {
                    brElement.replaceWith(brPlaceholder); // Replace <br> with a placeholder
                }
            } else {
                // If the viewport is greater than 34.75em
                if (brPlaceholder.parentNode) {
                    brPlaceholder.replaceWith(brElement); // Replace placeholder with <br>
                }
            }
        }

        query.addListener(handleBreakpointChange); // Attach listener to respond on change
        handleBreakpointChange(query); // Call initially to set the correct state
    }
});

// Index html - customer-text
document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('customer-text');
    const fullText = 'Keeping our Customers Happy is at the heart of what we do';
    const shortText = 'Keeping our Customers Happy';
    const query = window.matchMedia('(max-width: 34.75em)');

    if (textElement) {
        function updateTextContent(e) {
            if (e.matches) {
                // If the viewport is less than or equal to 34.75em
                textElement.textContent = shortText;
            } else {
                // If the viewport is greater than 34.75em
                textElement.textContent = fullText;
            }
        }

        query.addListener(updateTextContent); // Attach listener to respond on change
        updateTextContent(query); // Call initially to set the correct state
    }
});

// REMOVING IMG ROW FROM BOOK A MEKANIKO AT 474px BELOW
document.addEventListener('DOMContentLoaded', function() {
    const query = window.matchMedia('(max-width: 34.75em)');
    const imageContainer = document.querySelector('.section-contact-image');
    
    // Create a placeholder for the image container to restore it later
    let placeholder = document.createElement('div');
    placeholder.classList.add('section-contact-image-placeholder');

    if (imageContainer) {
        function toggleImageVisibility(e) {
            if (e.matches) {
                // If the viewport is 29.625em or less, remove the image container
                if (imageContainer.parentNode) {
                    imageContainer.parentNode.replaceChild(placeholder, imageContainer);
                }
            } else {
                // If the viewport is wider than 29.625em, add the image container back
                if (placeholder.parentNode) {
                    placeholder.parentNode.replaceChild(imageContainer, placeholder);
                }
            }
        }

        query.addListener(toggleImageVisibility); // Attach listener to respond on change
        toggleImageVisibility(query); // Call initially to set the correct state
    }
});

// LOWEST PRICE (WHY CHOOSE US) REMOVED at 28em
document.addEventListener('DOMContentLoaded', function() {
    const mediaQuery = window.matchMedia('(max-width: 28.5625em)');
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    function updateStyles() {
        if (mediaQuery.matches) {
            // Hide the ::before content when the viewport is less than or equal to 28.5625em
            styleElement.textContent = `.section-choose-list-affordable::before { display: none; }`;
        } else {
            // Remove the style to bring back the default styling when the viewport is wider
            styleElement.textContent = '';
        }
    }

    mediaQuery.addListener(updateStyles);
    updateStyles(); // Apply initially based on the current viewport size
});

// CONVENIENT REPAIR (CHOOSE List) Revised at 28em
document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('repair-text');
    const originalText = 'Convenient On-Site Repair for Your Vehicle';
    const shortText = 'Convenient On-Site Repair';
    const mediaQuery = window.matchMedia('(max-width: 28.5625em)');

    if (textElement) {
        function updateTextContent() {
            if (mediaQuery.matches) {
                // If the viewport is less than or equal to 28.5625em
                textElement.textContent = shortText;
            } else {
                // If the viewport is greater than 28.5625em
                textElement.textContent = originalText;
            }
        }

        mediaQuery.addListener(updateTextContent); // Attach listener to respond on change
        updateTextContent(); // Call initially to set the correct state based on the current viewport size
    }
});

// Footer adjustment if max-width is 556px below
document.addEventListener("DOMContentLoaded", function() {
    const serviceLinksContainer = document.querySelector('.footer .col-3:nth-child(2)');  // Assuming this is the correct container based on your HTML
    const originalContent = serviceLinksContainer ? serviceLinksContainer.innerHTML : ''; // Save original content to restore later

    if (serviceLinksContainer) {
        function updateFooterLinks() {
            // Define the links for small screens
            const smallScreenLinks = `
                <h3>Services</h3>
                <a href="/services.html#servicing">Car Servicing</a>
                <a href="/services.html#repairs">Car Repairs</a>
                <a href="/services.html#tyres">Tyres</a>
                <a href="/services.html#brakes">Brakes</a>
            `;

            // Check current viewport width
            if (window.innerWidth <= 558) { // 34.75em * 16 (assuming 1em = 16px)
                serviceLinksContainer.innerHTML = smallScreenLinks; // Apply small screen links
            } else {
                serviceLinksContainer.innerHTML = originalContent; // Restore original links
            }
        }

        // Run on initial load
        updateFooterLinks();

        // Add listener for resizing the window
        window.addEventListener('resize', updateFooterLinks);
    }
});

// YEAR ON FOOTER and Changing location
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('year');
    const locationColumn = document.querySelector('.footer .col-3:nth-child(3)');
    const originalColumn = document.querySelector('.footer .col-3:nth-child(1)');

    if (yearElement && locationColumn && originalColumn) {
        // Update the year
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `&copy; ${currentYear} Mobile Mekaniko. All Rights Reserved.`;

        function moveYearElement() {
            if (window.innerWidth <= 556) {
                if (!locationColumn.contains(yearElement)) {
                    locationColumn.appendChild(yearElement);
                }
            } else {
                if (!originalColumn.contains(yearElement)) {
                    originalColumn.appendChild(yearElement);
                }
            }
        }

        // Initial call to move the element based on the current window size
        moveYearElement();

        // Add an event listener to handle window resize
        window.addEventListener('resize', moveYearElement);
    }
});

// View all Services button
document.addEventListener('DOMContentLoaded', function() {
    const viewAllServicesButton = document.getElementById('viewAllServicesButton');
    const carServicingCard = document.getElementById('carServicingCard');
    const carRepairCard = document.getElementById('carRepairCard');
    const carTyresCard = document.getElementById('carTyresCard');
    const carBrakesCard = document.getElementById('carBrakesCard');

    if (viewAllServicesButton) {
        viewAllServicesButton.addEventListener('click', function () {
            window.location.href = 'services.html';
        });
    }

    if (carServicingCard) {
        carServicingCard.addEventListener('click', function () {
            window.location.href = 'services.html#repairs';
        });
    }

    if (carRepairCard) {
        carRepairCard.addEventListener('click', function(){
            window.location.href = 'services.html#servicing';
        });
    }

    if (carTyresCard) {
        carTyresCard.addEventListener('click', function(){
            window.location.href = 'services.html#brakes';
        });
    }

    if (carBrakesCard) {
        carBrakesCard.addEventListener('click', function(){
            window.location.href = 'services.html#paint';
        });
    }
});

// ACTIVE PAGE
document.addEventListener('DOMContentLoaded', function () {
    console.log("Script is running on all pages");

    const currentPath = window.location.pathname;
    console.log("Current path: ", currentPath);

    const navLinks = document.querySelectorAll('.main-nav-link');
    console.log("Number of nav links found: ", navLinks.length);

    navLinks.forEach(link => {
        console.log("Link path: ", link.pathname);

        if (link.pathname === currentPath) {
            console.log("Match found: ", link);
            link.classList.add('active');
        }
    });
});

function SendMail() {
    console.log("button clicked.");

    // Get form values and check if they exist
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let rego = document.getElementById("rego").value;
    let contact = document.getElementById("contactNumber").value;
    let subject = document.getElementById("serviceTypeSelect").value;
    let message = document.getElementById("contact-message").value;

    // Log each value separately to ensure they are correctly fetched
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Rego: ", rego);
    console.log("Contact: ", contact);
    console.log("Subject: ", subject);
    console.log("Message: ", message);

    // Check if values are empty
    if (!rego) {
      console.error("Rego is empty.");
    }
    if (!contact) {
      console.error("Contact is empty.");
    }

    let params = {
      name: name,
      email: email,
      rego: rego,                  // Matches {{rego}} in the template
      contact: contact,            // Matches {{contact}} in the template
      subject: subject,
      message: message
    };

    console.log("Parameters to be sent: ", params);  // Log params to ensure they are correct

    // Ensure that required fields are filled before sending the email
    if (!name || !email || !rego || !contact || !subject || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Send the email via EmailJS
    emailjs.send("service_xoxcz9b", "template_fk9os97", params)
      .then(function(response) {
        alert('Email successfully sent!');

        
      })
      .catch(function(error) {
        alert('Failed to send email.');
      });
  }
