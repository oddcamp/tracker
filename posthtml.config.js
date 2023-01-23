require(`dotenv`).config({ path: `.env` })

module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        plausible_domain: process.env.PLAUSIBLE_DOMAIN,
        ahoy_script_url: process.env.AHOY_SCRIPT_URL,
      },
    },
  },
}
