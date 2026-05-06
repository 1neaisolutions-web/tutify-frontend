/**
 * Centralized Notification Configuration
 * 
 * This file defines how each notification type should be handled.
 * To add a new notification type, simply add a new entry to NOTIFICATION_CONFIG.
 * 
 * ============================================================
 * CONFIGURATION OPTIONS:
 * ============================================================
 * 
 * NAVIGATION OPTIONS:
 * - route: The path to navigate to (null if no navigation needed)
 * - search: Query string to append (e.g., '?tab=1')
 * 
 * HIGHLIGHT OPTIONS:
 * - getHighlightId: Function to extract the item ID from notification (default: getIdFromNotification)
 * - highlightKey: The key name for the highlight ID in location state (default: 'highlightId')
 * 
 * VALIDATION OPTIONS:
 * - refreshAction: Redux action to refresh data before navigation
 * - validateFn: Function to validate if the item still exists
 *               IMPORTANT: If you have refreshAction AND extract a targetId, you MUST provide validateFn
 *               Otherwise repeated clicks will show "item not available" error
 * - skipValidation: Set to true to always navigate without validation (for notifications that open modals)
 * 
 * ERROR MESSAGES:
 * - notFoundMessage: Message when specific item not found
 * - hasOthersMessage: Message when item not found but others exist
 * 
 * ACTION-ONLY (NO NAVIGATION):
 * - onlyAction: If true, only perform action without navigation
 * - action: Custom action to perform (for notifications that don't navigate)
 * 
 * ============================================================
 * HOW TO ADD A NEW NOTIFICATION TYPE:
 * ============================================================
 * 
 * 1. Add entry to NOTIFICATION_CONFIG with the notification_type as key
 * 2. Add entry to SOCKET_NOTIFICATION_HANDLERS for real-time updates
 * 3. If using highlight, add useNotificationHighlight hook to destination component
 * 
 * Example for a simple navigate + highlight notification:
 * 
 *   my_notification_type: {
 *     route: '/my-page',
 *     search: '?tab=0',
 *     getHighlightId: getIdFromNotification,
 *     highlightKey: 'highlightId',
 *     refreshAction: myRefreshAction,
 *     validateFn: (result, targetId) => {
 *       const items = result?.payload || [];
 *       return items.find(item => String(item.id) === String(targetId));
 *     },
 *     notFoundMessage: 'This item is no longer available.',
 *   },
 * 
 * Example for a notification that opens a modal (skip validation):
 * 
 *   my_modal_notification: {
 *     route: '/my-page',
 *     refreshAction: myRefreshAction,
 *     skipValidation: true, // Always navigate, let the component handle validation
 *   },
 */

import { getCoachInvites, getOutgoingShares } from '../redux/features/sceneStudyScripts/readersSlice';

// ============================================================
// CENTRALIZED CONSTANTS
// ============================================================
// Use these constants across all notification-related components
// to ensure consistent behavior and easy maintenance.

export const NOTIFICATION_CONSTANTS = {
  // Highlight timing
  HIGHLIGHT_DURATION: 3000,      // How long the highlight animation lasts (ms)
  SCROLL_DELAY: 300,             // Delay before scrolling to element (ms)
  STATE_CLEANUP_DELAY: 1000,     // Delay before cleaning navigation state (ms) - must be > SCROLL_DELAY + 350ms
  
  // Default CSS classes for highlighting
  HIGHLIGHT_CLASS: 'border-primary shadow-lg ring-2 ring-primary/30 animate-notification-pulse',
  
  // Default keys
  DEFAULT_HIGHLIGHT_KEY: 'highlightId',
  DEFAULT_ID_FIELD: 'id',
};

// Helper to extract ID from notification - checks common fields
export const getIdFromNotification = (notification) => {
  return (
    notification.redirect_info?.object_id ||
    notification.share_id ||
    notification.script_share_id ||
    notification.object_id ||
    notification.related_id ||
    notification.data?.share_id ||
    notification.data?.id ||
    null
  );
};

// Notification type configurations
export const NOTIFICATION_CONFIG = {
  // ============================================================
  // COACH SIDE NOTIFICATIONS
  // ============================================================
  
  // Coach receives invitation from Actor - highlights invite card
  script_share_invite: {
    route: '/collaboration',
    search: '?tab=1',
    getHighlightId: getIdFromNotification,
    highlightKey: 'highlightId',
    refreshAction: getCoachInvites,
    validateFn: (result, targetId) => {
      const pending = result?.payload?.pending || [];
      return pending.find((inv) => String(inv.id) === String(targetId));
    },
    notFoundMessage: 'This invitation is no longer available or has been processed.',
    hasOthersMessage: 'This invitation may have been processed. Showing your current invitations.',
  },

  // ============================================================
  // ACTOR SIDE NOTIFICATIONS
  // ============================================================
  
  // Actor's invitation was accepted by Coach - opens modal with highlighted script
  script_share_accepted: {
    route: '/scene-study/live-rehearsal',
    search: '', // Tab 0 (Find a Reader) is default
    getHighlightId: getIdFromNotification,
    highlightKey: 'highlightShareId', // Used by InviteCoachModal
    refreshAction: getOutgoingShares,
    // skipValidation: The modal handles finding the reader by sender_name
    // We still validate to check if the share exists
    validateFn: (result, targetId) => {
      const shares = result?.payload?.shares || [];
      return shares.find((s) => String(s.id) === String(targetId));
    },
    notFoundMessage: 'This session is no longer available.',
    hasOthersMessage: 'This session may have been processed. Showing your sessions.',
  },

  // Actor's invitation was rejected by Coach - just show toast, no navigation
  script_share_rejected: {
    route: null, // No navigation - just action
    onlyAction: true,
    action: async (dispatch, notification, toast) => {
      dispatch(getOutgoingShares());
      toast.info('Your session request was declined.');
    },
  },

  // ============================================================
  // ADD NEW NOTIFICATION TYPES BELOW
  // ============================================================
  
  // Template for highlight-based notification:
  // my_highlight_notification: {
  //   route: '/my-page',
  //   search: '?tab=0',
  //   getHighlightId: getIdFromNotification,
  //   highlightKey: 'highlightId',
  //   refreshAction: myRefreshAction,
  //   validateFn: (result, targetId) => {
  //     const items = result?.payload || [];
  //     return items.find(item => String(item.id) === String(targetId));
  //   },
  //   notFoundMessage: 'This item is no longer available.',
  // },
  
  // Template for modal-based notification:
  // my_modal_notification: {
  //   route: '/my-page',
  //   refreshAction: myRefreshAction,
  //   skipValidation: true,
  // },
};

// Socket notification handlers - what to do when notification arrives via WebSocket
export const SOCKET_NOTIFICATION_HANDLERS = {
  script_share_invite: {
    refreshAction: getCoachInvites,
    toastMessage: 'New script share invitation received.',
  },
  script_share_rejected: {
    refreshAction: getOutgoingShares,
    toastMessage: 'Your session request was declined.',
  },
  script_share_accepted: {
    refreshAction: getOutgoingShares,
    toastMessage: 'Your invitation was accepted!',
  },
  // Add more socket handlers here...
};

export default NOTIFICATION_CONFIG;
