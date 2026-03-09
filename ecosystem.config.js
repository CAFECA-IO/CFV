module.exports = {
  apps: [
    {
      name: "CFV",
      script: "npm",
      args: "start"
    },
    {
      name: "Crawler",
      script: "npm",
      args: "run crawler"
    },
    {
      name: "SEOBot",
      script: "npm",
      args: "run seo"
    },
    {
      name: "RECHARGE",
      script: "npm",
      args: "run recharge",
      cron_restart: "0 3 * * 1",
      autorestart: false
    },
    {
      name: "CAFECA",
      script: "npm",
      args: "run cafeca",
      cron_restart: "0 */4 * * *",
      autorestart: false
    }
  ]
}