const axios = require("axios");
const cron = require("node-cron");
const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");
const config = require("../config/config.json");
const dataFile = path.join(__dirname, "../data/data.json");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(config.discordWebhookUrl);
const WebhookUrl = config.discordWebhookUrl;
const siteUrl = config.siteUrl;
const interval = config.interval;
let intervalTime = config.intervalTime;
const mention = config.mention;


console.log("     _   _ _     _             ");
console.log("    | \\ | (_)   | |            ");
console.log("    |  \\| |_ ___| |_ _ __ ___  ");
console.log("    | . ` | / __| __| '__/ _ \\ ");
console.log("    | |\\  | \\__ \\ |_| | | (_) |");
console.log("    \\_| \\_/_|___/\\__|_|  \\___/ ");
console.log("                               ");
console.log("Contact on Discord: nistro.   ");
console.log("                               ");
console.log("                               ");
console.log("                               ");
console.log("                               ");

async function checkInformations() {
  try {
    let response = await axios.get(siteUrl);

    if (response.status === 200) {
      let html = response.data;
      let $ = cheerio.load(html);

      let span = $("span.L5ErLT");
      let prices = [];

      span.each((i, el) => {
        prices.push(parseFloat($(el).text().replace("€", "")));
      });

      let lowestPrice = Math.min(...prices);
      let price = lowestPrice;

      let data = {
        price: price,
        date: new Date(),
      };

      if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, "[]");
      }

      if (fs.existsSync(dataFile) && fs.readFileSync(dataFile) === "") {
        fs.writeFileSync(dataFile, "[]");
      }

      if (
        fs.existsSync(dataFile) &&
        fs.readFileSync(dataFile).toString().charAt(0) !== "["
      ) {
        fs.writeFileSync(dataFile, "[]");
      }

      let dataJson = JSON.parse(fs.readFileSync(dataFile));
      let lowestPriceJson = Math.min(...dataJson.map((item) => item.price));
      if (lowestPriceJson === Infinity) {
        lowestPriceJson = 0;
      }

      let price2 = price + 1.5;
      let lowestPriceJson2 = lowestPriceJson + 1.5;

      if (price < lowestPriceJson && price !== lowestPriceJson) {
        let hook = new Webhook(WebhookUrl);
        let embed = new MessageBuilder()
          .setTitle("Nouveau prix le plus bas !")
          .setDescription(
            "```" +
              "Nouveau prix le plus bas !\n" +
              "```" +
              "```" +
              price2 +
              "€" +
              "```" +
              "\n" +
              "```" +
              "Ancien prix le plus bas " +
              "```" +
              "```" +
              lowestPriceJson2 +
              "€ \n" +
              "```" +
              "```" +
              "Le " +
              convertDateToFrench(
                dataJson.find((item) => item.price === lowestPriceJson).date
              ) +
              "\n" +
              "```"
          )
          .setColor("#00ff00")
          .setTimestamp()
          .setFooter("Nistro - EnebaVerify");
        hook.send(mention);
        hook.send(embed);
      } else {
        let hook = new Webhook(WebhookUrl);
        let embed = new MessageBuilder()
          .setTitle("Aucun nouveau prix le plus bas !")
          .setDescription(
            "```" +
              "Prix aujourd'hui " +
              "```" +
                "```" +
                price2 +
                "€" +
                "```"
          )
          .setColor("#ff0000")
          .setTimestamp()
          .setFooter("Nistro - EnebaVerify");
        hook.send(embed);
      }

      if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, "[]");
      }

        let priceExist = dataJson.find((item) => item.price === price);
        if (priceExist) {
          return;
        }

      fs.readFile(dataFile, function (err, content) {
        if (err) throw err;
        let parseJson = JSON.parse(content);
        parseJson.push(data);
        fs.writeFileSync(dataFile, JSON.stringify(parseJson));
      });
    } else {
      console.error("Le site est inaccessible !");
    }
  } catch (error) {
    console.error("Une erreur est survenue !" + error);
    let hook = new Webhook(WebhookUrl);
    let embed = new MessageBuilder()
      .setTitle("Une erreur est survenue !")
      .setDescription("```" + error + "```")
      .setColor("#ff0000")
      .setTimestamp()
      .setFooter("Nistro - EnebaVerify");
    hook.send(embed);
  }
}

switch (intervalTime) {
  case "minute":
    interval2 = "*/" + interval + " * * * *";
    if (interval > 1) {
      intervalTimeFr = "minutes";
    } else {
      intervalTimeFr = "minute";
    }
    break;
  case "hour":
    interval2 = "0 */" + interval + " * * *";
    if (interval > 1) {
      intervalTimeFr = "heures";
    } else {
      intervalTimeFr = "heure";
    }
    break;
  case "day":
    interval2 = "0 0 */" + interval + " * *";
    if (interval > 1) {
      intervalTimeFr = "jours";
    } else {
      intervalTimeFr = "jour";
    }
    break;
  case "week":
    interval2 = "0 0 0 */" + interval + " *";
    if (interval > 1) {
      intervalTimeFr = "semaines";
    } else {
      intervalTimeFr = "semaine";
    }
    break;
  case "month":
    interval2 = "0 0 0 0 */" + interval;
    if (interval > 1) {
      intervalTimeFr = "mois";
    } else {
      intervalTimeFr = "mois";
    }
    break;
}

if (intervalTime !== "minute" && intervalTime !== "hour" && intervalTime !== "day" && intervalTime !== "week" && intervalTime !== "month") {
  let hook = new Webhook(WebhookUrl);
  let embed = new MessageBuilder()
    .setTitle("Une erreur est survenue !")
    .setDescription("```" + "Le temps est incorrect !" + "```" + "\n" + "```" + "Le temps doit être en minute, heure, jour, semaine ou mois !" + "```")
    .setColor("#ff0000")
    .setTimestamp();
    setFooter("Nistro - EnebaVerify");
  hook.send(embed);
  return;
}

hook.setUsername("Nistro - EnebaVerify");
hook.setAvatar(
  "https://media.discordapp.net/attachments/1150228212685738044/1153473557477728367/VBucks.png"
);
let embed = new MessageBuilder()
  .setTitle("Le bot est en ligne !")
  .setDescription(
    "```" +
      "Intervalle: " +
      interval +
      " " +
      intervalTimeFr +
      "\n" +
      "Mention si prix moins cher: " +
      mention +
      "```"
  )
  .setColor("#00ff00")
  .setTimestamp()
  .setFooter("Nistro - EnebaVerify");
hook.send(embed);

console.log("Vérification du site web...");
checkInformations();
cron.schedule(interval2, () => {
     console.log("Vérification du site web...");
     checkInformations();
});

function convertDateToFrench($data) {
  let FrenchDays = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  let FrenchMonths = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  let date = new Date($data);
  let day = FrenchDays[date.getDay()];
  let month = FrenchMonths[date.getMonth()];
  let year = date.getFullYear();

  return day + " " + date.getDate() + " " + month + " " + year;
}
