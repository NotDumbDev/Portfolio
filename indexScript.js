function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#" || href.length <= 1) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

const cursor = document.querySelector(".cursor");
let mouseX = 0,
  mouseY = 0;
let cursorX = 0,
  cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let w, h, stars;
const numStars = 250;
const connectDist = 150;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = Array.from({ length: numStars }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: 1 + Math.random() * 5,
    opacity: 0.3 + Math.random() * 0.7,
  }));
}
window.addEventListener("resize", resize);

function draw() {
  ctx.clearRect(0, 0, w, h);

  stars.forEach((s) => {
    s.x += s.vx;
    s.y += s.vy;
    if (s.x < 0 || s.x > w) s.vx *= -1;
    if (s.y < 0 || s.y > h) s.vy *= -1;

    ctx.fillStyle = `rgba(255, 72, 105, 0.6)`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(255,72,141)";
  ctx.lineWidth = 1;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectDist) {
        ctx.globalAlpha = (1 - dist / connectDist) * 0.5;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }

    const dx = stars[i].x - mouseX;
    const dy = stars[i].y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < connectDist) {
      ctx.globalAlpha = (1 - dist / connectDist) * 0.8;
      ctx.strokeStyle = "rgba(255,72,141)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(stars[i].x, stars[i].y);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}
resize();
draw();

const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -150px 0px" }
);
sections.forEach((section) => observer.observe(section));

const robloxId = "4067261404";
async function fetchInfoProfile() {
  const c = document.getElementById("robloxProfile");
  try {
    const [userRes, thumbRes] = await Promise.all([
      fetch(`https://users.roproxy.com/v1/users/${robloxId}`),
      fetch(
        `https://thumbnails.roproxy.com/v1/users/avatar-bust?userIds=${robloxId}&size=150x150&format=Png&isCircular=false`
      ),
    ]);
    const userData = await userRes.json();
    const thumbData = await thumbRes.json();
    const avatarUrl = thumbData.data[0]?.imageUrl || "";
    let statusClass = "offline",
      statusText = "Offline",
      activityInfo = null;
    try {
      const presenceRes = await fetch(
        `https://corsproxy.io/?https://presence.roproxy.com/v1/presence/users/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: [robloxId] }),
        }
      );
      if (presenceRes.ok) {
        const presenceData = await presenceRes.json();
        const presence = presenceData.userPresences?.[0];
        if (presence) {
          switch (presence.userPresenceType) {
            case 0:
              statusClass = "offline";
              statusText = "Offline";
              break;
            case 1:
              statusClass = "online";
              statusText = "Online";
              break;
            case 2:
              statusClass = "in-game";
              statusText = "In Game";
              activityInfo = {
                game: presence.lastLocation || "Playing Roblox",
              };
              break;
            case 3:
              statusClass = "in-studio";
              statusText = "In Studio";
              break;
          }
        }
      }
    } catch {}
    let statusIcon = "";
    switch (statusClass) {
      case "online":
        statusIcon = '<i class="fa-solid fa-circle"></i>';
        break;
      case "in-game":
        statusIcon = '<i class="fa-solid fa-gamepad"></i>';
        break;
      case "in-studio":
        statusIcon = '<i class="fa-solid fa-hammer"></i>';
        break;
      default:
        statusIcon = '<i class="fa-solid fa-circle"></i>';
        break;
    }
    let html = `
          <div class="avatar-container">
            <img src="${avatarUrl}" alt="${
      userData.displayName
    }" class="avatar-image">
            <div class="status-indicator ${statusClass}">${statusIcon}</div>
          </div>
          <div class="profile-info">
            <h3>${userData.displayName}</h3>
            <div class="status-badge ${statusClass}">
              ${statusIcon} ${statusText}
            </div>
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-label">Username</div>
                <div class="stat-value">@${userData.name}</div>
              </div>
              ${
                activityInfo
                  ? `
              <div class="stat-item">
                <div class="stat-label">Currently</div>
                <div class="stat-value">${activityInfo.game}</div>
              </div>
              `
                  : ""
              }
              <div class="stat-item">
                <div class="stat-label">User ID</div>
                <div class="stat-value">#${userData.id}</div>
              </div>
            </div>
          </div>
        `;
    c.innerHTML = html;
  } catch (e) {
    c.innerHTML =
      '<div style="color:#ff6b6b;text-align:center;padding:1rem;font-size:0.9rem;">Unable to load profile</div>';
  }
}
fetchInfoProfile();
setInterval(fetchInfoProfile, 30000);

const projects = [
  {
    title: "Discord to Roblox System",
    desc: "I created a discord bot to roblox system, which allowed you to ban, kick or send global announcements directly via discord.",
    img: "img/DCRBX.png",
    tags: ["Cross-Platform", "Multi-Language", "Luau", "Solo-Project"],
  },
  {
    title: "Loaded all airports in the world",
    desc: "I made a system using OSM & Luau which loaded every airport in the world in my game, somehow pulled it off in less than 2 months",
    img: "img/airports.png",
    tags: ["Framework", "Luau", "Solo-Project"],
  },
  {
    title: "FPS System",
    desc: "A system designed for Realistic FPS systems or shooters in general.",
    img: "img/firstperson.png",
    tags: ["Framework", "Luau", "Solo-Project", "FPS"],
  },
  {
    title: "MotionX",
    desc: "A library i made which is used to manage Animations easily.",
    img: "img/mx.png",
    tags: ["Library", "Luau", "Solo-Project"],
  },
  {
    title: "Pulse",
    desc: "A library i created to make cross server events and messaging easier.",
    img: "img/pulse.png",
    tags: ["Library", "Luau", "Solo-Project"],
  },
  {
    title: "'Steal a __' type game",
    desc: "I've worked on 2 'steal a' game projects, but their owners told me not to say anything on this,.",
    img: "",
    tags: ["Commission", "Luau"],
  },
  {
    title: "Dash & Combat System",
    desc: "I've made a Dash & Combat system, but unfortunately the guy scammed me.",
    img: "",
    tags: ["Commission", "Luau"],
  },
  {
    title: "very funny chat system",
    desc: "a very funny chat system i made using react and rbxts...",
    video: "videos/chatsystem.mp4",
    tags: ["React", "rbxts", "TypeScript", "Solo-Project", "Video"],
  },
];  



function loadProjects() {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = "";

  projects.forEach((p) => {
    const div = document.createElement("div");
    div.className = "card";

    const mediaHTML = p.video
      ? `<video src="${p.video}" class="project-media" muted playsinline></video>`
      : `<img src="${p.img}" class="project-media">`;

    const tagsHTML = p.tags
      .map((t) => `<div class="project-tag" data-type="${t}">${t}</div>`)
      .join(" ");

    div.innerHTML = `
      ${mediaHTML}
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="project-tags">${tagsHTML}</div>
    `;

    div.addEventListener("click", () => openProjectModal(p));

    grid.appendChild(div);
  });
}

function openProjectModal(project) {
  const modal = document.getElementById("projectModal");
  const modalBody = document.getElementById("projectModalBody");

  const mediaHTML = project.video
    ? `<video src="${project.video}" controls class="modal-video"></video>`
    : `<img src="${project.img}" class="modal-image">`;

  const tagsHTML = project.tags
    .map((t) => `<div class="project-tag" data-type="${t}">${t}</div>`)
    .join(" ");

  modalBody.innerHTML = `
    <h2>${project.title}</h2>
    ${mediaHTML}
    <p>${project.desc}</p>
    <div class="project-tags">${tagsHTML}</div>
  `;

  openModal("projectModal");
}

document.querySelectorAll(".modal-close").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    const video = modal.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
});

loadProjects();


const groups = [{ id: 16534848 }, { id: 14049662 }, { id: 35940216 }];

async function loadGroups() {
  const grid = document.getElementById("groupGrid");

  if (groups.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1/-1; text-align: center; color: var(--muted);">No groups to display</div>';
    return;
  }

  grid.innerHTML = "";

  for (const groupData of groups) {
    let thumbUrl =
      "https://via.placeholder.com/400x200/111/ffffff?text=No+Image";
    let memberCount = 0;
    let groupName = "Unknown (failed to load!)";
    let groupDesc = "Group has no description!";

    try {
      const groupRes = await fetch(
        `https://groups.roproxy.com/v1/groups/${groupData.id}`
      );
      const groupInfo = await groupRes.json();
      memberCount = groupInfo.memberCount || 0;

      if (groupInfo.name) groupName = groupInfo.name;
      if (groupInfo.description) groupDesc = groupInfo.description;

      const thumbRes = await fetch(
        `https://thumbnails.roproxy.com/v1/groups/icons?groupIds=${groupData.id}&size=420x420&format=Png&isCircular=false`
      );
      const thumbData = await thumbRes.json();
      thumbUrl = thumbData.data?.[0]?.imageUrl || thumbUrl;
    } catch {}

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
          <img src="${thumbUrl}" alt="${groupName}">
          <h3>${groupName}</h3>
          <p>${groupDesc}</p>
          <div class="group-info">
            <div class="group-members">
              <i class="fa-solid fa-users"></i>
              <span>${memberCount.toLocaleString()} members</span>
            </div>
          </div>
        `;
    grid.appendChild(div);
  }
}
loadGroups();

const reviews = [
  {
    name: "Anony",
    avatar: "https://cdn.discordapp.com/avatars/1291465344338366515/a_76fc6363e0f29cc512af9a414bb8e29f.webp?size=80",
    rating: 4,
    badges: ["trusted", "friend"],
    text: "Very fantastic scripter, always helped and came up for tasks and also a great friend"
  },
  {
    name: "DragonChan",
    avatar: "https://cdn.discordapp.com/avatars/595639975748436219/5735b565b6ac99af884101b9dbf1431e.webp?size=80",
    rating: 3,
    badges: ["trusted"],
    text: "The scripts were very neat and clean but that doesn't come cheap, he was quick to finish all of his tasks and fixed up some bugs for me. But was overall pretty expensive, even though it was within my budget. Customer service could also be improved as he did some weird tactics like trying to rush me to pay before allowing me to test out his scripts. Overall, I would use him again for my scripts."
  },
  {
    name: "Calamari",
    avatar: "https://cdn.discordapp.com/avatars/1069568476185903134/a3a3b1c35807ff26e4d35a10064867d6.webp?size=80",
    rating: 4,
    badges: ["trusted"],
    text: "Great work, conversation a bit confusing but the product was good and scripts were clean!"
  },
  {
    name: "Cpvp_imagod/itsrealk",
    avatar: "https://cdn.discordapp.com/avatars/1191086224136482857/d6e4cbf30ebf301f4cb58cb7195bf08c.webp?size=80",
    rating: 5,
    badges: ["trusted"],
    text: "recommend, he helped me with lobby check points"
  },
  {
    name: "Blossom",
    avatar: "https://cdn.discordapp.com/avatars/846143658046390292/a4ad97fbbbe9d1b69047a45252d0d772.webp?size=80",
    rating: 5,
    badges: ["trusted", "vip"],
    text: "high quality and quick"
  }
];

let showingAllReviews = false;

function loadReviews() {
  const grid = document.getElementById("reviewGrid");
  grid.innerHTML = "";

  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const recommendationPercent = Math.round((positiveReviews / totalReviews) * 100);
  
  const reviewsHeading = document.querySelector("#reviews h2");
  if (reviewsHeading) {
    reviewsHeading.innerHTML = `Reviews <span style="color: var(--accent); font-size: 0.85em;">(${recommendationPercent}% recommend!)</span>`;
  }

  const reviewsToShow = showingAllReviews ? reviews : reviews.slice(0, 3);

  reviewsToShow.forEach((review) => {
    const div = document.createElement("div");
    div.className = "card";

    const starsHTML = Array.from({ length: 5 }, (_, i) => {
      const icon = i < review.rating ? "fa-solid fa-star" : "fa-regular fa-star";
      return `<i class="${icon}"></i>`;
    }).join("");

    const badgesHTML = review.badges
      .map((badge) => {
        let badgeClass = badge;
        let badgeText = badge.charAt(0).toUpperCase() + badge.slice(1);
        let badgeIcon = "fa-circle-check";
        
        if (badge === "trusted") {
          badgeText = "Trusted Client";
        } else if (badge === "friend") {
          badgeText = "Friend";
          badgeIcon = "fa-heart";
        } else if (badge === "vip") {
          badgeText = "VIP Client";
          badgeIcon = "fa-crown";
        }
        
        return `<div class="review-badge ${badgeClass}">
          <i class="fa-solid ${badgeIcon}"></i> ${badgeText}
        </div>`;
      })
      .join("");

    div.innerHTML = `
      <div class="review-header">
        <div class="review-avatar">
          <img src="${review.avatar}">
        </div>
        <div class="review-info">
          <div class="review-name">${review.name}</div>
          <div class="review-stars">${starsHTML}</div>
          ${badgesHTML ? `<div class="review-badges">${badgesHTML}</div>` : ""}
        </div>
      </div>
      <p class="review-text">${review.text}</p>
    `;

    grid.appendChild(div);
  });

  const showMoreBtn = document.getElementById("showMoreReviews");
  if (showMoreBtn) {
    if (showingAllReviews || reviews.length <= 3) {
      showMoreBtn.style.display = "none";
    } else {
      showMoreBtn.style.display = "inline-block";
    }
  }
}

loadReviews();

document.getElementById("showMoreReviews")?.addEventListener("click", function() {
  showingAllReviews = true;
  loadReviews();
});

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    const video = e.target.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    closeModal(e.target.id);
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.active").forEach((modal) => {
      const video = modal.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      closeModal(modal.id);
    });
  }
});

function checkHashModal() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const modalName = `${hash}Modal`

  const modal = document.getElementById(modalName);
  if (modal && modal.classList.contains("modal")) {
    openModal(modalName);
  }
}

window.addEventListener("DOMContentLoaded", checkHashModal);


async function updateTimeInfo() {
  try {
    const berlinTime = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const berlinFullTime = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Berlin",
    });
    const utcTime = new Date().toLocaleString("sv-SE", { timeZone: "UTC" });

    const berlinMs = new Date(berlinFullTime).getTime();
    const utcMs = new Date(utcTime).getTime();

    const offsetHours = Math.round((berlinMs - utcMs) / (1000 * 60 * 60));
    const offsetSign = offsetHours >= 0 ? "+" : "";
    const offsetString = `UTC${offsetSign}${offsetHours
      .toString()
      .padStart(2, "0")}:00`;

    const currentTimeElement = document.getElementById("current-time");
    const timezoneElement = document.getElementById("timezone-info");

    if (currentTimeElement) {
      currentTimeElement.textContent = berlinTime;
    }

    if (timezoneElement) {
      timezoneElement.textContent = `Europe/Berlin (${offsetString})`;
    }
  } catch (error) {
    console.error("Failed to update time info:", error);

    const fallbackTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const currentTimeElement = document.getElementById("current-time");
    if (currentTimeElement) {
      currentTimeElement.textContent = fallbackTime;
    }
  }
}

updateTimeInfo();
setInterval(updateTimeInfo, 1000);
