import type { ComponentType } from 'react';
import MaterialIcon from './material-icon';

export interface MaterialLucideIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export type LucideIcon = ComponentType<MaterialLucideIconProps>;

const ICON_NAMES = {
  AlertTriangle: 'warning',
  ArrowDownLeft: 'south_west',
  ArrowLeft: 'arrow_back',
  ArrowRight: 'arrow_forward',
  ArrowUpRight: 'north_east',
  Briefcase: 'business_center',
  Building2: 'apartment',
  Calendar: 'calendar_month',
  CalendarCheck: 'event_available',
  CalendarDays: 'calendar_month',
  Check: 'check',
  CheckCircle: 'check_circle',
  CheckCircle2: 'check_circle',
  CheckSquare: 'check_box',
  ChevronDown: 'keyboard_arrow_down',
  ChevronLeft: 'chevron_left',
  ChevronRight: 'chevron_right',
  ChevronUp: 'keyboard_arrow_up',
  Clock: 'schedule',
  Clock3: 'schedule',
  Command: 'dashboard_customize',
  CreditCard: 'credit_card',
  Eye: 'visibility',
  EyeOff: 'visibility_off',
  FileCheck2: 'fact_check',
  FileHeart: 'clinical_notes',
  FileText: 'description',
  Home: 'home',
  KeyRound: 'key',
  Layers: 'layers',
  LayoutTemplate: 'dashboard',
  ListTodo: 'checklist',
  Loader2: 'progress_activity',
  Lock: 'lock',
  LogOut: 'logout',
  Mail: 'mail',
  MailCheck: 'mark_email_read',
  MessageCircle: 'chat_bubble',
  MoreHorizontal: 'more_horiz',
  PanelLeftClose: 'left_panel_close',
  PenTool: 'edit_square',
  Pencil: 'edit',
  Phone: 'call',
  Plus: 'add',
  Presentation: 'co_present',
  Printer: 'print',
  Receipt: 'receipt_long',
  RefreshCw: 'sync',
  Search: 'search',
  Send: 'send',
  Settings: 'settings',
  ShieldAlert: 'gpp_maybe',
  ShieldCheck: 'verified_user',
  Timer: 'timer',
  Trash2: 'delete',
  TrendingDown: 'trending_down',
  TrendingUp: 'trending_up',
  User: 'person',
  UserCheck: 'person_check',
  UserCircle2: 'account_circle',
  UserMinus: 'person_remove',
  UserRound: 'person',
  UserRoundCheck: 'how_to_reg',
  UserRoundX: 'person_off',
  Users: 'groups',
  WalletCards: 'account_balance_wallet',
  X: 'close',
} as const;

function createMaterialIcon(name: string): LucideIcon {
  return function MaterialLucideIcon({ size = 20, className = '' }: MaterialLucideIconProps) {
    return <MaterialIcon name={name} size={size} className={className} />;
  };
}

