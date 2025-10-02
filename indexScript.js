const cursor = document.getElementById("cursor") 
const hoverElements = document.querySelectorAll("a, .close-btn, .skill-item, .cta-button, .contact-link, .review-card, .time-info-container") 

let forceCenter = null
let cursorSize = { width: 20, height: 20 } 
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
let target = { x: mouse.x, y: mouse.y } 
let rotation = 0
let canSpin = true

document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX 
    mouse.y = e.clientY 
}) 

function animateCursor() {
    if (forceCenter) {
        const rect = forceCenter.getBoundingClientRect() 
        target.x = rect.left + rect.width / 2 
        target.y = rect.top + rect.height / 2 

        cursorSize.width = rect.width 
        cursorSize.height = rect.height 
    } else {
        target.x = mouse.x 
        target.y = mouse.y 

        cursorSize.width = 20 
        cursorSize.height = 20 
    }

    const lerp = (a, b, n) => (1 - n) * a + n * b 

    const currentX = parseFloat(cursor.style.left) || 0 
    const currentY = parseFloat(cursor.style.top) || 0 
    const currentW = parseFloat(cursor.style.width) || 12 
    const currentH = parseFloat(cursor.style.height) || 12 

    const newX = lerp(currentX, target.x, 0.2) 
    const newY = lerp(currentY, target.y, 0.2) 
    const newW = lerp(currentW, cursorSize.width, 0.2) 
    const newH = lerp(currentH, cursorSize.height, 0.2) 

    cursor.style.left = `${newX}px` 
    cursor.style.top = `${newY}px` 
    cursor.style.width = `${newW}px` 
    cursor.style.height = `${newH}px` 

    if (canSpin) {
        rotation += 4
        cursor.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
    }

    requestAnimationFrame(animateCursor) 
}
animateCursor() 

hoverElements.forEach(element => {
    element.addEventListener("mouseenter", () => {
        forceCenter = element 
        canSpin = false
        cursor.style.transform = `translate(-50%, -50%) rotate(0deg)`
        cursor.classList.add("hover") 
    }) 

    element.addEventListener("mouseleave", () => {
        forceCenter = null 
        cursor.classList.remove("hover") 
        canSpin = true
    }) 
}) 

window.addEventListener("scroll", () => {
    if (forceCenter) {
        const rect = forceCenter.getBoundingClientRect() 
        if (rect.bottom < 0 || rect.top > window.innerHeight ||
            rect.right < 0 || rect.left > window.innerWidth) {
            forceCenter = null 
            cursor.classList.remove("hover") 
        }
    }
}) 

let isScrolling = false 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault() 
        if (isScrolling) return 

        isScrolling = true 
        const target = document.querySelector(this.getAttribute("href")) 
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80 
            const startPosition = window.pageYOffset 
            const distance = targetPosition - startPosition 
            const duration = 1500 
            let start = null 

            function animation(currentTime) {
                if (start === null) start = currentTime 
                const timeElapsed = currentTime - start 
                const run = easeInOutCubic(timeElapsed, startPosition, distance, duration) 
                window.scrollTo(0, run) 
                if (timeElapsed < duration) requestAnimationFrame(animation) 
                else isScrolling = false 
            }

            function easeInOutCubic(t, b, c, d) {
                t /= d / 2 
                if (t < 1) return c / 2 * t * t * t + b 
                t -= 2 
                return c / 2 * (t * t * t + 2) + b 
            }

            requestAnimationFrame(animation) 
        }
    }) 
}) 

window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset 
    const header = document.querySelector(".header") 
    header.style.transform = `translateY(${scrolled * 0.5}px)` 
}) 

const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
} 

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove("hidden") 
            entry.target.classList.add("visible") 
        } else {
            entry.target.classList.remove("visible") 
            entry.target.classList.add("hidden") 
        }
    }) 
}, observerOptions) 

document.querySelectorAll(".project-card, .skill-item, .review-card, h2, .contact")
    .forEach(el => {
        el.classList.add("scroll-animate") 
        observer.observe(el) 
    }) 


async function updateTimeInfo() {
    try {
        const now = new Date() 
        
        const berlinTime = new Date().toLocaleString("en-US", {
            timeZone:"Europe/Berlin",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }) 
        
        const berlinFullTime = new Date().toLocaleString("sv-SE", {timeZone:"Europe/Berlin"}) 
        const utcTime = new Date().toLocaleString("sv-SE", {timeZone:"UTC"}) 
        
        const berlinMs = new Date(berlinFullTime).getTime() 
        const utcMs = new Date(utcTime).getTime() 
        const offsetHours = Math.round((berlinMs - utcMs) / (1000 * 60 * 60)) 
        const offsetSign = offsetHours >= 0 ? "+" : "" 
        const offsetString = `UTC${offsetSign}${offsetHours.toString().padStart(2, "0")}:00` 
        
        const currentTimeElement = document.getElementById("current-time") 
        const timezoneElement = document.getElementById("timezone-info") 
        
        if (currentTimeElement) {
            currentTimeElement.textContent = berlinTime 
        }
        
        if (timezoneElement) {
            timezoneElement.textContent = `Europe/Berlin (${offsetString})` 
        }
        
    } catch (error) {
        console.error("Failed to update time info:", error) 
        
        const fallbackTime = new Date().toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit",
            second: "2-digit",
            hour12: false 
        }) 
        
        const currentTimeElement = document.getElementById("current-time") 
        if (currentTimeElement) {
            currentTimeElement.textContent = fallbackTime 
        }
    }
}

updateTimeInfo() 
setInterval(updateTimeInfo, 1000) 

const termsModal = document.getElementById("termsModal") 
const aboutModal = document.getElementById("about-me-modal") 
const termsBtn = document.querySelector("#termsandconditions a.cta-button") 
const aboutBtn = document.getElementById("about-me-btn") 
const discordModal = document.getElementById("discordModal")
const discordBtn = document.querySelector(".contact-link i.fa-brands.fa-discord")?.parentElement
const copyBtn = document.getElementById("copyDiscord")

if (discordBtn) {
    discordBtn.addEventListener("click", (event) => {
        event.preventDefault()
        discordModal.style.display = "block"
    })
}

termsBtn.addEventListener("click", (event) => {
    event.preventDefault() 
    termsModal.style.display = "block" 
}) 

aboutBtn.addEventListener("click", (event) => {
    event.preventDefault()
    aboutModal.style.display = "block" 
})

document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = btn.closest(".modal") 
        modal.style.display = "none" 
    }) 
}) 

if (copyBtn) {
    copyBtn.addEventListener("click", (event) => {
        navigator.clipboard.writeText("euro_fighter.")
        copyBtn.textContent = "Copied!"
        setTimeout(() => (copyBtn.textContent = "Copy Username"), 2000)
    })
}

window.addEventListener("click", (e) => {
    if (e.target === termsModal) {
        termsModal.style.display = "none" 
    }
    if (e.target === aboutModal) {
        aboutModal.style.display = "none" 
    }
}) 
 