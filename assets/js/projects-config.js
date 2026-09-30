/* Public presentation settings only. Never put secrets here.
 * liveDemo means this project supports an interactive web demo, NOT that it is deployed.
 * To activate: supply a reviewed HTTPS demoUrl AND set demoAvailability to "available".
 * Availability: "pending", "available", "maintenance", "reference".
 * Embeds require separate approval/compatibility review; all are disabled by default.
 */
window.PROJECTS_CONFIG = {
  "demandPlanning": {
    "name": "Demand Planning & Inventory Optimization Portal",
    "demoUrl": "https://demand-planning-analytics.streamlit.app",
    "githubUrl": "https://github.com/ashaw2y1/demand-planning-analytics",
    "liveDemo": true,
    "demoAvailability": "available",
    "technology": [
      "Python",
      "Streamlit",
      "Pandas"
    ],
    "projectType": "streamlit",
    "embedEnabled": false,
    "embedUrl": ""
  },
  "digitalPR": {
    "name": "Digital Purchase Request Tracking Portal",
    "demoUrl": "https://digital-purchase-request-tracker.onrender.com/",
    "githubUrl": "https://github.com/ashaw2y1/digital-purchase-request-tracker",
    "liveDemo": true,
    "demoAvailability": "available",
    "technology": [
      "Python",
      "Flask",
      "Workflow Automation",
      "Procurement Analytics",
      "Business Intelligence",
      "Analytics Engineering"
    ],
    "projectType": "flask",
    "embedEnabled": false,
    "embedUrl": ""
  },
  "noiPortal": {
    "name": "Supplier Benefits & Procurement Reconciliation Analytics",
    "demoUrl": "https://supplier-benefits-analytics.onrender.com",
    "githubUrl": "https://github.com/ashaw2y1/supplier-benefits-analytics",
    "liveDemo": true,
    "demoAvailability": "available",
    "technology": [
      "Python",
      "Flask",
      "Pandas",
      "SQLite",
      "Analytics Engineering",
      "Procurement Analytics"
    ],
    "projectType": "flask",
    "embedEnabled": false,
    "embedUrl": ""
  },
  "cogsPipeline": {
    "name": "COGS Data Pipeline & Analytics ETL",
    "demoUrl": "",
    "githubUrl": "",
    "liveDemo": false,
    "demoAvailability": "reference",
    "technology": [
      "Python",
      "SQL",
      "ETL / ELT"
    ],
    "projectType": "batch",
    "embedEnabled": false,
    "embedUrl": ""
  }
};
