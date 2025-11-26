import express from "express";
import { faker } from "@faker-js/faker";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./");

app.use(express.static("."));

function makeUsers(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      city: faker.location.city()
    });
  }
  return list;
}

app.get("/", (req, res) => { res.render("home"); });
app.get("/about", (req, res) => { res.render("about"); });

app.get("/quote", async (req, res) => {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    res.render("quote", { quote: data.content, author: data.author });
  } catch {
    res.render("quote", { quote: "There was a problem getting a quote.", author: "" });
  }
});

app.get("/users", (req, res) => {
  const users = makeUsers(5);
  res.render("users", { users });
});

app.get("/combo", async (req, res) => {
  let quote = "There was a problem getting a quote.";
  let author = "";
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    quote = data.content;
    author = data.author;
  } catch {}

  const user = makeUsers(1)[0];
  res.render("combo", { quote, author, user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));