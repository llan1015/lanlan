// Bilingual content model. All user-facing strings live here.
window.SITE_CONTENT = {
  meta: {
    name: { en: "Lan Lan", zh: "兰兰" },
    pronouns: { en: "she / her", zh: "她" },
    role: {
      en: "Assistant Professor",
      zh: "助理教授",
    },
    affiliation: {
      en: "Li Anmin Institute of Economic Research · Liaoning University",
      zh: "辽宁大学 · 李安民经济研究院",
    },
    location: { en: "Shenyang, China", zh: "中国 · 沈阳" },
    tagline: {
      en: { quote: "Become who you are.", attribution: "— Friedrich Nietzsche" },
      zh: { quote: "成为你自己。", attribution: "—— 尼采" },
    },
  },

  nav: {
    about: { en: "About", zh: "关于" },
    research: { en: "Research", zh: "研究" },
    projects: { en: "Working Papers", zh: "工作论文" },
    cv: { en: "CV", zh: "履历" },
    talks: { en: "Talks", zh: "学术报告" },
    teaching: { en: "Teaching", zh: "教学" },
    contact: { en: "Contact", zh: "联系" },
  },

  about: {
    heading: { en: "About", zh: "关于" },
    body: [
      {
        en:
          "I'm an assistant professor at the Li Anmin Institute of Economic Research at Liaoning University. I work in applied microeconomics, at the intersection of labor and urban economics.",
        zh:
          "我是辽宁大学李安民经济研究院的助理教授。我的研究领域是应用微观经济学，聚焦于劳动经济学与城市经济学的交叉问题。",
      },
      {
        en:
          "My current research asks how the size and composition of a local labor market shape the quality of the match between workers and jobs — with particular attention to college graduates, dual-career couples, and how major-specific market thickness changes outcomes that aggregate measures of city size miss.",
        zh:
          "我目前的研究关注本地劳动力市场的规模与结构如何影响劳动者与工作之间的匹配质量，尤其关注高校毕业生与“双高夫妇”，并探讨“专业相关劳动力市场”这一更精细的口径如何揭示传统城市规模指标所忽略的差异。",
      },
      {
        en:
          "I received my Ph.D. in Economics from Clemson University in 2023, with earlier degrees from the University of Wisconsin–Madison, the University of Minnesota–Twin Cities.",
        zh:
          "我于 2023 年在 Clemson University 获得经济学博士学位，此前曾就读于 University of Wisconsin–Madison 与 University of Minnesota–Twin Cities。",
      },
    ],
    interests: {
      en: ["Applied microeconomics", "Labor economics", "Urban economics", "Job match quality", "Education & labor markets"],
      zh: ["应用微观经济学", "劳动经济学", "城市经济学", "工作匹配质量", "教育与劳动力市场"],
    },
  },

  research: {
    heading: { en: "Research focus", zh: "研究方向" },
    areas: [
      {
        key: "major-markets",
        title: { en: "Major-specific labor markets", zh: "专业相关的劳动力市场" },
        body: {
          en: "A finer measure of market size — tied to a worker's college major — that turns out to predict job match quality better than overall city population.",
          zh: "以个体的本科专业为口径衡量劳动力市场规模，这一更精细的指标在预测工作匹配质量上比城市总人口更稳健。",
        },
      },
      {
        key: "match-quality",
        title: { en: "Job match quality", zh: "工作匹配质量" },
        body: {
          en: "How well do workers' education, training, and acquired abilities line up with what their jobs actually require? I build measures from Chinese and U.S. micro-data and ask what local markets do to that gap.",
          zh: "劳动者的学历、训练与能力，是否与其实际工作的要求相匹配？我利用中国与美国的微观数据构建匹配质量指标，并考察本地劳动力市场对这一差距的影响。",
        },
      },
      {
        key: "couples-cities",
        title: { en: "Power couples & cities", zh: "“双高夫妇”与城市" },
        body: {
          en: "Highly educated dual-career couples concentrate in large cities. I ask whether that location choice actually buys better job matches for both spouses — and for whom the effect is largest.",
          zh: "“双高夫妇”——即受过高等教育的双职业夫妇——更倾向于居住于大城市。我考察这种区位选择是否真的为夫妻双方带来更优的工作匹配，以及效应对哪类群体最为显著。",
        },
      },
    ],
  },

  projects: {
    heading: { en: "Working papers", zh: "工作论文" },
    note: {
      en: "Drafts in circulation and work in progress. Happy to share on request.",
      zh: "正在流传的工作论文与在研项目，欢迎来信索取。",
    },
    items: [
      {
        status: { en: "Under review", zh: "审稿中" },
        title: {
          en: "The Benefits of Major-related Labor Markets for Job Match Quality of College Graduates",
          zh: "专业相关劳动力市场对高校毕业生工作匹配质量的促进作用",
        },
        blurb: {
          en:
            "Introduces a major-specific measure of labor market size and shows it is a robust predictor of better job match quality for graduates. The effect is much more pronounced for male and younger workers, while overall labor market size has inconsistent effects.",
          zh:
            "本文提出以个体专业为口径的劳动力市场规模指标，并证明这一指标能稳健预测毕业生更优的工作匹配质量。该效应在男性与年轻劳动者中更为显著，而以总体规模度量时效应并不一致。",
        },
      },
      {
        status: { en: "Working paper", zh: "工作论文" },
        title: {
          en: "The Major-Specific Market Size and the Job Match of Power Couples",
          zh: "专业相关市场规模与“双高夫妇”的工作匹配",
        },
        blurb: {
          en:
            "Asks whether power couples — highly educated, dual-career spouses — gain better job matches by residing in large urban areas. Both husbands and wives in power couples are more likely to work in jobs that match their education and abilities in thicker major-related labor markets; the correlation with raw population is inconsistent.",
          zh:
            "本文考察“双高夫妇”——即高学历的双职业夫妇——是否因居住于大城市而获得更优的工作匹配。结果显示，在“专业相关劳动力市场”更厚的城市中，夫妻双方都更可能从事与其学历和能力相匹配的工作；而与城市总人口的相关性并不稳定。",
        },
      },
      {
        status: { en: "In progress", zh: "在研" },
        title: {
          en: "Differences in job match quality: a Blinder–Oaxaca decomposition",
          zh: "工作匹配质量的差异：基于 Blinder–Oaxaca 分解",
        },
        blurb: {
          en:
            "Decomposing observed differences in job match quality across groups into endowment and structural components using a Blinder–Oaxaca framework.",
          zh:
            "运用 Blinder–Oaxaca 分解方法，将不同群体间工作匹配质量的差异分解为禀赋差异与结构差异两部分。",
        },
      },
      {
        status: { en: "In progress", zh: "在研" },
        title: {
          en: "China's employment quota system and the employment of people with disabilities",
          zh: "中国残疾人按比例就业制度对残疾人就业的影响",
        },
        blurb: {
          en:
            "Examines the effect of China's employment quota policy on the labor market outcomes of people with disabilities.",
          zh:
            "考察中国残疾人按比例就业制度对残疾人劳动力市场表现的影响。",
        },
      },
      {
        status: { en: "In progress", zh: "在研" },
        title: {
          en: "Why do most U.S. states use a winner-take-all system in presidential elections? A simple analysis",
          zh: "为何美国多数州在总统选举中采用“胜者全得”制度：一个简要分析",
        },
        blurb: {
          en:
            "A short theoretical note motivating the near-universal adoption of winner-take-all electoral vote allocation across U.S. states.",
          zh:
            "一篇简短的理论笔记，尝试解释为何“胜者全得”几乎成为美国各州选举人票分配的普遍制度。",
        },
      },
    ],
  },

  cv: {
    heading: { en: "Experience", zh: "履历" },
    positions: [
      {
        when: "2023 —",
        role: { en: "Assistant Professor", zh: "助理教授" },
        where: {
          en: "Li Anmin Institute of Economic Research, Liaoning University",
          zh: "辽宁大学 李安民经济研究院",
        },
      },
    ],
    education: [
      {
        when: "2023",
        role: { en: "Ph.D. in Economics", zh: "经济学博士" },
        where: { en: "Clemson University", zh: "Clemson University" },
      },
      {
        when: "2018",
        role: { en: "M.S. in Economics", zh: "经济学硕士" },
        where: { en: "University of Wisconsin–Madison", zh: "University of Wisconsin–Madison" },
      },
      {
        when: "2015",
        role: { en: "B.S. in Economics", zh: "经济学学士" },
        where: { en: "University of Minnesota–Twin Cities", zh: "University of Minnesota–Twin Cities" },
      },
    ],
    download: { en: "Download full CV (PDF)", zh: "下载完整简历 (PDF)" },
  },

  talks: {
    heading: { en: "Selected talks", zh: "部分学术报告" },
    items: [
      {
        when: "2024",
        what: {
          en: "The 8th Annual Conference of China Labor Economists Forum",
          zh: "中国劳动经济学者论坛第八届年会",
        },
        where: { en: "Conference presentation", zh: "会议报告" },
      },
      {
        when: "2023",
        what: {
          en: "AEA / ASSA Annual Meeting (poster) · MEA 87th Annual Meeting · WEAI 98th Annual Conference",
          zh: "AEA / ASSA 年会（海报）· MEA 第 87 届年会 · WEAI 第 98 届年会",
        },
        where: { en: "Conference presentations", zh: "会议报告" },
      },
      {
        when: "2022",
        what: {
          en: "SEA 92nd Annual Meeting · Carolina Region Empirical Economics Day",
          zh: "南部经济学会 (SEA) 第 92 届年会 · 卡罗莱纳地区实证经济学日",
        },
        where: { en: "Conference presentations", zh: "会议报告" },
      },
    ],
  },

  teaching: {
    heading: { en: "Teaching", zh: "教学" },
    instructor: {
      heading: { en: "Instructor", zh: "授课教师" },
      items: [
        {
          school: { en: "Liaoning University", zh: "辽宁大学" },
          course: { en: "Econometrics", zh: "计量经济学" },
          level: { en: "M.A. & Ph.D. (international students)", zh: "硕士 与 国际生博士" },
        },
        {
          school: { en: "Clemson University", zh: "Clemson University" },
          course: { en: "Principles of Macroeconomics", zh: "宏观经济学原理" },
          level: { en: "Undergraduate", zh: "本科" },
        },
      ],
    },
    ta: {
      heading: { en: "Teaching assistant", zh: "助教经历" },
      items: [
        {
          school: { en: "Clemson University", zh: "Clemson University" },
          courses: [
            { name: { en: "Macro Theory II", zh: "宏观经济学理论 II" }, level: { en: "Ph.D.", zh: "博士" } },
            { name: { en: "Intermediate Macroeconomics", zh: "中级宏观经济学" }, level: { en: "Undergraduate", zh: "本科" } },
            { name: { en: "International Microeconomics", zh: "国际微观经济学" }, level: { en: "Undergraduate & M.A.", zh: "本科与硕士" } },
            { name: { en: "Economics of Health", zh: "健康经济学" }, level: { en: "Undergraduate & M.A.", zh: "本科与硕士" } },
          ],
        },
        {
          school: { en: "University of Wisconsin–Madison", zh: "University of Wisconsin–Madison" },
          courses: [
            { name: { en: "Behavioral Economics", zh: "行为经济学" }, level: { en: "Undergraduate", zh: "本科" } },
          ],
        },
      ],
    },
    advising: {
      heading: { en: "Advising", zh: "指导学生" },
      body: {
        en:
          "I welcome master's students at Liaoning University interested in empirical labor or urban economics. Please email me a short research sketch.",
        zh:
          "我欢迎辽宁大学硕士研究生加入我的研究，方向包括实证劳动经济学与城市经济学。请通过邮件联系并附上简要的研究设想。",
      },
    },
  },

  contact: {
    heading: { en: "Contact", zh: "联系方式" },
    intro: {
      en: "Easiest by email. I usually reply within a few days during term.",
      zh: "最便捷的方式是邮件联系。学期内通常数日内回复。",
    },
    email: "doublellan1015@outlook.com",
    emailAlt: "lanlan@lnu.edu.cn",
    phone: "+86 150-6668-3031",
    office: {
      en: "Room 413, Econ Building · Puhe Campus, Liaoning University",
      zh: "辽宁大学蒲河校区 经济学院 413 室",
    },
    labels: {
      email: { en: "Email", zh: "邮箱" },
      emailAlt: { en: "Alt email", zh: "备用邮箱" },
      phone: { en: "Phone", zh: "电话" },
      office: { en: "Office", zh: "办公室" },
    },
  },

  footer: {
    built: {
      en: "Last updated May 2026",
      zh: "最近更新 2026 年 5 月",
    },
  },
};
