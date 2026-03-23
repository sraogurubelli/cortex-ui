/**
 * Canary UI Component Integration
 *
 * Re-export commonly used Canary UI components with convenient utilities.
 * This provides a single import point for Canary components used across the platform.
 */

// Toast notifications
export { toast, Toaster, showToast } from './toast';

// Re-export commonly used Canary UI components directly
export {
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  Checkbox,
  Radio,
  Label,
  Dialog,
  Card,
  Text,
  Avatar,
  Tabs,
  Separator,
  Alert,
  AlertDialog,
  Popover,
  Tooltip,
  TooltipProvider,
  DropdownMenu,
  Progress,
  Accordion,
} from '@harnessio/ui/components';
