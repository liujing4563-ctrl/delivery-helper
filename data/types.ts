// ===== 核心数据类型 =====

export interface Regulation {
  id: string;
  title: string;
  issuer: string;
  publishDate: string;
  category: '劳动报酬' | '劳动关系' | '社会保险' | '工伤职业伤害' | '法律援助' | '平台规则';
  summary: string;
  officialUrl: string;
  /** 第三方转载链接，供无法访问官方来源的用户使用 */
  backupUrl?: string;
  tags: string[];
  lastVerified: string;
}

export interface MinWage {
  city: string;
  monthly?: number;
  hourly: number;
  effectiveDate: string;
  scopeNote?: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
}

export type LegalAidSourceType =
  | 'official'
  | 'official-platform'
  | 'government-repost'
  | 'needs-review';

export type LegalAidVerifyStatus =
  | 'verified'
  | 'needs_review'
  | 'broken'
  | 'blocked';

export interface LegalAidCenter {
  id: string;
  name: string;
  type: '法律援助中心' | '公共法律服务中心' | '法律援助工作站' | '法律援助联络点';
  city: string;
  district?: string;
  address?: string;
  phone?: string;
  hours?: string;
  mapUrl?: string;
  qrImageUrl?: string;
  sourceName: string;
  sourceUrl: string;
  sourceType?: LegalAidSourceType;
  lastVerified: string;
  verifiedAt?: string;
  verifyStatus?: LegalAidVerifyStatus;
  note?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  /** 第三方转载链接，供无法访问官方来源的用户使用 */
  backupUrl?: string;
  date: string;
  summary: string;
  tags: string[];
  lastVerified: string;
}

export interface CalculatorInput {
  city: string;
  period: 'day' | 'week' | 'month';
  totalEarnings: number;
  subsidies: number;
  rewards: number;
  deductions: number;
  costs: number;
  onlineHours: number;
}

export interface CalculatorResult {
  grossIncome: number;
  netIncome: number;
  hourlyRate: number;
  monthlyEquivalent: number;
  minWageReference: number;
  riskLevel: 'green' | 'yellow' | 'red' | 'gray';
  riskMessage: string;
}

// 首页问题入口
export interface ProblemEntry {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  colorKey?: 'deduction' | 'pay' | 'injury' | 'blocked' | 'contract' | 'aid' | 'reg';
}

// 底部导航项
export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}
