"""
静态数据完整性校验工具。

只检查 data/*.ts 的结构、日期、URL 和红线措辞，不联网、不自动修改数据。

用法：
  python tools/validate_data.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP_DIR = ROOT / "app"
COMPONENTS_DIR = ROOT / "components"
DATA_DIR = ROOT / "data"
PUBLIC_DIR = ROOT / "public"
SITE_CONFIG = ROOT / "lib" / "site.ts"
SOURCE_DIRS = ["app", "components", "lib"]
CHAT_ROUTE = ROOT / "app" / "api" / "chat" / "route.ts"
CHAT_PAGE = ROOT / "app" / "chat" / "page.tsx"
AUTH_PLACEHOLDER_ROUTE = ROOT / "app" / "api" / "auth" / "[...nextauth]" / "route.ts"
CAPACITOR_CONFIG = ROOT / "capacitor.config.ts"
ANDROID_DIR = ROOT / "android"
ANDROID_APP_ID = "com.deliveryhelper.rider"
ANDROID_APP_NAME = "骑手权益助手"

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
URL_RE = re.compile(r"^https://")
FIELD_RE = re.compile(r"(\w+):\s*([^,\n]+)")
STRING_RE = re.compile(r"^'([^']*)'$")

BANNED_PHRASES = [
    "平台违法",
    "一定可以仲裁成功",
    "一定能仲裁成功",
    "应当获得赔偿",
]

DISALLOWED_AUTH_TOKENS = [
    "next-auth",
    "@auth/core",
    "SessionProvider",
    "getServerSession",
    "signIn(",
    "signOut(",
    "NextAuth(",
    "Resend(",
    "EmailProvider",
]

MIN_WAGE_SCOPE_REQUIRED_CITIES = {"成都", "武汉", "重庆", "郑州", "西安", "合肥"}
SEO_PUBLIC_ROUTES = [
    "/",
    "/calculator",
    "/regulations",
    "/legal-aid",
    "/chat",
    "/news",
    "/disclaimer",
    "/privacy",
]
SEO_PRIVATE_ROUTES = ["/api/", "/offline"]


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)


def read_data_file(name: str) -> str:
    return (DATA_DIR / name).read_text(encoding="utf-8")


def extract_constants(content: str) -> dict[str, str]:
    constants: dict[str, str] = {}
    for match in re.finditer(r"const\s+(\w+)\s*=\s*'([^']*)';", content):
        constants[match.group(1)] = match.group(2)
    return constants


def extract_array_objects(content: str, const_name: str) -> list[str]:
    marker = f"export const {const_name}"
    start = content.find(marker)
    if start == -1:
        return []

    array_start = content.find("[", start)
    array_end = content.rfind("]")
    if array_start == -1 or array_end == -1 or array_end <= array_start:
        return []

    objects: list[str] = []
    depth = 0
    object_start: int | None = None
    for index, char in enumerate(content[array_start:array_end], array_start):
        if char == "{":
            if depth == 0:
                object_start = index
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0 and object_start is not None:
                objects.append(content[object_start : index + 1])
                object_start = None

    return objects


def parse_object(object_text: str, constants: dict[str, str]) -> dict[str, object]:
    result: dict[str, object] = {}
    for key, raw_value in FIELD_RE.findall(object_text):
        value = raw_value.strip()
        string_match = STRING_RE.match(value)
        if string_match:
            result[key] = string_match.group(1)
        elif value in constants:
            result[key] = constants[value]
        elif value == "null":
            result[key] = None
        else:
            number_match = re.match(r"^-?\d+(?:\.\d+)?$", value)
            if number_match:
                result[key] = float(value) if "." in value else int(value)
            else:
                result[key] = value
    return result


def require_string(
    report: Report,
    item: dict[str, object],
    field: str,
    label: str,
) -> str:
    value = item.get(field)
    if not isinstance(value, str) or not value.strip():
        report.error(f"{label}: 缺少必填字段 {field}")
        return ""
    return value


def validate_date(report: Report, value: str, label: str, field: str) -> None:
    if value != "待核实" and not DATE_RE.match(value):
        report.error(f"{label}: {field} 应为 YYYY-MM-DD 或 待核实")


def validate_url(report: Report, value: str, label: str, field: str) -> None:
    if value and not URL_RE.match(value):
        report.error(f"{label}: {field} 必须使用 https:// 官方链接")


def validate_unique(report: Report, values: list[str], label: str) -> None:
    seen: set[str] = set()
    duplicates: set[str] = set()
    for value in values:
        if value in seen:
            duplicates.add(value)
        seen.add(value)
    for value in sorted(duplicates):
        report.error(f"{label}: 存在重复项 {value}")


def validate_banned_phrases(report: Report) -> None:
    for path in DATA_DIR.glob("*.ts"):
        content = path.read_text(encoding="utf-8")
        for phrase in BANNED_PHRASES:
            if phrase in content:
                report.error(f"{path.name}: 出现红线措辞 `{phrase}`")


def validate_regulations(report: Report) -> None:
    content = read_data_file("regulations.ts")
    items = [
        parse_object(obj, extract_constants(content))
        for obj in extract_array_objects(content, "regulations")
    ]
    validate_unique(report, [str(item.get("id", "")) for item in items], "regulations")

    for item in items:
        label = f"regulations[{item.get('id', 'unknown')}]"
        title = require_string(report, item, "title", label)
        require_string(report, item, "issuer", label)
        require_string(report, item, "category", label)
        require_string(report, item, "summary", label)
        official_url = require_string(report, item, "officialUrl", label)
        last_verified = require_string(report, item, "lastVerified", label)
        validate_date(report, last_verified, label, "lastVerified")
        validate_url(report, official_url, label, "officialUrl")
        if len(str(item.get("summary", ""))) > 260:
            report.warn(f"{label}: 摘要较长，确认没有转载大段原文：{title}")


def validate_min_wage(report: Report) -> None:
    content = read_data_file("minWage.ts")
    items = [
        parse_object(obj, extract_constants(content))
        for obj in extract_array_objects(content, "minWageData")
    ]
    validate_unique(report, [str(item.get("city", "")) for item in items], "minWageData")

    for item in items:
        label = f"minWageData[{item.get('city', 'unknown')}]"
        city = require_string(report, item, "city", label)
        source_url = require_string(report, item, "sourceUrl", label)
        last_verified = require_string(report, item, "lastVerified", label)
        effective_date = require_string(report, item, "effectiveDate", label)
        hourly = item.get("hourly")
        monthly = item.get("monthly")
        scope_note = item.get("scopeNote")

        validate_date(report, last_verified, label, "lastVerified")
        validate_date(report, effective_date, label, "effectiveDate")
        if last_verified == "待核实":
            report.warn(f"{label}: 仍为待核实，前端应保持灰色风险判断")
        else:
            validate_url(report, source_url, label, "sourceUrl")
        if not isinstance(hourly, (int, float)) or hourly <= 0:
            report.error(f"{label}: hourly 必须为正数")
        if monthly is not None and (not isinstance(monthly, (int, float)) or monthly <= 0):
            report.error(f"{label}: monthly 必须为正数或 null")
        if city and last_verified != "待核实" and "gov.cn" not in source_url:
            report.warn(f"{label}: 已核验数据建议优先使用政府域名来源")
        if city in MIN_WAGE_SCOPE_REQUIRED_CITIES and not (
            isinstance(scope_note, str) and scope_note.strip()
        ):
            report.error(f"{label}: 分档城市必须提供 scopeNote 适用范围说明")


def validate_legal_aid(report: Report) -> None:
    content = read_data_file("legalAidCenters.ts")
    constants = extract_constants(content)
    items = [
        parse_object(obj, constants)
        for obj in extract_array_objects(content, "legalAidCenters")
    ]
    validate_unique(report, [str(item.get("id", "")) for item in items], "legalAidCenters")
    shanghai_centers = [
        item
        for item in items
        if item.get("city") == "上海" and item.get("type") == "法律援助中心"
    ]

    for item in items:
        label = f"legalAidCenters[{item.get('id', 'unknown')}]"
        require_string(report, item, "name", label)
        require_string(report, item, "type", label)
        require_string(report, item, "city", label)
        source_url = require_string(report, item, "sourceUrl", label)
        last_verified = require_string(report, item, "lastVerified", label)
        phone = item.get("phone")

        validate_date(report, last_verified, label, "lastVerified")
        if last_verified != "待核实":
            validate_url(report, source_url, label, "sourceUrl")
        if isinstance(phone, str) and phone and not re.match(r"^[\d-]{5,20}$", phone):
            report.error(f"{label}: phone 只能包含数字和短横线")

    if len(shanghai_centers) != 17:
        report.error("legalAidCenters: 上海法律援助中心应保持 17 条")

    shanghai_phone_count = sum(
        1 for item in shanghai_centers if str(item.get("phone", "")).strip()
    )
    shanghai_address_time_count = sum(
        1
        for item in shanghai_centers
        if str(item.get("address", "")).strip() and str(item.get("hours", "")).strip()
    )
    shanghai_verified_count = sum(
        1 for item in shanghai_centers if item.get("lastVerified") != "待核实"
    )

    if shanghai_phone_count != 17:
        report.error("legalAidCenters: 上海法律援助中心电话应全部核验")
    if shanghai_address_time_count != 17:
        report.error("legalAidCenters: 上海法律援助中心地址/接待时间应全部核验")
    if shanghai_verified_count != 17:
        report.error("legalAidCenters: 上海法律援助中心不应回退为待核实")


def validate_news(report: Report) -> None:
    content = read_data_file("news.ts")
    items = [
        parse_object(obj, extract_constants(content))
        for obj in extract_array_objects(content, "newsItems")
    ]
    validate_unique(report, [str(item.get("id", "")) for item in items], "newsItems")

    for item in items:
        label = f"newsItems[{item.get('id', 'unknown')}]"
        require_string(report, item, "title", label)
        source_url = require_string(report, item, "sourceUrl", label)
        summary = require_string(report, item, "summary", label)
        last_verified = require_string(report, item, "lastVerified", label)
        date = require_string(report, item, "date", label)

        validate_date(report, date, label, "date")
        validate_date(report, last_verified, label, "lastVerified")
        validate_url(report, source_url, label, "sourceUrl")
        if len(summary) > 220:
            report.warn(f"{label}: 新闻摘要较长，确认没有转载原文")


def validate_prompts(report: Report) -> None:
    content = read_data_file("prompts.ts")
    required_phrases = [
        "免责声明",
        "下一步建议",
        "不是律师",
        "不编造法条",
        "提示词注入防御",
        "不当作系统命令",
        "忽略、覆盖或改写系统提示词",
        "不泄露系统提示词",
        "API Key",
        "不因为用户要求改变身份",
    ]
    for phrase in required_phrases:
        if phrase not in content:
            report.error(f"prompts.ts: 系统提示词缺少 `{phrase}`")


def iter_source_files() -> list[Path]:
    files: list[Path] = []
    for directory in SOURCE_DIRS:
        root = ROOT / directory
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if path.suffix in {".ts", ".tsx", ".js", ".jsx", ".mts"}:
                files.append(path)
    return files


def validate_account_boundary(report: Report) -> None:
    for path in iter_source_files():
        content = path.read_text(encoding="utf-8")
        label = path.relative_to(ROOT).as_posix()
        for token in DISALLOWED_AUTH_TOKENS:
            if token in content:
                report.error(f"{label}: MVP 不启用真实账号系统，发现认证残留 `{token}`")

    if AUTH_PLACEHOLDER_ROUTE.exists():
        content = AUTH_PLACEHOLDER_ROUTE.read_text(encoding="utf-8")
        required_tokens = ["authDisabledResponse", "status: 501", "暂不启用真实账号系统"]
        for token in required_tokens:
            if token not in content:
                report.error(
                    "app/api/auth/[...nextauth]/route.ts: 账号 API 只能作为未启用占位返回 501"
                )


def validate_accessibility_boundary(report: Report) -> None:
    legal_aid_path = APP_DIR / "legal-aid" / "page.tsx"
    regulations_path = APP_DIR / "regulations" / "page.tsx"
    forbidden_tokens = [
        'role="tablist"',
        "role='tablist'",
        'role="tab"',
        "role='tab'",
        "aria-selected",
    ]

    def validate_filter_page(path: Path, aria_label: str, require_filter: bool) -> None:
        label = path.relative_to(ROOT).as_posix()
        if not path.exists():
            report.error(f"{label}: 缺少筛选页面")
            return

        content = path.read_text(encoding="utf-8")
        for token in forbidden_tokens:
            if token in content:
                report.error(
                    f"{label}: 筛选按钮不应使用不完整 tab 语义，发现 `{token}`"
                )
        has_filter = f'aria-label="{aria_label}"' in content or "aria-pressed=" in content
        if not require_filter and not has_filter:
            return
        if "aria-pressed=" not in content:
            report.error(f"{label}: 筛选按钮必须使用 aria-pressed 表达当前筛选状态")
        if f'aria-label="{aria_label}"' not in content:
            report.error(f"{label}: 筛选容器必须提供 aria-label `{aria_label}`")

    legal_aid_content = read_data_file("legalAidCenters.ts")
    legal_aid_constants = extract_constants(legal_aid_content)
    legal_aid_items = [
        parse_object(obj, legal_aid_constants)
        for obj in extract_array_objects(legal_aid_content, "legalAidCenters")
    ]
    legal_aid_cities = {str(item.get("city", "")) for item in legal_aid_items}
    validate_filter_page(
        legal_aid_path,
        "城市筛选",
        require_filter=len(legal_aid_cities) > 1,
    )
    validate_filter_page(regulations_path, "法规分类", require_filter=True)


def validate_pwa_boundary(report: Report) -> None:
    manifest_path = PUBLIC_DIR / "manifest.json"
    sw_path = PUBLIC_DIR / "sw.js"
    offline_page_path = APP_DIR / "offline" / "page.tsx"
    offline_notice_path = COMPONENTS_DIR / "OfflineDataNotice.tsx"
    layout_path = APP_DIR / "layout.tsx"
    smoke_script_path = ROOT / "tools" / "smoke_web.ps1"
    package_path = ROOT / "package.json"

    if not manifest_path.exists():
        report.error("public/manifest.json: 缺少 PWA manifest")
        return
    if not sw_path.exists():
        report.error("public/sw.js: 缺少 Service Worker")
        return
    if not smoke_script_path.exists():
        report.error("tools/smoke_web.ps1: 缺少生产服务/PWA 烟测脚本")
    if package_path.exists():
        package = json.loads(package_path.read_text(encoding="utf-8"))
        scripts = package.get("scripts", {})
        if "web:smoke" not in scripts:
            report.error("package.json: 缺少生产服务/PWA 烟测脚本 web:smoke")

    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        report.error(f"public/manifest.json: JSON 格式错误 {exc}")
        return

    for field in ["name", "short_name", "start_url", "display", "icons"]:
        if field not in manifest:
            report.error(f"public/manifest.json: 缺少字段 {field}")

    if manifest.get("start_url") != "/":
        report.warn("public/manifest.json: start_url 建议保持为 `/`")
    if manifest.get("display") not in {"standalone", "fullscreen", "minimal-ui"}:
        report.warn("public/manifest.json: display 建议使用 standalone/fullscreen/minimal-ui")

    icons = manifest.get("icons")
    if isinstance(icons, list):
        icon_sizes: set[str] = set()
        has_maskable_icon = False
        for index, icon in enumerate(icons):
            if not isinstance(icon, dict):
                report.error(f"public/manifest.json: icons[{index}] 必须是对象")
                continue
            src = str(icon.get("src", ""))
            sizes = str(icon.get("sizes", ""))
            purpose = str(icon.get("purpose", ""))
            icon_sizes.add(sizes)
            has_maskable_icon = has_maskable_icon or "maskable" in purpose
            if not src.startswith("/") or src.startswith("//"):
                report.error(f"public/manifest.json: icons[{index}].src 必须是站内绝对路径")
                continue
            if not (PUBLIC_DIR / src.lstrip("/")).exists():
                report.error(f"public/manifest.json: 图标文件不存在 {src}")
        for required_size in ["192x192", "512x512"]:
            if required_size not in icon_sizes:
                report.warn(f"public/manifest.json: 建议提供 {required_size} 图标")
        if not has_maskable_icon:
            report.warn("public/manifest.json: 建议至少提供一个 maskable 图标")
    else:
        report.error("public/manifest.json: icons 必须是数组")

    sw_content = sw_path.read_text(encoding="utf-8")
    if "/offline" not in sw_content:
        report.error("public/sw.js: 离线页 `/offline` 必须进入离线回退策略")
    for required_asset in ["/manifest.json", "/icons/icon-192x192.svg", "/icons/icon-512x512.svg"]:
        if required_asset not in sw_content:
            report.error(f"public/sw.js: PWA 关键资源必须预缓存 {required_asset}")
    if "requestUrl.origin !== self.location.origin" not in sw_content:
        report.error("public/sw.js: Service Worker 必须跳过非同源请求")
    if "/api/" not in sw_content or "return" not in sw_content:
        report.error("public/sw.js: API 请求必须显式跳过缓存")
    if re.search(r"https?://", sw_content):
        report.error("public/sw.js: MVP Service Worker 不应缓存外部 URL")

    if not offline_page_path.exists():
        report.error("app/offline/page.tsx: 缺少离线页")
    else:
        offline_page_content = offline_page_path.read_text(encoding="utf-8")
        if "数据可能已过期" not in offline_page_content:
            report.error("app/offline/page.tsx: 离线页必须提示缓存数据可能已过期")
        if "以页面来源链接为准" not in offline_page_content:
            report.error("app/offline/page.tsx: 离线页必须提示联网后复核来源链接")

    if not offline_notice_path.exists():
        report.error("components/OfflineDataNotice.tsx: 缺少全局离线缓存提示")
    else:
        offline_notice_content = offline_notice_path.read_text(encoding="utf-8")
        required_notice_tokens = [
            ("navigator.onLine", "浏览器在线状态检测"),
            ("role=\"status\"", "状态提示语义"),
            ("aria-live=\"polite\"", "屏幕阅读器状态播报"),
            ("页面内容可能来自缓存", "缓存来源提示"),
            ("可能已过期", "数据过期提示"),
            ("以页面来源链接为准", "来源复核提示"),
        ]
        for token, label in required_notice_tokens:
            if token not in offline_notice_content:
                report.error(f"components/OfflineDataNotice.tsx: 缺少{label}")

    if layout_path.exists():
        layout_content = layout_path.read_text(encoding="utf-8")
        if "OfflineDataNotice" not in layout_content:
            report.error("app/layout.tsx: 必须挂载全局离线缓存提示")


def validate_chat_boundary(report: Report) -> None:
    if not CHAT_ROUTE.exists():
        report.error("app/api/chat/route.ts: 缺少 AI 问答 API")
        return

    route_content = CHAT_ROUTE.read_text(encoding="utf-8")
    required_route_tokens = [
        ("MAX_REQUEST_BYTES", "请求体大小上限"),
        ("MAX_MESSAGE_LENGTH", "单条消息长度上限"),
        ("MAX_TOTAL_CONTENT_LENGTH", "总上下文长度上限"),
        ("MAX_MESSAGES", "历史消息数量上限"),
        ("CHAT_STREAM_TIMEOUT_MS", "AI 流式输出超时上限"),
        ("request.text()", "按实际请求体文本二次校验大小"),
        ("new TextEncoder().encode(bodyText).length", "按真实字节数校验请求体"),
        ("sanitizeMessages", "消息清洗函数"),
        ("isAllowedOrigin", "跨站请求来源校验"),
        ("request.headers.get('origin')", "读取请求 Origin"),
        ("process.env.SITE_URL", "允许部署域名来源"),
        ("latestMessage.role !== 'user'", "最后一条消息必须是用户问题"),
        ("process.env.AI_API_KEY", "AI Key 只能服务端读取"),
        ("maxOutputTokens", "模型输出长度上限"),
        ("temperature: 0.3", "低温度降低随意发挥"),
        ("STREAM_DISCLAIMER", "服务端固定免责声明"),
        ("STREAM_TIMEOUT_MESSAGE", "服务端流式超时提示"),
        ("appendDisclaimerIfMissing", "服务端流式输出后置兜底免责声明"),
        ("result.textStream", "服务端必须接管文本流再输出"),
    ]
    for token, description in required_route_tokens:
        if token not in route_content:
            report.error(f"app/api/chat/route.ts: 缺少 `{token}`，无法保证{description}")

    if not any(
        token in route_content
        for token in [
            "message.role === 'user' || message.role === 'assistant'",
            "msg.role === 'user' || msg.role === 'assistant'",
        ]
    ):
        report.error("app/api/chat/route.ts: 消息角色必须只允许 user / assistant")
    for public_key_token in ["NEXT_PUBLIC_AI_API_KEY", "NEXT_PUBLIC_DEEPSEEK_API_KEY"]:
        if public_key_token in route_content:
            report.error(
                f"app/api/chat/route.ts: AI API Key 不得使用公开前缀 `{public_key_token}`"
            )
    for forbidden_token in ["localStorage", "sessionStorage", "prisma.", "db."]:
        if forbidden_token in route_content:
            report.error(f"app/api/chat/route.ts: MVP 不保存聊天记录，发现 `{forbidden_token}`")

    if CHAT_PAGE.exists():
        page_content = CHAT_PAGE.read_text(encoding="utf-8")
        required_page_tokens = [
            ("maxLength={1000}", "前端输入长度上限"),
            ("readErrorMessage", "读取服务端边界错误"),
        ]
        for token, description in required_page_tokens:
            if token not in page_content:
                report.error(f"app/chat/page.tsx: 缺少 `{token}`，无法保证{description}")
        if "个人敏感信息" not in page_content or not (
            "请勿输入" in page_content or "请不要输入" in page_content
        ):
            report.error("app/chat/page.tsx: 缺少敏感信息输入提醒")


def validate_seo_boundary(report: Report) -> None:
    layout_path = APP_DIR / "layout.tsx"
    sitemap_path = APP_DIR / "sitemap.ts"
    robots_path = APP_DIR / "robots.ts"

    for path in [layout_path, sitemap_path, robots_path, SITE_CONFIG]:
        if not path.exists():
            report.error(f"{path.relative_to(ROOT).as_posix()}: 缺少 SEO 文件")
            return

    layout_content = layout_path.read_text(encoding="utf-8")
    sitemap_content = sitemap_path.read_text(encoding="utf-8")
    robots_content = robots_path.read_text(encoding="utf-8")
    site_content = SITE_CONFIG.read_text(encoding="utf-8")

    for token in ["NEXT_PUBLIC_SITE_URL", "process.env.SITE_URL", ".replace(/\\/$/, '')"]:
        if token not in site_content:
            report.error(f"lib/site.ts: 缺少 `{token}`，站点 URL 不应写死在 SEO 文件里")

    required_layout_tokens = [
        ("metadataBase:", "metadataBase"),
        ("manifest: '/manifest.json'", "PWA manifest metadata"),
        ("openGraph:", "OpenGraph metadata"),
        ("keywords:", "SEO keywords"),
    ]
    for token, description in required_layout_tokens:
        if token not in layout_content:
            report.error(f"app/layout.tsx: 缺少 {description}")

    for route in SEO_PUBLIC_ROUTES:
        sitemap_token = f"${{BASE_URL}}{route}"
        if sitemap_token not in sitemap_content:
            report.error(f"app/sitemap.ts: sitemap 缺少公开路径 {route}")

    for private_route in SEO_PRIVATE_ROUTES:
        if f"${{BASE_URL}}{private_route}" in sitemap_content:
            report.error(f"app/sitemap.ts: sitemap 不应包含非公开路径 {private_route}")
        if private_route not in robots_content:
            report.error(f"app/robots.ts: robots 应屏蔽 {private_route}")

    if "sitemap: `${BASE_URL}/sitemap.xml`" not in robots_content:
        report.error("app/robots.ts: robots 必须声明 sitemap.xml")

    for label, content in [
        ("app/layout.tsx", layout_content),
        ("app/sitemap.ts", sitemap_content),
        ("app/robots.ts", robots_content),
    ]:
        if "https://delivery-helper.vercel.app" in content:
            report.error(f"{label}: 不应硬编码生产域名，应统一使用 lib/site.ts")


def validate_native_app_boundary(report: Report) -> None:
    package_path = ROOT / "package.json"
    native_shell_path = ROOT / "native-shell" / "index.html"
    android_build_path = ANDROID_DIR / "app" / "build.gradle"
    android_manifest_path = ANDROID_DIR / "app" / "src" / "main" / "AndroidManifest.xml"
    android_strings_path = ANDROID_DIR / "app" / "src" / "main" / "res" / "values" / "strings.xml"
    android_capacitor_path = ANDROID_DIR / "app" / "src" / "main" / "assets" / "capacitor.config.json"

    required_paths = [
        (CAPACITOR_CONFIG, "Capacitor 配置"),
        (native_shell_path, "App 壳占位页"),
        (android_build_path, "Android Gradle 配置"),
        (android_manifest_path, "Android Manifest 配置"),
        (android_strings_path, "Android 应用名配置"),
        (android_capacitor_path, "Android 同步后的 Capacitor 配置"),
    ]
    for path, description in required_paths:
        if not path.exists():
            report.error(f"{path.relative_to(ROOT).as_posix()}: 缺少{description}")

    if package_path.exists():
        package = json.loads(package_path.read_text(encoding="utf-8"))
        dependencies = package.get("dependencies", {})
        dev_dependencies = package.get("devDependencies", {})
        scripts = package.get("scripts", {})
        for dependency in ["@capacitor/core", "@capacitor/android"]:
            if dependency not in dependencies:
                report.error(f"package.json: 缺少原生 App 依赖 {dependency}")
        if "@capacitor/cli" not in dev_dependencies:
            report.error("package.json: 缺少原生 App 开发依赖 @capacitor/cli")
        for script in ["app:sync:android:dev", "app:doctor", "app:open:android"]:
            if script not in scripts:
                report.error(f"package.json: 缺少原生 App 脚本 {script}")

    if CAPACITOR_CONFIG.exists():
        config_content = CAPACITOR_CONFIG.read_text(encoding="utf-8")
        for token in [ANDROID_APP_ID, ANDROID_APP_NAME, "native-shell", "CAPACITOR_SERVER_URL"]:
            if token not in config_content:
                report.error(f"capacitor.config.ts: 缺少 `{token}`")
        if "serverUrl = process.env.CAPACITOR_SERVER_URL" not in config_content:
            report.error("capacitor.config.ts: App URL 必须通过环境变量注入")

    if native_shell_path.exists():
        native_shell_content = native_shell_path.read_text(encoding="utf-8")
        if "CAPACITOR_SERVER_URL" not in native_shell_content:
            report.error("native-shell/index.html: 必须提示配置 CAPACITOR_SERVER_URL")

    if android_build_path.exists():
        android_build_content = android_build_path.read_text(encoding="utf-8")
        for token in [
            f'namespace = "{ANDROID_APP_ID}"',
            f'applicationId "{ANDROID_APP_ID}"',
        ]:
            if token not in android_build_content:
                report.error(f"android/app/build.gradle: 缺少 `{token}`")

    if android_manifest_path.exists():
        android_manifest_content = android_manifest_path.read_text(encoding="utf-8")
        if 'android:allowBackup="false"' not in android_manifest_content:
            report.error(
                'android/app/src/main/AndroidManifest.xml: MVP 不应允许系统备份本地 App 数据'
            )

    if android_strings_path.exists():
        android_strings_content = android_strings_path.read_text(encoding="utf-8")
        for token in [ANDROID_APP_NAME, ANDROID_APP_ID]:
            if token not in android_strings_content:
                report.error(f"android/app/src/main/res/values/strings.xml: 缺少 `{token}`")

    if android_capacitor_path.exists():
        try:
            android_config = json.loads(android_capacitor_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            report.error(f"android/app/src/main/assets/capacitor.config.json: JSON 格式错误 {exc}")
            return
        if android_config.get("appId") != ANDROID_APP_ID:
            report.error("android/app/src/main/assets/capacitor.config.json: appId 不匹配")
        if android_config.get("appName") != ANDROID_APP_NAME:
            report.error("android/app/src/main/assets/capacitor.config.json: appName 不匹配")
        server = android_config.get("server")
        if isinstance(server, dict):
            url = str(server.get("url", ""))
            is_https = url.startswith("https://")
            is_local_dev = url.startswith("http://10.0.2.2") or url.startswith(
                "http://localhost"
            )
            if not (is_https or is_local_dev):
                report.error("android/app/src/main/assets/capacitor.config.json: App URL 必须是 HTTPS 或本地调试地址")


def main() -> int:
    report = Report()

    validate_banned_phrases(report)
    validate_regulations(report)
    validate_min_wage(report)
    validate_legal_aid(report)
    validate_news(report)
    validate_prompts(report)
    validate_account_boundary(report)
    validate_accessibility_boundary(report)
    validate_pwa_boundary(report)
    validate_chat_boundary(report)
    validate_seo_boundary(report)
    validate_native_app_boundary(report)

    print("=" * 60)
    print("静态数据与项目边界校验")
    print("=" * 60)

    if report.warnings:
        print("\n[WARN]")
        for warning in report.warnings:
            print(f"- {warning}")

    if report.errors:
        print("\n[FAIL]")
        for error in report.errors:
            print(f"- {error}")
        return 1

    print("\n[OK] 数据结构和硬性边界检查通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
