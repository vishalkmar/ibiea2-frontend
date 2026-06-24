import {
  Building2, HardHat, Handshake, Sofa, Lamp, Package, Cpu,
  Compass, Construction, Landmark, Rocket, Square,
  LayoutDashboard, Users, Sparkles, Ticket, FileText, ListChecks,
  CreditCard, Eye, Flame, ScanLine, Download, Calendar,
  ShieldCheck, Award, Megaphone, Globe, BarChart3, Settings,
  UserCog, DollarSign, Mail, MessageCircle, Trophy, Gavel,
  Lightbulb, Network, TrendingUp, Target,
  Grid3x3, Check, MapPin,
} from 'lucide-react';

// Explicit map so the bundler can tree-shake (avoids importing all of lucide).
const MAP = {
  Building2, HardHat, Handshake, Sofa, Lamp, Package, Cpu,
  Compass, Construction, Landmark, Rocket,
  LayoutDashboard, Users, Sparkles, Ticket, FileText, ListChecks,
  CreditCard, Eye, Flame, ScanLine, Download, Calendar,
  ShieldCheck, Award, Megaphone, Globe, BarChart3, Settings,
  UserCog, DollarSign, Mail, MessageCircle, Trophy, Gavel,
  Lightbulb, Network, TrendingUp, Target,
  Grid3x3, Check, MapPin,
};

export default function DynamicIcon({ name, ...props }) {
  const Icon = MAP[name] || Square;
  return <Icon {...props} />;
}
