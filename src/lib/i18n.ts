import type { AppLocale } from "@/lib/constants";

const messages = {
  en: {
    siteName: "HowToRise",
    homeTitle: "HowToRise Tutorials",
    homeDesc: "Guides, fixes and resources for Rise users.",
    tutorials: "Tutorials",
    adminLogin: "Admin Login",
    email: "Email",
    password: "Password",
    submit: "Submit",
    logout: "Logout"
  },
  zh: {
    siteName: "HowToRise",
    homeTitle: "HowToRise 教程",
    homeDesc: "面向 Rise 用户的教程、修复与资源。",
    tutorials: "教程",
    adminLogin: "管理员登录",
    email: "邮箱",
    password: "密码",
    submit: "提交",
    logout: "退出登录"
  }
} as const;

export function t(locale: AppLocale, key: keyof (typeof messages)["en"]) {
  return messages[locale][key];
}
