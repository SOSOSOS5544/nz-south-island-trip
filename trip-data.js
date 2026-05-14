window.defaultTripData = {
  title: "2026 紐西蘭自駕房車遊",
  period: "2026/5/31 - 2026/6/13",
  travelers: "5 人同行，南島租房車，南北島轉移以飛機為主",
  heroImage: {
    url: "images/hero/home-hero.png",
    alt: "紐西蘭南島山湖風景"
  },
  overviewImage: {
    url: "images/overview/overview-cover.png",
    alt: "紐西蘭南島旅遊手冊封面"
  },
  overview: {
    coverTitle: "2026 紐西蘭\n自駕房車遊",
    journalTitle: "這趟旅程",
    journalRows: [
      {
        label: "旅行風格",
        text: "賞景打卡風景明信片之旅，節奏偏慢，重點放在每日大景與冬季氣氛。"
      },
      {
        label: "移動方式",
        text: "南島以房車為主，跨島與機場轉移用飛機，路線盡量讓每天都有可拍的代表景點。"
      },
      {
        label: "行前提醒",
        text: "保留地圖、離線導航、營地與景點連結，方便旅伴直接照網站使用。"
      }
    ],
    sectionTitles: {
      tags: "Tag 圖例",
      preTrip: "行前整理",
      requiredCosts: "必須花費",
      extras: "額外活動",
      fieldBudget: "現場花費預估"
    }
  },
  posterStyle: {
    title: "South Island Editorial Poster Style",
    prompt:
      "cinematic New Zealand travel poster, editorial layout, premium magazine cover composition, layered atmosphere, realistic lighting, dramatic clouds, crisp focal landmark, subtle film grain, elegant typography space, rich teal lake tones, alpine depth, warm highlights, high detail, sophisticated travel campaign art, vertical poster composition"
  },
  summary: [
    "這版網站以你提供的 Google Sheet 為主，保留每日行程、航班、花費、備註、外部參考與地圖入口。",
    "每日行程會照原表節奏顯示，並把景點地圖與離線地圖拆成不同分頁。",
    "部分試算表中的超連結只有顯示成「訂票在這」之類的文字；這些我保留成可編輯欄位，方便你後續補上實際網址。"
  ],
  tags: [
    { key: "optional", label: "二選一景點或有時間就去", color: "#f3db7f" },
    { key: "pending", label: "待安排，會影響當日時間的事項", color: "#9fd58a" },
    { key: "split", label: "5人會短暫分開的活動", color: "#96bdf4" }
  ],
  preTrip: [
    {
      title: "證件與駕駛文件",
      items: ["護照", "回程機票", "駕照正本", "駕照翻譯本或國際駕照", "保險文件"]
    },
    {
      title: "房車生活用品",
      items: ["頸枕或護腰", "保暖衣物", "行動電源", "車上每日用品分裝", "可離線使用的導航 App"]
    },
    {
      title: "出發前先下載",
      items: ["Organic Maps 南島區域", "Google Maps 離線區域", "SkyView Lite", "住宿與營地確認資訊"]
    }
  ],
  costs: {
    required: [
      ["IBIS住宿 3人房", "$82"],
      ["IBIS住宿 2人房", "$99"],
      ["基督城 Willowbank Wildlife Reserve", "$36.50"],
      ["基督城 North South Holiday Park 營地", "$26.60"],
      ["提卡波湖 Lakes Edge Holiday Park 營地", "$40"],
      ["庫克山 Glentanner Holiday Park 營地", "$40"],
      ["皇后鎮 Queenstown Holiday Park Creeksyde 營地", "$60"],
      ["皇后鎮 纜車+3次滑車", "$89"],
      ["蒂阿瑙 Lakeview Holiday Park 營地", "$24.40"],
      ["米佛峽灣 郵輪", "$132"],
      ["Milford Sound Lodge 營地", "$60"],
      ["Driftaway Queenstown 營地", "$35"],
      ["Blue Penguins Pukekura", "$65"],
      ["Dunedin Holiday Park 營地", "$26"],
      ["Oamaru Harbour Tourist Park 營地", "$26"],
      ["Tasman Holiday Parks 營地", "$22.80"],
      ["奧克蘭 Anzac Court Motel", "$67.60"]
    ],
    extras: [
      ["庫克山 冰川健行", "$899"],
      ["皇后鎮 泡溫泉", "$117"],
      ["皇后鎮 Ice bar 體驗", "$40"]
    ],
    alreadyPaid: [["Apollo 6人房車", "$568.11 / 人", "總額 $2,840.55"]],
    paidLinks: [
      {
        title: "Line分賬程序",
        label: "開啟 Line 分賬連結",
        url: "https://liff.line.me/1655320992-Y8GowEpw/g/fgmgnbqBe3DsSKHK7mizpm"
      }
    ],
    fieldBudget: [
      ["燃料費 (柴油)", "NZD 980", "$196", "每公升漲至約 $2.95。載重 5 人 2200km 需此預算。"],
      ["柴油稅 (RUC)", "NZD 220", "$44", "以 2,200 公里預估還車時要付的錢。"],
      ["超市食材費", "NZD 1,400", "$280", "平均每天 $100。可以餐餐有肉、有酒、有海鮮。"],
      ["外食 & 咖啡", "NZD 1,000", "$200", "夠吃 2 次正式西餐 + 多次知名漢堡與鹹派。"],
      ["瓦斯/加水/洗衣", "NZD 150", "$30", "寒冬暖氣瓦斯費 + 營地洗衣費。"]
    ],
    fixedSubtotal: "NZD 3,570 / 平均每人 $714",
    flexibleBudget: "NZD 1,060 / 平均每人 $212"
  },
  flights: [
    {
      date: "5/30",
      title: "第一波出發",
      notes: ["蘇 17:15 飛", "sis & mom 18:30 飛", "蘇 21:35 到廣州轉機"]
    },
    {
      date: "5/31",
      title: "抵達奧克蘭",
      notes: ["蘇 00:50 從廣州飛", "sis & mom 09:15 到", "亦＆亞 11:00 飛奧克蘭", "蘇 15:30 到", "亦＆亞 16:10 到"]
    },
    {
      date: "6/1",
      title: "奧克蘭飛基督城",
      notes: ["07:15 飛基督城", "08:40 到", "紐西蘭公假連週末，景點時間需注意"]
    },
    {
      date: "6/12",
      title: "基督城飛奧克蘭",
      notes: ["everyone 12:55 飛", "14:15 抵達奧克蘭"]
    },
    {
      date: "6/13",
      title: "返程",
      notes: ["蘇 09:00 飛", "其他人 09:40 直飛", "我們 17:05 到台灣", "蘇 19:55 飛，00:15 到馬來西亞"]
    }
  ],
  airfare: [
    { traveler: "蘇", detail: "(KUL-CAN-AKL 來回) RM 2735；(AKL-CHC 來回) RM 397" },
    { traveler: "亦＆亞", detail: "(BNE-AKL) AU 704；(AKL-CHC-AKL) AU 121 / 人；(AKL-TPE) AU 1205" }
  ],
  daylight: [
    { month: "May 2026", sunrise: "07:16:59", sunset: "17:37:01", duration: "10h 20m" },
    { month: "June 2026", sunrise: "07:46:33", sunset: "17:09:13", duration: "9h 22m" }
  ],
  onlineNavigation: [
    { name: "Google Maps", description: "即時導航、搜尋景點與路線跳轉。" },
    { name: "Apple Maps", description: "如果用 iPhone，可同步收藏每日景點與營地。" }
  ],
  offlineNavigation: [
    { name: "Organic Maps", description: "推薦做主力離線導航，先下載 South Island 區域。" },
    { name: "MAPS.ME", description: "當備援離線地圖，適合事先收藏景點與停車點。" },
    { name: "Google Maps 離線區域", description: "可先下載 Queenstown、Christchurch、Auckland 等區域作備援。" }
  ],
  itinerary: [
    {
      day: 1,
      date: "5/31",
      title: "Auckland Airport",
      highlight: {
        title: "Auckland Airport Arrival Day",
        imageUrl: "images/days/day-01.png",
        caption: "以機場集合與輕鬆暖身為主，重點是順利接上所有人與把第一晚節奏放慢。",
        prompt:
          "Auckland international airport arrival lounge and runway at golden hour, travelers reuniting with luggage, calm premium travel poster, cinematic editorial composition, polished glass reflections, soft emerald and cream palette, realistic detail, clean negative space for title"
      },
      mode: "休閒",
      route: "以機場集合為主，早到的人可在航廈周邊安排輕鬆活動，晚點一起前往住宿。",
      stay: "建議住宿：Ibis Budget Hotel，走路約 15 分鐘到機場，也有 24 小時接駁巴士（NZD 6 / 人）",
      drive: "機場接駁 / 步行",
      mapFocus: "Auckland Airport, New Zealand",
      offlineSummary: "先把 Auckland Airport、Ibis Budget Hotel、The District、Treasure Island Adventure Golf 存成離線收藏。",
      events: [
        {
          time: "上午",
          title: "第一批抵達奧克蘭機場",
          note: "第一批抵達後先在機場等待其他人集合。",
          mapQuery: "Auckland Airport International Terminal, New Zealand",
          offlineNote: "先存航廈、入境大廳、接駁車站點。"
        },
        {
          time: "上午",
          title: "The District 購物區",
          note: "從國際航廈出發，整個步行環狀行程約 30-35 分鐘，單程約 2.3 公里。可逛 Countdown 與 The Warehouse。",
          mapQuery: "The District, Auckland Airport, New Zealand",
          offlineNote: "離線收藏 The District、Countdown、The Warehouse。"
        },
        {
          time: "上午",
          title: "Treasure Island Adventure Golf",
          note: "海盜主題迷你高爾夫，兩個 18 洞球場，預估 60-90 分鐘。成人票約 NZD 17。",
          cost: "成人約 NZD 17",
          tag: "split",
          mapQuery: "Treasure Island Adventure Golf Auckland Airport New Zealand",
          offlineNote: "可與 The District 一起收藏成步行線。",
          links: [{ label: "官方網站", url: "https://adventuregolf.co.nz/" }]
        },
        {
          time: "上午",
          title: "Jean Batten 的噴火式戰機",
          note: "在國際航廈離境大廳二樓天花板懸掛，可當作機場內小景點。",
          mapQuery: "Auckland Airport International Terminal Departures, New Zealand",
          offlineNote: "若只在機場內活動，可直接標註在航廈備註。"
        },
        {
          time: "上午",
          title: "二樓安靜休息區",
          note: "領完行李後可到二樓離境大廳，通常比一樓接機區更安靜。",
          mapQuery: "Auckland Airport International Terminal, New Zealand",
          offlineNote: "不需獨立存點，放在機場備註即可。"
        },
        {
          time: "下午",
          title: "第二批與第三批抵達",
          note: "大家集合後離開機場前往住宿，接駁巴士運營到 18:00，來得及就搭。",
          mapQuery: "Auckland Airport, New Zealand",
          offlineNote: "若覺得走路累可補記 Uber 上車點。"
        },
        {
          time: "傍晚",
          title: "晚餐 / 必需品採買 / 早休息",
          note: "附近簡單逛，不特別進市區。",
          mapQuery: "Ibis Budget Auckland Airport, New Zealand",
          offlineNote: "把住宿和附近超市一起收藏。"
        }
      ]
    },
    {
      day: 2,
      date: "6/1",
      title: "Auckland Airport → Christchurch",
      highlight: {
        title: "Willowbank Wildlife Reserve",
        imageUrl: "images/days/day-02.png",
        caption: "第二天的大景點先鎖定基督城的 Willowbank Wildlife Reserve，和剛落地南島的輕鬆節奏很搭。",
        prompt:
          "Willowbank Wildlife Reserve in Christchurch, lush pathways, native birds and family-friendly wildlife setting, cinematic eco-travel poster, editorial layout, natural greens, warm afternoon light, realistic animal sanctuary mood, premium tourism campaign style"
      },
      mode: "休閒",
      route: "退房後飛基督城，取房車並完成上路準備，再安排基督城暖身行程。",
      stay: "建議住宿：North South Holiday Park",
      drive: "機場與市區短程",
      mapFocus: "Christchurch Airport, New Zealand",
      offlineSummary: "離線先存 Christchurch Airport、Apollo 取車點、Willowbank、North South Holiday Park、超市。",
      events: [
        {
          time: "上午",
          title: "check out，搭車 / 走路到機場",
          duration: "15 min",
          mapQuery: "Auckland Airport, New Zealand",
          offlineNote: "保留機場與住宿間步行 / 接駁備註。"
        },
        {
          time: "上午",
          title: "搭早上班機前往基督城",
          duration: "2h",
          mapQuery: "Christchurch Airport, New Zealand",
          offlineNote: "將到達航廈與接駁點收藏。"
        },
        {
          time: "上午",
          title: "抵達基督城，取房車",
          note: "預估需要 1 小時左右完成全部程序。要開車的人記得帶駕照正本與翻譯本 / 國際駕照。",
          cost: "Apollo 房車總額 NZD 2,840.55",
          mapQuery: "Apollo Camper Christchurch, New Zealand",
          offlineNote: "把取車點、還車點與最近加油站一起存。"
        },
        {
          time: "上午",
          title: "整理車內與每日用品",
          note: "大家建議先把日常用品與衣物移到車內置物櫃，避免之後一直打開行李箱。",
          mapQuery: "Apollo Camper Christchurch, New Zealand",
          offlineNote: "不需獨立地圖，可掛在取車點備註。"
        },
        {
          time: "下午",
          title: "車子沒問題就開始玩",
          note: "可先參考基督城攻略再決定行程方向。",
          mapQuery: "Christchurch, New Zealand",
          offlineNote: "整個 Christchurch 中心區先下載。 ",
          links: [{ label: "基督城攻略", url: "https://timtingtravel.com/new-zealand-christchurch/" }]
        },
        {
          time: "下午",
          title: "Willowbank Wildlife Reserve",
          cost: "NZD 36.50",
          mapQuery: "Willowbank Wildlife Reserve Christchurch New Zealand",
          offlineNote: "加入回營地前的當天景點收藏。"
        },
        {
          time: "傍晚",
          title: "前往 North South Holiday Park",
          cost: "總額 NZD 133 / 約 NZD 27",
          mapQuery: "North South Holiday Park Christchurch New Zealand",
          offlineNote: "收藏營地、最近超市、dump station。"
        }
      ]
    },
    {
      day: 3,
      date: "6/2",
      title: "Christchurch → Lake Tekapo",
      highlight: {
        title: "Lake Tekapo",
        imageUrl: "images/days/day-03.png",
        caption: "提卡波湖這天的主視覺應該就是湖色、教堂與山線，整天都很適合做成風景主題。",
        prompt:
          "Lake Tekapo turquoise water, Church of the Good Shepherd, distant snowy mountains, cinematic South Island poster, editorial travel campaign, refined composition, dramatic sky, ultra-detailed landscape, elegant negative space for typography"
      },
      mode: "需趕路",
      route: "基督城出發，途中採買與吃鹹派，再往提卡波湖安排景點與觀星。",
      stay: "建議住宿：Lakes Edge Holiday Park",
      drive: "主車程約 3h",
      mapFocus: "Lake Tekapo, New Zealand",
      offlineSummary: "離線先存 Rolleston 超市、Fairlie Bakehouse、Lake Tekapo、教堂、Mt John、營地。",
      events: [
        {
          time: "上午",
          title: "check out，開車前往提卡波湖",
          note: "先看提卡波湖攻略。",
          mapQuery: "Lake Tekapo, New Zealand",
          offlineNote: "提早下載 Tekapo 區域。",
          links: [{ label: "提卡波湖攻略", url: "https://timtingtravel.com/tekapo/" }]
        },
        {
          time: "途中",
          title: "PAK'nSAVE Rolleston 採購",
          note: "下一站提卡波湖只有一間小超市，先在 Rolleston 補足物資。",
          mapQuery: "PAK'nSAVE Rolleston, New Zealand",
          offlineNote: "與加油站一起收藏。"
        },
        {
          time: "途中",
          title: "中途景點參考",
          note: "從 Christchurch 到 Tekapo 的中繼地點可視時間調整。",
          mapQuery: "Canterbury, New Zealand",
          offlineNote: "若要臨時停點，可在這區補加景點。",
          links: [{ label: "路線景點參考", url: "https://timtingtravel.com/tekapo-to-christchurch/" }]
        },
        {
          time: "途中",
          title: "Fairlie Bakehouse",
          note: "本地平民美食鹹派，營業時間 06:00-16:30。",
          mapQuery: "Fairlie Bakehouse New Zealand",
          offlineNote: "若太晚到可做成跳過點。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "Church of the Good Shepherd",
          note: "開放時間 09:00-17:00。",
          duration: "4 min local drive",
          mapQuery: "Church of the Good Shepherd Lake Tekapo New Zealand",
          offlineNote: "收藏停車點與湖邊步行點。"
        },
        {
          time: "下午",
          title: "Mt. John Observatory",
          note: "開放時間 08:00-18:00。",
          duration: "10 min local drive",
          mapQuery: "Mt John Observatory Lake Tekapo New Zealand",
          offlineNote: "收藏觀景點與回營地路線。"
        },
        {
          time: "下午",
          title: "Lake Tekapo Walkway",
          mapQuery: "Lake Tekapo Walkway New Zealand",
          offlineNote: "可與湖邊散步共用。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "High Country Salmon",
          note: "有賣熟食三文魚，08:00-19:00。",
          mapQuery: "High Country Salmon New Zealand",
          offlineNote: "若想補吃的可當順路停靠。",
          tag: "optional"
        },
        {
          time: "晚上",
          title: "Tekapo 湖邊散步與觀星",
          note: "可下載 SkyView Lite，把手機對準天空辨別星座和銀河。",
          mapQuery: "Lake Tekapo, New Zealand",
          offlineNote: "夜間導航請先存回營地路線。"
        },
        {
          time: "傍晚",
          title: "前往 Lakes Edge Holiday Park",
          cost: "總額 NZD 200 / 約 NZD 40",
          mapQuery: "Lakes Edge Holiday Park Lake Tekapo New Zealand",
          offlineNote: "把營地與備用營地一起收藏。"
        }
      ]
    },
    {
      day: 4,
      date: "6/3",
      title: "Lake Tekapo + Mount Cook",
      highlight: {
        title: "Aoraki / Mount Cook",
        imageUrl: "images/days/day-04.png",
        caption: "庫克山這天的重點很明確，就是雪峰、步道與冰河感。",
        prompt:
          "Aoraki Mount Cook towering snowy peak, alpine valley trail and glacier mood, cinematic expedition poster, cool blue and silver palette, bold realistic mountain textures, premium editorial travel art, atmospheric depth, high drama"
      },
      mode: "休閒",
      route: "提卡波湖往返庫克山，主打景觀步道與冰川活動。",
      stay: "建議住宿：Glentanner Holiday Park",
      drive: "Tekapo → Mt Cook 約 1h 15m",
      mapFocus: "Aoraki / Mount Cook National Park, New Zealand",
      offlineSummary: "離線先存 Lake Pukaki、Mt Cook、Hooker Valley、Blue Lakes、Tasman Glacier、Glentanner。",
      events: [
        {
          time: "上午",
          title: "Lake Pukaki Viewpoint",
          duration: "33 min",
          mapQuery: "Lake Pukaki Viewpoint New Zealand",
          offlineNote: "收藏觀景點與停車區。"
        },
        {
          time: "上午",
          title: "開車到庫克山 Mt Cook",
          duration: "1h 15m",
          mapQuery: "Aoraki / Mount Cook National Park, New Zealand",
          offlineNote: "山區訊號不穩，路線務必離線存好。"
        },
        {
          time: "上午",
          title: "冰川健行體驗",
          note: "有買活動配套的話，團體會短暫分開約 3 小時。參與者：亦、亞；未參與者：蘇、姐姐、阿姨。",
          cost: "NZD 899",
          tag: "split",
          mapQuery: "Mount Cook Glacier Hiking New Zealand",
          offlineNote: "活動集合點、停車點與等待區都要先收藏。"
        },
        {
          time: "下午",
          title: "Hooker Valley Track",
          note: "TOP1 步道，來回約 4 小時；第二座橋維修中，原表希望明年 5 月開放。",
          mapQuery: "Hooker Valley Track New Zealand",
          offlineNote: "離線存步道口、停車場、回程點。",
          links: [{ label: "步道參考", url: "https://gowithmarkhazyl.com/aoraki-mount-cook-hooker-valley-track/" }]
        },
        {
          time: "下午",
          title: "Blue Lakes and Tasman Glacier Viewpoint",
          note: "步道來回約 40 分鐘，與塔斯曼湖合併大概 2 小時。原表也提到藍湖已偏綠湖。",
          mapQuery: "Blue Lakes and Tasman Glacier Viewpoint New Zealand",
          offlineNote: "適合做成第二方案收藏。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "Tasman Glacier Lake",
          note: "步道來回約 1 小時。",
          mapQuery: "Tasman Glacier Lake New Zealand",
          offlineNote: "與 Blue Lakes 一起存。 ",
          tag: "optional"
        },
        {
          time: "傍晚",
          title: "Glentanner Holiday Park",
          note: "營地沒有 dump station；最近補給在 Glentanner、Twizel、Tekapo。",
          cost: "總額 NZD 200 / 約 NZD 40",
          mapQuery: "Glentanner Holiday Park New Zealand",
          offlineNote: "一定要連最近 dump station 一起存。"
        }
      ]
    },
    {
      day: 5,
      date: "6/4",
      title: "Mount Cook Highway → Queenstown",
      highlight: {
        title: "Queenstown Arrival",
        imageUrl: "images/days/day-05.png",
        caption: "到皇后鎮的第一天可以用湖景和小鎮到站感做主視覺。",
        prompt:
          "Queenstown arrival scene overlooking Lake Wakatipu and alpine town lights, cinematic travel poster, elegant editorial balance, premium destination campaign, rich lake blues, mountain silhouette, polished realism"
      },
      mode: "需趕路",
      route: "從庫克山區一路南下到皇后鎮，沿途景觀停點視時間安排。",
      stay: "Queenstown Lakeview Holiday Park 或 Queenstown Holiday Park Creeksyde",
      drive: "主車程約 4h",
      mapFocus: "Queenstown, New Zealand",
      offlineSummary: "離線先存 Lindis Pass、Twizel、Queenstown Gardens、Downtown、Lake Wakatipu、住宿候選。",
      events: [
        {
          time: "上午",
          title: "check out，開車到皇后鎮",
          duration: "4h",
          mapQuery: "Queenstown, New Zealand",
          offlineNote: "整段主路線要完整離線。 ",
          links: [{ label: "皇后鎮攻略", url: "https://timtingtravel.com/queenstown/" }]
        },
        {
          time: "途中",
          title: "Lindis Pass + Twizel 小鎮",
          note: "可當景觀停靠點。",
          mapQuery: "Lindis Pass New Zealand",
          offlineNote: "做成可跳過的順路點。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "皇后鎮花園",
          mapQuery: "Queenstown Gardens New Zealand",
          offlineNote: "收藏停車點與步行區。"
        },
        {
          time: "下午",
          title: "Queenstown Downtown",
          mapQuery: "Queenstown Mall New Zealand",
          offlineNote: "市區可能不好停房車，先收藏外圍停車與步行路線。"
        },
        {
          time: "下午",
          title: "Lake Wakatipu",
          mapQuery: "Lake Wakatipu Queenstown New Zealand",
          offlineNote: "湖邊與市區路線一起存。"
        },
        {
          time: "晚上",
          title: "Fergburger / 纜車區域",
          note: "視排隊與體力決定，要不要提早把纜車安排進明天。",
          mapQuery: "Fergburger Queenstown New Zealand",
          offlineNote: "收藏熱門餐點點位。",
          tag: "optional"
        }
      ]
    },
    {
      day: 6,
      date: "6/5",
      title: "Queenstown",
      highlight: {
        title: "Skyline Queenstown",
        imageUrl: "images/days/day-06.png",
        caption: "皇后鎮整天的代表畫面可以直接抓纜車、山景和湖景。",
        prompt:
          "Skyline Queenstown gondola above Lake Wakatipu, sweeping alpine panorama, luxury adventure poster, editorial typography space, cinematic sunset light, dynamic but clean composition, realistic destination advertising style"
      },
      mode: "休閒",
      route: "皇后鎮整天活動，重點在纜車、溫泉、湖邊與夜間體驗。",
      stay: "Queenstown Lakeview Holiday Park 或 Creeksyde；原表後段也有 Driftaway 方案",
      drive: "市區短程",
      mapFocus: "Skyline Queenstown, New Zealand",
      offlineSummary: "離線先存 Skyline、Onsen、Lake Wakatipu、Ice Bar、營地與停車點。",
      events: [
        {
          time: "上午",
          title: "Skyline Gondola",
          note: "看風景為主，可晚一點搭；若想滑車可買套票。",
          cost: "纜車 NZD 66；纜車 + 3 次滑車 NZD 89；+5 次 NZD 96",
          mapQuery: "Skyline Queenstown New Zealand",
          offlineNote: "收藏纜車站、停車點、回市區步行線。",
          links: [{ label: "Skyline 訂票", url: "https://queenstown.skyline.co.nz/book-now/" }]
        },
        {
          time: "下午",
          title: "日式泡溫泉",
          note: "可能有人短暫離隊去泡溫泉；原表寫可搭免費接駁，包含飲品和小吃。",
          cost: "NZD 117",
          tag: "split",
          mapQuery: "Onsen Hot Pools Queenstown New Zealand",
          offlineNote: "收藏接駁集合點與泡溫泉地點。"
        },
        {
          time: "下午",
          title: "Lake Wakatipu",
          note: "若當天想放慢節奏，可把湖邊散步拉長。",
          mapQuery: "Lake Wakatipu Queenstown New Zealand",
          offlineNote: "與市區步行路線一起離線。"
        },
        {
          time: "晚上",
          title: "Ice bar 體驗",
          note: "原表提到市中心至少三間冰吧，時間 12:00-23:00，票種依酒精 / 無酒精不同。",
          cost: "約 NZD 40-50",
          tag: "optional",
          mapQuery: "Ice Bar Queenstown New Zealand",
          offlineNote: "可收藏 2-3 間冰吧做備選。"
        }
      ]
    },
    {
      day: 7,
      date: "6/6",
      title: "Queenstown → Te Anau",
      highlight: {
        title: "Glenorchy / Te Anau Day",
        imageUrl: "images/days/day-07.png",
        caption: "這一天可以用路線感很強的山谷公路或 Glenorchy 風景圖。",
        prompt:
          "Glenorchy road trip through valley and lake edge, cinematic road adventure poster, South Island scenery, editorial composition, wide open road, moody clouds, premium realistic travel campaign, subtle retro print feeling"
      },
      mode: "休閒",
      route: "早上先跑皇后鎮外圍景點，下午再往蒂阿瑙移動。",
      stay: "Te Anau Lakeview Holiday Park & Motels",
      drive: "Queenstown → Te Anau 約 2h",
      mapFocus: "Te Anau, New Zealand",
      offlineSummary: "離線先存 Glenorchy、Moke Lake、Te Anau Downtown、Lake Te Anau、營地。",
      events: [
        {
          time: "上午",
          title: "Glenorchy / Paradise Road",
          duration: "1h",
          note: "皇后鎮外圍美景線。",
          mapQuery: "Glenorchy New Zealand",
          offlineNote: "山路路線要先離線。",
          tag: "optional",
          links: [{ label: "Glenorchy 參考", url: "https://timtingtravel.com/nz-glenorchy/" }]
        },
        {
          time: "上午",
          title: "動物農場",
          note: "營業時間 10:00-16:00，週一二休。",
          cost: "NZD 25",
          mapQuery: "Animal Farm Queenstown New Zealand",
          offlineNote: "做成可跳過點。",
          tag: "optional"
        },
        {
          time: "上午",
          title: "Moke Lake",
          note: "原表寫 lim 想去美的地方看。",
          mapQuery: "Moke Lake Queenstown New Zealand",
          offlineNote: "收藏停車與湖邊點。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "前往蒂阿瑙",
          duration: "2h",
          note: "中途可看 Te Anau 路線參考。",
          mapQuery: "Te Anau New Zealand",
          offlineNote: "全段離線。",
          links: [{ label: "Te Anau 攻略", url: "https://timtingtravel.com/te-anau/" }]
        },
        {
          time: "下午",
          title: "Te Anau Downtown",
          mapQuery: "Te Anau Town Centre New Zealand",
          offlineNote: "存晚餐、超市、湖邊。"
        },
        {
          time: "下午",
          title: "Lake Te Anau",
          mapQuery: "Lake Te Anau New Zealand",
          offlineNote: "與市區步行線一起收藏。"
        },
        {
          time: "晚上",
          title: "Ristorante Pizzeria Paradiso",
          note: "義式料理，約 NZD 20-35。",
          mapQuery: "Ristorante Pizzeria Paradiso Te Anau New Zealand",
          offlineNote: "收藏餐廳與回營地路線。",
          tag: "optional"
        }
      ]
    },
    {
      day: 8,
      date: "6/7",
      title: "Milford Sound",
      highlight: {
        title: "Milford Sound",
        imageUrl: "images/days/day-08.png",
        caption: "米佛峽灣這天非常適合做成全景海峽主視覺。",
        prompt:
          "Milford Sound fjord with sheer cliffs, mist, dark water and dramatic clouds, iconic New Zealand travel poster, cinematic realism, luxury expedition campaign, deep emerald and slate palette, vast atmospheric scale"
      },
      mode: "休閒",
      route: "從蒂阿瑙前往米佛峽灣，主行程是遊船與峽灣周邊短步道。",
      stay: "Milford Sound Lodge Campervan Park",
      drive: "Te Anau → Milford Sound 約 2h 30m",
      mapFocus: "Milford Sound / Piopiotahi, New Zealand",
      offlineSummary: "離線要存整段峽灣道路、停車場、碼頭、Breakwater Walkway、Foreshore Walk、Lookout Track、營地。",
      events: [
        {
          time: "上午",
          title: "開車到 Milford Sound",
          duration: "2h 30m",
          note: "原表提到若需要調整皇后鎮天數，也可以改考慮巴士＋船票方案。",
          cost: "巴士 + 船票參考 NZD 277 / 人",
          mapQuery: "Milford Sound New Zealand",
          offlineNote: "這段山路務必要全離線。"
        },
        {
          time: "上午",
          title: "Pure Milford 渡輪",
          duration: "2h 海上行駛",
          cost: "表內另列 NZD 159 / 人版本",
          note: "比較近的停車場需付費且位子少，第二個免費停車場步行約 30 分鐘。",
          mapQuery: "Milford Sound Cruise Terminal New Zealand",
          offlineNote: "連停車場一起收藏。",
          links: [{ label: "米佛峽灣參考", url: "https://timtingtravel.com/milford-sound-must-do/" }]
        },
        {
          time: "中午",
          title: "Breakwater Walkway",
          note: "等船或下船後可花約 10 分鐘走走。",
          mapQuery: "Milford Sound Breakwater Walkway New Zealand",
          offlineNote: "做成碼頭旁短步行收藏。",
          tag: "optional"
        },
        {
          time: "中午",
          title: "Milford Foreshore Walk",
          note: "從主停車場旁出發，可走到森林與沙灘。",
          mapQuery: "Milford Foreshore Walk New Zealand",
          offlineNote: "若時間不夠可直接保留停車場和 lookout。",
          tag: "optional"
        },
        {
          time: "中午",
          title: "Milford Sound Lookout Track",
          note: "來回約 20-30 分鐘，步道不難。",
          mapQuery: "Milford Sound Lookout Track New Zealand",
          offlineNote: "和 Foreshore Walk 做同組收藏。",
          tag: "optional"
        },
        {
          time: "晚上",
          title: "Milford Sound Lodge Campervan Park",
          note: "原表提醒位置有限，需提早兩個月訂。",
          cost: "約 NZD 300 / 晚，約 NZD 60 / 人",
          mapQuery: "Milford Sound Lodge Campervan Park New Zealand",
          offlineNote: "營地和回碼頭路線都要留著。"
        }
      ]
    },
    {
      day: 9,
      date: "6/8",
      title: "Milford Sound → Queenstown",
      highlight: {
        title: "Queenstown Flex Day",
        imageUrl: "images/days/day-09.png",
        caption: "回皇后鎮的彈性日可以放半日步道或湖邊風景圖。",
        prompt:
          "Queenstown flex day on peninsula trail with lake and mountains, cinematic slow-travel poster, editorial travel magazine style, soft adventure mood, realistic hiker scale, airy premium composition"
      },
      mode: "休閒",
      route: "回皇后鎮，這天保留彈性把還沒完成的活動補上。",
      stay: "Driftaway Queenstown",
      drive: "回皇后鎮約 4h",
      mapFocus: "Queenstown, New Zealand",
      offlineSummary: "離線先存 Kelvin Peninsula、Bennetts Bluff、Seven Mile Point、Driftaway Queenstown、採購點。",
      events: [
        {
          time: "上午",
          title: "check out，開車回皇后鎮",
          duration: "4h",
          mapQuery: "Queenstown New Zealand",
          offlineNote: "回程山路仍要整段離線。"
        },
        {
          time: "下午",
          title: "Kelvin Peninsula",
          mapQuery: "Kelvin Peninsula Queenstown New Zealand",
          offlineNote: "收藏停車點與步道點。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "Bennetts Bluff Viewpoint",
          note: "停車後步行約 10 分鐘。",
          mapQuery: "Bennetts Bluff Viewpoint New Zealand",
          offlineNote: "適合做路上順停點。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "Seven Mile Point Track",
          mapQuery: "Seven Mile Point Track Queenstown New Zealand",
          offlineNote: "可視時間刪減。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "逛城鎮 / 採購 / 補做前幾天沒完成的活動",
          tag: "pending",
          mapQuery: "Queenstown New Zealand",
          offlineNote: "把想補做的景點另加到這一天即可。"
        },
        {
          time: "晚上",
          title: "Driftaway Queenstown",
          cost: "總額 NZD 176 / 約 NZD 35",
          mapQuery: "Driftaway Queenstown New Zealand",
          offlineNote: "收藏營地與市區往返。"
        }
      ]
    },
    {
      day: 10,
      date: "6/9",
      title: "Queenstown → Dunedin",
      highlight: {
        title: "Dunedin City & Blue Penguins",
        imageUrl: "images/days/day-10.png",
        caption: "但尼丁這天的視覺可以走城市建築感或企鵝主題。",
        prompt:
          "Dunedin historic station and coastal wildlife mood, cinematic city-meets-nature poster, Victorian architecture, cool coastal light, premium editorial layout, realistic New Zealand heritage travel campaign"
      },
      mode: "需趕路",
      route: "長距離轉場到但尼丁，市區景點以集中式散步為主。",
      stay: "Dunedin Holiday Park & Motels",
      drive: "約 3h 30m",
      mapFocus: "Dunedin, New Zealand",
      offlineSummary: "離線先存 Kawarau Bungy、Downtown、First Church、Octagon、Railway Station、Baldwin Street、Tunnel Beach、Blue Penguins、營地。",
      events: [
        {
          time: "上午",
          title: "check out，開車到但尼丁",
          duration: "3h 30m",
          mapQuery: "Dunedin New Zealand",
          offlineNote: "主轉場整段離線。"
        },
        {
          time: "途中",
          title: "Kawarau Bungy Centre",
          note: "可參觀橋和看別人高空彈跳。",
          mapQuery: "Kawarau Bungy Centre New Zealand",
          offlineNote: "做成順路停點。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "Dunedin Downtown",
          note: "熱門景點大多集中在市區，時間不夠可先從這裡開始。",
          mapQuery: "Dunedin City Centre New Zealand",
          offlineNote: "下載整個市中心步行區。",
          links: [{ label: "但尼丁參考", url: "https://timtingtravel.com/dunedin/#t-1705337251507" }]
        },
        {
          time: "下午",
          title: "First Church of Otago",
          note: "8:00-13:00，週六不營業；原表認為應該來不及，看外觀即可。",
          mapQuery: "First Church of Otago Dunedin New Zealand",
          offlineNote: "與市中心步行線一起收藏。"
        },
        {
          time: "下午",
          title: "The Octagon / Dunedin Railway Station",
          note: "火車站就在八角廣場附近，可一起排。",
          mapQuery: "The Octagon Dunedin New Zealand",
          offlineNote: "同一組市中心收藏。"
        },
        {
          time: "下午",
          title: "Baldwin Street",
          note: "世界最陡街道，可當市區外圍加點。",
          mapQuery: "Baldwin Street Dunedin New Zealand",
          offlineNote: "需另存停車與返程路線。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "Tunnel Beach",
          note: "從停車場走到海灘約 20 分鐘，還要穿過窄隧道。",
          mapQuery: "Tunnel Beach Dunedin New Zealand",
          offlineNote: "海邊訊號不一定穩，返程路線要先存。",
          tag: "optional"
        },
        {
          time: "晚上",
          title: "Blue Penguins Pukekura",
          note: "可拍攝但不能開閃光，小藍企鵝歸巢點。",
          cost: "NZD 65",
          mapQuery: "Blue Penguins Pukekura New Zealand",
          offlineNote: "夜間往返路線一定要先離線。",
          links: [{ label: "官方網站", url: "http://bluepenguins.co.nz/" }]
        },
        {
          time: "晚上",
          title: "Dunedin Holiday Park & Motels",
          cost: "總額 NZD 128 / 約 NZD 26",
          mapQuery: "Dunedin Holiday Park and Motels New Zealand",
          offlineNote: "收藏營地與加油站。"
        }
      ]
    },
    {
      day: 11,
      date: "6/10",
      title: "Dunedin → Oamaru",
      highlight: {
        title: "Oamaru",
        imageUrl: "images/days/day-11.png",
        caption: "Oamaru 很適合用海邊、白石街區或企鵝觀察點做大圖。",
        prompt:
          "Oamaru limestone heritage street meeting wild coastline, elegant New Zealand coastal poster, editorial composition, nostalgic light, premium realistic tourism art, soft sea mist and stone textures"
      },
      mode: "休閒",
      route: "往 Oamaru 白石小鎮移動，下午卡企鵝與海灘時段。",
      stay: "Oamaru Harbour Tourist Park",
      drive: "約 1h 30m",
      mapFocus: "Oamaru, New Zealand",
      offlineSummary: "離線先存 Victorian Precinct、Friendly Bay、Bushy Beach、營地。",
      events: [
        {
          time: "上午",
          title: "check out，開車到 Oamaru",
          duration: "1h 30m",
          note: "原表寫有機會看到免費企鵝。",
          mapQuery: "Oamaru New Zealand",
          offlineNote: "主路線離線。"
        },
        {
          time: "上午",
          title: "Victorian Precinct",
          note: "維多利亞風白石小鎮核心區。",
          mapQuery: "Oamaru Victorian Precinct New Zealand",
          offlineNote: "先下載市區區域。",
          links: [{ label: "Oamaru 參考", url: "https://timtingtravel.com/oamaru/" }]
        },
        {
          time: "下午",
          title: "Friendly Bay 一帶",
          note: "夕陽後 2 小時左右有機會看到野生小藍企鵝。",
          mapQuery: "Friendly Bay Oamaru New Zealand",
          offlineNote: "夜間步行與回營地路線先存。",
          links: [{ label: "觀察參考", url: "https://lillian.tw/omaru/" }]
        },
        {
          time: "下午",
          title: "Bushy Beach Scenic Reserve",
          note: "通常於太陽下山前 2 小時前往，若運氣不好沒看到企鵝，也常看到海獅。",
          mapQuery: "Bushy Beach Scenic Reserve Oamaru New Zealand",
          offlineNote: "海邊返程路線一定要先離線。",
          tag: "optional"
        },
        {
          time: "傍晚",
          title: "Oamaru Harbour Tourist Park",
          note: "原表寫需自己聯絡才知道價格，估計約 NZD 120 左右。",
          mapQuery: "Oamaru Harbour Tourist Park New Zealand",
          offlineNote: "收藏營地與企鵝觀察點。"
        }
      ]
    },
    {
      day: 12,
      date: "6/11",
      title: "Oamaru → Christchurch",
      highlight: {
        title: "Christchurch City Day",
        imageUrl: "images/days/day-12.png",
        caption: "基督城回合可用植物園、復古電車或河濱市場當主視覺。",
        prompt:
          "Christchurch tram passing through city center with gardens and riverside vibe, polished editorial travel poster, cinematic daylight, realistic urban charm, premium tourism campaign art, balanced typography space"
      },
      mode: "需趕路",
      route: "一路北返基督城，把 6/1 來不及的景點補上。",
      stay: "Tasman Holiday Parks – Christchurch",
      drive: "約 3h",
      mapFocus: "Christchurch, New Zealand",
      offlineSummary: "離線先存 Christchurch Botanic Garden、紙教堂、Tramway、Riverside Market、Bridge of Remembrance、超市、營地。",
      events: [
        {
          time: "上午",
          title: "check out，開車前往基督城",
          duration: "3h",
          mapQuery: "Christchurch New Zealand",
          offlineNote: "北返主線離線。"
        },
        {
          time: "上午",
          title: "補 6/1 來不及去的景點",
          tag: "pending",
          mapQuery: "Christchurch New Zealand",
          offlineNote: "之後可自行在編輯器補進來。"
        },
        {
          time: "下午",
          title: "Christchurch Botanic Garden",
          note: "開放時間 07:00-18:30。",
          mapQuery: "Christchurch Botanic Gardens New Zealand",
          offlineNote: "收藏停車與步行線。"
        },
        {
          time: "下午",
          title: "Christchurch Transitional Cathedral",
          note: "週一至週六 09:00-16:00。",
          mapQuery: "Christchurch Transitional Cathedral New Zealand",
          offlineNote: "與市中心景點一起存。"
        },
        {
          time: "下午",
          title: "Christchurch Tramway",
          note: "08:30-18:00，可自由上下車。",
          cost: "NZD 42.85",
          mapQuery: "Christchurch Tramway New Zealand",
          offlineNote: "將搭車站點收藏。",
          tag: "optional"
        },
        {
          time: "下午",
          title: "Riverside Market",
          note: "週一至三 07:30-18:00；週四至六 07:30-21:00；週日 07:30-17:00。",
          mapQuery: "Riverside Market Christchurch New Zealand",
          offlineNote: "適合晚餐與採購收藏。"
        },
        {
          time: "下午",
          title: "Bridge of Remembrance",
          note: "全天候開放，在 Riverside Market 附近可一起排。",
          mapQuery: "Bridge of Remembrance Christchurch New Zealand",
          offlineNote: "與 Riverside 放在同一組。"
        },
        {
          time: "傍晚",
          title: "超市採購 + Tasman Holiday Parks",
          note: "大型超市營業時間通常 07:00-21:00。",
          cost: "總額 NZD 114 / 約 NZD 22.8",
          mapQuery: "Tasman Holiday Parks Christchurch New Zealand",
          offlineNote: "把超市和營地一起存。"
        }
      ]
    },
    {
      day: 13,
      date: "6/12",
      title: "Christchurch → Auckland",
      highlight: {
        title: "Return to Auckland",
        imageUrl: "images/days/day-13.png",
        caption: "回到奧克蘭這天適合用城市夜景或機場轉場的收尾感。",
        prompt:
          "Auckland skyline and airport return mood, cinematic city travel poster, polished evening glow, premium editorial composition, realistic urban New Zealand atmosphere, elegant campaign finish"
      },
      mode: "休閒",
      route: "還車、飛回奧克蘭，住宿與路線依最後選項決定。",
      stay: "Auckland City Hotel 或機場附近住宿",
      drive: "依最終住宿而定",
      mapFocus: "Auckland, New Zealand",
      offlineSummary: "離線先存還車點、基督城機場、奧克蘭機場、Auckland City Hotel、SkyCity、機場附近住宿。",
      events: [
        {
          time: "上午",
          title: "check out，開回基督城還車",
          note: "還車後再前往機場，之後才吃正餐 / 外帶。",
          mapQuery: "Apollo Camper Christchurch, New Zealand",
          offlineNote: "收藏還車點與機場接駁。"
        },
        {
          time: "下午",
          title: "方案 1：兩趟航班 + 住機場附近",
          note: "一定要選下午班機，3-4 點起飛較安全。",
          tag: "pending",
          mapQuery: "Auckland Airport New Zealand",
          offlineNote: "若採這方案，存機場周邊住宿。"
        },
        {
          time: "下午",
          title: "方案 2：6/11 住 Timaru，降低 6/12 早起風險",
          note: "保留 Wanaka / Queenstown 行程不變，6/11 經過 Oamaru 半日遊再往北。",
          tag: "pending",
          mapQuery: "Timaru New Zealand",
          offlineNote: "若採這方案，另外加 Timaru 營地。"
        },
        {
          time: "下午",
          title: "方案 3：AB 點還車",
          note: "最貴但時間最寬裕，可以多住最南端小鎮並再回皇后鎮住 2 晚。",
          tag: "pending",
          mapQuery: "Queenstown Airport New Zealand",
          offlineNote: "若採這方案，要重改前面幾天離線點。"
        },
        {
          time: "下午",
          title: "飛回奧克蘭機場",
          duration: "2h",
          mapQuery: "Auckland Airport New Zealand",
          offlineNote: "把抵達後住宿方案分開收藏。",
          links: [{ label: "奧克蘭參考", url: "https://timtingtravel.com/new-zealand-auckland/" }]
        },
        {
          time: "晚上",
          title: "Auckland City Hotel / 機場附近住宿",
          note: "原表寫 Auckland City Hotel 可走到 SkyCity 搭 skybus。",
          mapQuery: "Auckland City Hotel New Zealand",
          offlineNote: "若改住機場附近，直接在編輯器換 mapQuery 即可。"
        }
      ]
    },
    {
      day: 14,
      date: "6/13",
      title: "Auckland → 回家",
      highlight: {
        title: "Departure Day",
        imageUrl: "images/days/day-14.png",
        caption: "最後一天可以用簡潔的離境與返程畫面做結尾。",
        prompt:
          "international departure gate scene with runway light and quiet farewell mood, minimalist cinematic travel poster, realistic airport atmosphere, soft teal and gold palette, elegant ending composition"
      },
      mode: "返程",
      route: "奧克蘭整理後前往機場，分別飛回台灣與馬來西亞。",
      stay: "返程日",
      drive: "機場接駁",
      mapFocus: "Auckland Airport, New Zealand",
      offlineSummary: "保留 Auckland Airport、SkyCity、行李寄放點、eSIM 購買點等收藏。",
      events: [
        {
          time: "上午",
          title: "check out",
          mapQuery: "Auckland, New Zealand",
          offlineNote: "保留住宿到機場的接駁或叫車點。"
        },
        {
          time: "上午",
          title: "搭車前往奧克蘭機場",
          mapQuery: "Auckland Airport New Zealand",
          offlineNote: "收藏航廈與報到區。"
        },
        {
          time: "上午",
          title: "你們先飛回台灣",
          mapQuery: "Auckland Airport International Terminal, New Zealand",
          offlineNote: "此段主要是航班提醒。"
        },
        {
          time: "下午",
          title: "我飛回馬來西亞",
          mapQuery: "Auckland Airport International Terminal, New Zealand",
          offlineNote: "此段主要是航班提醒。"
        },
        {
          time: "補充",
          title: "Auckland 市區行李寄放",
          note: "原表寫市區行李存放點約 USD 7.95 / 天，優惠碼 KDDI2025 可折 15%，有效到 2026/12/31。",
          mapQuery: "SkyCity Auckland New Zealand",
          offlineNote: "若最後一天還會進市區，收藏 SkyCity 一帶。",
          tag: "optional"
        },
        {
          time: "補充",
          title: "eSIM / 網路卡",
          note: "原表保留了只有網路與網路+通話兩種購買位置，網址之後可自行補進來。",
          mapQuery: "Auckland Airport New Zealand",
          offlineNote: "不需地圖時可改成備註型內容。",
          tag: "optional",
          links: [{ label: "待補：只有網路購買連結", url: "" }, { label: "待補：網路+通話購買連結", url: "" }]
        }
      ]
    }
  ]
};
