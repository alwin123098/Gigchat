const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const seedUsers = [
  {
    id: "client-1",
    type: "client",
    name: "Maya Chen",
    company: "Northstar Studio",
    avatar: "MC",
    avatarColor: "#ff8a5b",
    bio: "Creative producer hiring fast-moving specialists for brand launches.",
    pastJobsPosted: 12
  },
  {
    id: "client-2",
    type: "client",
    name: "Jordan Patel",
    company: "Aster Labs",
    avatar: "JP",
    avatarColor: "#5c8dff",
    bio: "Founder posting product and growth jobs for a lean software team.",
    pastJobsPosted: 7
  },
  {
    id: "freelancer-1",
    type: "freelancer",
    name: "Lena Ruiz",
    avatar: "LR",
    avatarColor: "#12b981",
    bio: "Senior motion designer focused on launch trailers, social edits, and fast revisions.",
    skills: ["Video Editing", "Motion Design", "Branding"],
    portfolio: ["behance.net/lenaruiz", "dribbble.com/lenaruiz"],
    rating: 4.9,
    completedJobs: 38
  },
  {
    id: "freelancer-2",
    type: "freelancer",
    name: "Arjun Sen",
    avatar: "AS",
    avatarColor: "#f59e0b",
    bio: "Full-stack product engineer building MVPs, dashboards, and AI workflow apps.",
    skills: ["Coding", "React", "Automation"],
    portfolio: ["github.com/arjunsen", "arjunsen.dev"],
    rating: 4.8,
    completedJobs: 54
  },
  {
    id: "freelancer-3",
    type: "freelancer",
    name: "Noa Brooks",
    avatar: "NB",
    avatarColor: "#a855f7",
    bio: "Copywriter and messaging strategist for SaaS, creators, and indie launches.",
    skills: ["Writing", "Launch Copy", "Content Strategy"],
    portfolio: ["noabrooks.co", "medium.com/@noabrooks"],
    rating: 4.7,
    completedJobs: 26
  }
];

export const seedJobs = [
  {
    id: "job-1",
    clientId: "client-1",
    title: "Need short-form launch video edits",
    description:
      "Looking for a freelancer to turn long webinar footage into 5 punchy social clips with captions and motion graphics.",
    budget: 420,
    skill: "Video Editing",
    deadline: "2026-05-24",
    tags: ["Video Editing", "Motion Design", "Social Clips"],
    createdAt: minutesAgo(12),
    replies: [
      {
        id: "reply-1",
        freelancerId: "freelancer-1",
        message: "I can do this. I specialize in launch edits and can deliver the first cut in 24 hours.",
        createdAt: minutesAgo(7)
      }
    ],
    selectedFreelancerId: null,
    escrowPaid: false,
    completed: false,
    paymentReleased: false
  },
  {
    id: "job-2",
    clientId: "client-2",
    title: "Build landing page with waitlist",
    description:
      "Need a clean responsive landing page with email capture, FAQ, and a small admin view for signups. React preferred.",
    budget: 950,
    skill: "Coding",
    deadline: "2026-05-28",
    tags: ["Coding", "React", "UI"],
    createdAt: hoursAgo(2),
    replies: [
      {
        id: "reply-2",
        freelancerId: "freelancer-2",
        message: "I can do this. I can ship the front end and a lightweight local admin mock for the MVP.",
        createdAt: hoursAgo(1)
      },
      {
        id: "reply-3",
        freelancerId: "freelancer-3",
        message: "I can cover the copy and messaging if you pair me with a builder.",
        createdAt: minutesAgo(52)
      }
    ],
    selectedFreelancerId: "freelancer-2",
    escrowPaid: true,
    completed: false,
    paymentReleased: false
  },
  {
    id: "job-3",
    clientId: "client-1",
    title: "Write product launch email sequence",
    description:
      "Need three concise launch emails with a strong CTA and segmented versions for warm and cold audiences.",
    budget: 300,
    skill: "Writing",
    deadline: "2026-05-22",
    tags: ["Writing", "Email", "Launch Copy"],
    createdAt: daysAgo(1),
    replies: [
      {
        id: "reply-4",
        freelancerId: "freelancer-3",
        message: "I can do this. I write conversion-focused launch sequences and can deliver variations.",
        createdAt: daysAgo(1)
      }
    ],
    selectedFreelancerId: "freelancer-3",
    escrowPaid: true,
    completed: true,
    paymentReleased: true
  }
];

export const seedChats = [
  {
    id: "chat-job-2",
    jobId: "job-2",
    participantIds: ["client-2", "freelancer-2"],
    messages: [
      {
        id: "msg-1",
        senderId: "client-2",
        type: "text",
        text: "I’ve selected you. Can you start with the hero section and signup flow?",
        createdAt: hoursAgo(1)
      },
      {
        id: "msg-2",
        senderId: "freelancer-2",
        type: "file",
        text: "Uploading a quick wireframe snapshot",
        fileName: "landing-wireframe.png",
        createdAt: minutesAgo(48)
      }
    ]
  },
  {
    id: "chat-job-3",
    jobId: "job-3",
    participantIds: ["client-1", "freelancer-3"],
    messages: [
      {
        id: "msg-3",
        senderId: "freelancer-3",
        type: "text",
        text: "Drafts are done. I added warm and cold audience variants.",
        createdAt: daysAgo(1)
      },
      {
        id: "msg-4",
        senderId: "client-1",
        type: "text",
        text: "Looks good. Marking complete after final review.",
        createdAt: hoursAgo(20)
      }
    ]
  }
];

export const seedNotifications = [
  {
    id: "notif-1",
    userId: "client-1",
    type: "reply",
    title: "New reply on your post",
    description: "Lena Ruiz replied to your video editing request.",
    createdAt: minutesAgo(7),
    read: false,
    link: "/home"
  },
  {
    id: "notif-2",
    userId: "freelancer-2",
    type: "selected",
    title: "You were selected for a job",
    description: "Jordan Patel selected you for the landing page build.",
    createdAt: hoursAgo(1),
    read: false,
    link: "/chat/job-2"
  },
  {
    id: "notif-3",
    userId: "freelancer-3",
    type: "payment",
    title: "Payment released",
    description: "Northstar Studio released payment for the email sequence project.",
    createdAt: hoursAgo(6),
    read: true,
    link: "/chat/job-3"
  }
];

export const seedReviews = [
  {
    id: "review-1",
    jobId: "job-3",
    fromUserId: "client-1",
    toUserId: "freelancer-3",
    rating: 5,
    comment: "Sharp copy, fast turnaround, and strong CTA instincts.",
    createdAt: hoursAgo(5)
  },
  {
    id: "review-2",
    jobId: "job-3",
    fromUserId: "freelancer-3",
    toUserId: "client-1",
    rating: 5,
    comment: "Clear brief, quick feedback, and smooth release flow.",
    createdAt: hoursAgo(4)
  }
];

export const skillOptions = [
  "All",
  "Video Editing",
  "Design",
  "Coding",
  "Writing",
  "Music",
  "Marketing"
];
