export const msmeSources = [
  { title: "Ministry of MSME Annual Report 2022-23", url: "https://dcmsme.gov.in/MSMEANNUALREPORT2022-23ENGLISH.pdf" },
  { title: "PIB: Year End Review 2024 - Ministry of MSME", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2089308&lang=2&reg=3" },
  { title: "MSME Dashboard / Udyam Statewise", url: "https://dashboard.msme.gov.in/Udyam_Statewise.aspx" },
  { title: "IBEF MSME Industry Overview", url: "https://www.ibef.org/industry/msme" },
  { title: "RAMP state Strategic Investment Plans", url: "https://ramp.msme.gov.in/" },
];

export const msmeSectors = [
  { id: "trading", name: "Trading", registrations: 37109527, sharePercent: 42.35, source: "MSME Dashboard, activity-wise registrations as on 23 Jun 2026" },
  { id: "services", name: "Services", registrations: 32750904, sharePercent: 37.38, source: "MSME Dashboard, activity-wise registrations as on 23 Jun 2026" },
  { id: "manufacturing", name: "Manufacturing", registrations: 17768161, sharePercent: 20.27, source: "MSME Dashboard, activity-wise registrations as on 23 Jun 2026" },
];

export const stateMsmeDistribution = [
  { state: "Maharashtra", registeredMsmes: 7644004, region: "West", source: "MSME Dashboard state-wise registrations" },
  { state: "Uttar Pradesh", registeredMsmes: 5315943, region: "North", source: "MSME Dashboard state-wise registrations" },
  { state: "Gujarat", registeredMsmes: 4798254, region: "West", source: "MSME Dashboard state-wise registrations" },
  { state: "West Bengal", registeredMsmes: 5879825, region: "East", source: "MSME Dashboard state-wise registrations" },
  { state: "Karnataka", registeredMsmes: 2724801, region: "South", source: "MSME Dashboard state-wise registrations" },
  { state: "Madhya Pradesh", registeredMsmes: 2540556, region: "Central", source: "MSME Dashboard state-wise registrations" },
  { state: "Kerala", registeredMsmes: 1156875, region: "South", source: "MSME Dashboard state-wise registrations" },
  { state: "Uttarakhand", registeredMsmes: 478815, region: "North", source: "MSME Dashboard state-wise registrations" },
];

export const industryClusters = [
  { id: "tiruppur-knitwear", cluster: "Tiruppur knitwear", state: "Tamil Nadu", specialization: "Cotton knitwear and apparel exports", enterprises: "Apparel MSME cluster", exportReady: true },
  { id: "morbi-ceramics", cluster: "Morbi ceramics", state: "Gujarat", specialization: "Ceramic tiles and sanitaryware", enterprises: "Ceramics manufacturing cluster", exportReady: true },
  { id: "rajkot-engineering", cluster: "Rajkot engineering", state: "Gujarat", specialization: "Machine tools, diesel engines and casting", enterprises: "Engineering MSME cluster", exportReady: true },
  { id: "ludhiana-bicycle", cluster: "Ludhiana bicycle and auto components", state: "Punjab", specialization: "Bicycles, parts and light engineering", enterprises: "Light engineering cluster", exportReady: true },
  { id: "agra-footwear", cluster: "Agra footwear", state: "Uttar Pradesh", specialization: "Leather footwear and accessories", enterprises: "Footwear MSME cluster", exportReady: true },
  { id: "coimbatore-pumps", cluster: "Coimbatore pumps and foundry", state: "Tamil Nadu", specialization: "Pumps, motors, wet grinders and castings", enterprises: "Engineering manufacturing cluster", exportReady: true },
];

export const governmentSchemes = [
  { id: "ramp", name: "Raising and Accelerating MSME Performance (RAMP)", focus: "Institutional strengthening, market access and firm capabilities", agency: "Ministry of MSME" },
  { id: "pm-vishwakarma", name: "PM Vishwakarma", focus: "Credit, toolkit support and skilling for traditional artisans", agency: "Government of India" },
  { id: "cgtmse", name: "Credit Guarantee Fund Trust for Micro and Small Enterprises", focus: "Collateral-free credit guarantee for MSE lending", agency: "Ministry of MSME and SIDBI" },
  { id: "pmegp", name: "Prime Minister's Employment Generation Programme", focus: "Credit-linked subsidy for new micro enterprises", agency: "KVIC / Ministry of MSME" },
  { id: "zedscheme", name: "MSME Sustainable (ZED) Certification", focus: "Zero Defect Zero Effect quality and sustainability adoption", agency: "Ministry of MSME" },
];

export const exportOpportunities = [
  { id: "engineering-goods", product: "Engineering goods", markets: ["United States", "UAE", "Germany"], opportunity: "Precision components, machine parts and fabricated products" },
  { id: "textiles-apparel", product: "Textiles and apparel", markets: ["United States", "EU", "UK"], opportunity: "Cotton apparel, technical textiles and sustainable fashion" },
  { id: "leather-footwear", product: "Leather and footwear", markets: ["EU", "United States", "Middle East"], opportunity: "Finished leather goods and footwear supply chains" },
  { id: "food-processing", product: "Processed foods", markets: ["Middle East", "Southeast Asia", "United States"], opportunity: "Ready-to-eat, spices, millets and specialty foods" },
  { id: "auto-components", product: "Auto components", markets: ["EU", "United States", "Japan"], opportunity: "Aftermarket spares, EV parts and precision assemblies" },
];

export const industryReports = [
  { id: "msme-annual-2022-23", title: "MSME Annual Report 2022-23", publisher: "Ministry of MSME", year: 2023, collection: "industry_reports" },
  { id: "year-end-review-2024", title: "Year End Review 2024: Ministry of MSME", publisher: "Press Information Bureau", year: 2024, collection: "industry_reports" },
  { id: "msme-industry-overview", title: "MSME Industry Overview", publisher: "IBEF", year: 2026, collection: "industry_reports" },
];

export const marketInsights = [
  { id: "formalization", insight: "Udyam and Udyam Assist are expanding formal MSME visibility for credit and procurement access.", metric: "8.76 crore registrations on MSME Dashboard as of 23 Jun 2026" },
  { id: "employment", insight: "MSME employment is broadly balanced across trade, manufacturing and services.", metric: "Trading 3.71 crore, services 3.28 crore, manufacturing 1.78 crore registrations" },
  { id: "budget", insight: "Central MSME budget support has grown with emphasis on formalization, credit and competitiveness.", metric: "₹23,168 crore FY26 allocation reported by IBEF" },
];

export const technologyTrends = [
  { id: "zed", trend: "ZED quality and sustainability", adoptionArea: "Quality systems, waste reduction and energy efficiency", maturity: 72 },
  { id: "ecommerce", trend: "E-commerce onboarding", adoptionArea: "Digital catalogs, marketplace exports and D2C channels", maturity: 68 },
  { id: "cloud-erp", trend: "Cloud ERP and GST-linked workflows", adoptionArea: "Inventory, invoicing, compliance and costing", maturity: 61 },
  { id: "iot-maintenance", trend: "IoT-based maintenance", adoptionArea: "Predictive monitoring for motors, pumps and compressors", maturity: 44 },
  { id: "ai-inspection", trend: "AI visual inspection", adoptionArea: "Defect detection in textiles, foundries and components", maturity: 38 },
];
