import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  seedChats,
  seedJobs,
  seedNotifications,
  seedReviews,
  seedUsers,
  skillOptions
} from "../data/seed";

const AppContext = createContext(null);
const STORAGE_KEY = "gigchat-mvp-state";

const initialState = {
  currentUserId: "freelancer-2",
  users: seedUsers,
  jobs: seedJobs,
  chats: seedChats,
  notifications: seedNotifications,
  reviews: seedReviews,
  activeSkill: "All"
};

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentUser = state.users.find((user) => user.id === state.currentUserId);

  const addNotification = (userId, type, title, description, link) => {
    const notification = {
      id: uid("notif"),
      userId,
      type,
      title,
      description,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };

    setState((prev) => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));
  };

  const switchUser = (userId) => {
    setState((prev) => ({ ...prev, currentUserId: userId }));
  };

  const setActiveSkill = (skill) => {
    setState((prev) => ({ ...prev, activeSkill: skill }));
  };

  const postJob = ({ title, description, skill, budget, deadline }) => {
    const job = {
      id: uid("job"),
      clientId: state.currentUserId,
      title,
      description,
      skill,
      budget: Number(budget),
      deadline,
      tags: [skill, "Remote", "Fast Turnaround"],
      createdAt: new Date().toISOString(),
      replies: [],
      selectedFreelancerId: null,
      escrowPaid: false,
      completed: false,
      paymentReleased: false
    };

    setState((prev) => ({
      ...prev,
      jobs: [job, ...prev.jobs]
    }));
  };

  const addReply = (jobId, message) => {
    const reply = {
      id: uid("reply"),
      freelancerId: state.currentUserId,
      message,
      createdAt: new Date().toISOString()
    };

    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) =>
        job.id === jobId ? { ...job, replies: [...job.replies, reply] } : job
      )
    }));

    const job = state.jobs.find((item) => item.id === jobId);
    if (job) {
      addNotification(
        job.clientId,
        "reply",
        "New reply on your post",
        `${currentUser.name} replied to "${job.title}".`,
        "/home"
      );
    }
  };

  const selectFreelancer = (jobId, freelancerId) => {
    setState((prev) => {
      const existingChat = prev.chats.find((chat) => chat.jobId === jobId);
      const nextChats = existingChat
        ? prev.chats
        : [
            {
              id: `chat-${jobId}`,
              jobId,
              participantIds: [prev.currentUserId, freelancerId],
              messages: [
                {
                  id: uid("msg"),
                  senderId: prev.currentUserId,
                  type: "text",
                  text: "You’ve been selected. Let’s move this into private chat.",
                  createdAt: new Date().toISOString()
                }
              ]
            },
            ...prev.chats
          ];

      return {
        ...prev,
        jobs: prev.jobs.map((job) =>
          job.id === jobId ? { ...job, selectedFreelancerId: freelancerId } : job
        ),
        chats: nextChats
      };
    });

    const job = state.jobs.find((item) => item.id === jobId);
    if (job) {
      addNotification(
        freelancerId,
        "selected",
        "You were selected for a job",
        `${currentUser.name} selected you for "${job.title}".`,
        `/chat/${jobId}`
      );
    }
  };

  const payToEscrow = (jobId) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) => (job.id === jobId ? { ...job, escrowPaid: true } : job))
    }));

    const job = state.jobs.find((item) => item.id === jobId);
    if (job?.selectedFreelancerId) {
      addNotification(
        job.selectedFreelancerId,
        "payment",
        "Escrow funded",
        `Escrow is funded for "${job.title}". You can begin delivery.`,
        `/chat/${jobId}`
      );
    }
  };

  const sendMessage = (jobId, payload) => {
    const message = {
      id: uid("msg"),
      senderId: state.currentUserId,
      createdAt: new Date().toISOString(),
      ...payload
    };

    setState((prev) => ({
      ...prev,
      chats: prev.chats.map((chat) =>
        chat.jobId === jobId ? { ...chat, messages: [...chat.messages, message] } : chat
      )
    }));

    const chat = state.chats.find((item) => item.jobId === jobId);
    const recipientId = chat?.participantIds.find((id) => id !== state.currentUserId);
    if (recipientId) {
      addNotification(
        recipientId,
        "message",
        "New message received",
        `${currentUser.name} sent you a message.`,
        `/chat/${jobId}`
      );
    }
  };

  const markAsComplete = (jobId) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) => (job.id === jobId ? { ...job, completed: true } : job))
    }));

    const job = state.jobs.find((item) => item.id === jobId);
    if (!job) return;
    const recipientId =
      state.currentUserId === job.clientId ? job.selectedFreelancerId : job.clientId;

    if (recipientId) {
      addNotification(
        recipientId,
        "status",
        "Job marked complete",
        `${currentUser.name} marked "${job.title}" as complete.`,
        `/chat/${jobId}`
      );
    }
  };

  const releasePayment = (jobId) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) =>
        job.id === jobId ? { ...job, paymentReleased: true } : job
      )
    }));

    const job = state.jobs.find((item) => item.id === jobId);
    if (job?.selectedFreelancerId) {
      addNotification(
        job.selectedFreelancerId,
        "payment",
        "Payment released",
        `Payment for "${job.title}" has been released.`,
        `/chat/${jobId}`
      );
    }
  };

  const submitReview = (jobId, toUserId, rating, comment) => {
    const review = {
      id: uid("review"),
      jobId,
      fromUserId: state.currentUserId,
      toUserId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setState((prev) => ({
      ...prev,
      reviews: [review, ...prev.reviews]
    }));
  };

  const markNotificationRead = (notificationId) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item
      )
    }));
  };

  const unreadNotifications = state.notifications.filter(
    (item) => item.userId === state.currentUserId && !item.read
  );

  const value = useMemo(
    () => ({
      ...state,
      currentUser,
      skillOptions,
      unreadNotifications,
      switchUser,
      setActiveSkill,
      postJob,
      addReply,
      selectFreelancer,
      payToEscrow,
      sendMessage,
      markAsComplete,
      releasePayment,
      submitReview,
      markNotificationRead
    }),
    [state, currentUser, unreadNotifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