export const AlertTriangle = createMaterialIcon(ICON_NAMES.AlertTriangle);
export const ArrowDownLeft = createMaterialIcon(ICON_NAMES.ArrowDownLeft);
export const ArrowLeft = createMaterialIcon(ICON_NAMES.ArrowLeft);
export const ArrowRight = createMaterialIcon(ICON_NAMES.ArrowRight);
export const ArrowUpRight = createMaterialIcon(ICON_NAMES.ArrowUpRight);
export const Briefcase = createMaterialIcon(ICON_NAMES.Briefcase);
export const Building2 = createMaterialIcon(ICON_NAMES.Building2);
export const Calendar = createMaterialIcon(ICON_NAMES.Calendar);
export const CalendarCheck = createMaterialIcon(ICON_NAMES.CalendarCheck);
export const CalendarDays = createMaterialIcon(ICON_NAMES.CalendarDays);
export const Check = createMaterialIcon(ICON_NAMES.Check);
export const CheckCircle = createMaterialIcon(ICON_NAMES.CheckCircle);
export const CheckCircle2 = createMaterialIcon(ICON_NAMES.CheckCircle2);
export const CheckSquare = createMaterialIcon(ICON_NAMES.CheckSquare);
export const ChevronDown = createMaterialIcon(ICON_NAMES.ChevronDown);
export const ChevronLeft = createMaterialIcon(ICON_NAMES.ChevronLeft);
export const ChevronRight = createMaterialIcon(ICON_NAMES.ChevronRight);
export const ChevronUp = createMaterialIcon(ICON_NAMES.ChevronUp);
export const Clock = createMaterialIcon(ICON_NAMES.Clock);
export const Clock3 = createMaterialIcon(ICON_NAMES.Clock3);
export const Command = createMaterialIcon(ICON_NAMES.Command);
export const CreditCard = createMaterialIcon(ICON_NAMES.CreditCard);
export const Eye = createMaterialIcon(ICON_NAMES.Eye);
export const EyeOff = createMaterialIcon(ICON_NAMES.EyeOff);
export const FileCheck2 = createMaterialIcon(ICON_NAMES.FileCheck2);
export const FileHeart = createMaterialIcon(ICON_NAMES.FileHeart);
export const FileText = createMaterialIcon(ICON_NAMES.FileText);
export const Home = createMaterialIcon(ICON_NAMES.Home);
export const KeyRound = createMaterialIcon(ICON_NAMES.KeyRound);
export const Layers = createMaterialIcon(ICON_NAMES.Layers);
export const LayoutTemplate = createMaterialIcon(ICON_NAMES.LayoutTemplate);
export const ListTodo = createMaterialIcon(ICON_NAMES.ListTodo);
export const Loader2 = createMaterialIcon(ICON_NAMES.Loader2);
export const Lock = createMaterialIcon(ICON_NAMES.Lock);
export const LogOut = createMaterialIcon(ICON_NAMES.LogOut);
export const Mail = createMaterialIcon(ICON_NAMES.Mail);
export const MailCheck = createMaterialIcon(ICON_NAMES.MailCheck);
export const MessageCircle = createMaterialIcon(ICON_NAMES.MessageCircle);
export const MoreHorizontal = createMaterialIcon(ICON_NAMES.MoreHorizontal);
export const PanelLeftClose = createMaterialIcon(ICON_NAMES.PanelLeftClose);
export const PenTool = createMaterialIcon(ICON_NAMES.PenTool);
export const Pencil = createMaterialIcon(ICON_NAMES.Pencil);
export const Phone = createMaterialIcon(ICON_NAMES.Phone);
export const Plus = createMaterialIcon(ICON_NAMES.Plus);
export const Presentation = createMaterialIcon(ICON_NAMES.Presentation);
export const Printer = createMaterialIcon(ICON_NAMES.Printer);
export const Receipt = createMaterialIcon(ICON_NAMES.Receipt);
export const RefreshCw = createMaterialIcon(ICON_NAMES.RefreshCw);
export const Search = createMaterialIcon(ICON_NAMES.Search);
export const Send = createMaterialIcon(ICON_NAMES.Send);
export const Settings = createMaterialIcon(ICON_NAMES.Settings);
export const ShieldAlert = createMaterialIcon(ICON_NAMES.ShieldAlert);
export const ShieldCheck = createMaterialIcon(ICON_NAMES.ShieldCheck);
export const Timer = createMaterialIcon(ICON_NAMES.Timer);
export const Trash2 = createMaterialIcon(ICON_NAMES.Trash2);
export const TrendingDown = createMaterialIcon(ICON_NAMES.TrendingDown);
export const TrendingUp = createMaterialIcon(ICON_NAMES.TrendingUp);
export const User = createMaterialIcon(ICON_NAMES.User);
export const UserCheck = createMaterialIcon(ICON_NAMES.UserCheck);
export const UserCircle2 = createMaterialIcon(ICON_NAMES.UserCircle2);
export const UserMinus = createMaterialIcon(ICON_NAMES.UserMinus);
export const UserRound = createMaterialIcon(ICON_NAMES.UserRound);
export const UserRoundCheck = createMaterialIcon(ICON_NAMES.UserRoundCheck);
export const UserRoundX = createMaterialIcon(ICON_NAMES.UserRoundX);
export const Users = createMaterialIcon(ICON_NAMES.Users);
export const WalletCards = createMaterialIcon(ICON_NAMES.WalletCards);
export const X = createMaterialIcon(ICON_NAMES.X);
