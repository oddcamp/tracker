require(`dotenv`).config({ path: `.env` })

module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: { plausible_domain: process.env.PLAUSIBLE_DOMAIN },
    },
  },
}
